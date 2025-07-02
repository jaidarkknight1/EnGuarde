
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AnalysisResultCard, type DisplayableAnalysisResult } from "@/components/analysis-result-card";
import { Cloud, Github, Loader2, CheckCircle2, XCircle } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";

interface ConnectedRepository {
  id: string;
  name: string;
  url: string;
  type: 'github' | 'aws';
  status: 'scanning' | 'completed' | 'failed';
  results?: DisplayableAnalysisResult[];
}

export default function RepositoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRepoType, setSelectedRepoType] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [pat, setPat] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectedRepos, setConnectedRepos] = useState<ConnectedRepository[]>([]);
  const { toast } = useToast();

  const handleConnectClick = (repoType: string) => {
    setSelectedRepoType(repoType);
    setIsModalOpen(true);
    setRepoUrl("");
    setPat("");
  };

  const handleSubmitRepository = () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Error",
        description: "Repository URL cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    if (selectedRepoType === 'github' && !pat.trim()) {
      toast({
        title: "Error",
        description: "Personal Access Token (PAT) is required for GitHub.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // In a real app, you'd handle the repository connection here
    console.log(`Connecting to ${selectedRepoType} repository: ${repoUrl}`);
    
    const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'Unknown Repository';
    const newRepo: ConnectedRepository = {
      id: `${Date.now()}`,
      name: repoName,
      url: repoUrl,
      type: selectedRepoType as 'github' | 'aws',
      status: 'scanning',
    };

    setConnectedRepos(prev => [...prev, newRepo]);
    
    toast({
      title: "Repository submitted for scanning",
      description: `Now scanning ${repoName}.`,
    });
    
    setIsModalOpen(false);

    // Simulate scan after a delay
    setTimeout(() => {
      const dummyResults: DisplayableAnalysisResult[] = [
        {
          id: `scan-general-${newRepo.id}`,
          title: `General Scan for ${newRepo.name}`,
          content: 'The repository scan found 3 medium-severity issues related to outdated dependencies and 1 high-severity issue with improper error handling.',
          severity: 'High',
        },
        {
          id: `scan-aws-${newRepo.id}`,
          title: `AWS Well-Architected Scan for ${newRepo.name}`,
          content: 'The IaC configuration follows most AWS best practices. One suggestion is to enable multi-AZ deployment for the RDS instance for better reliability.',
          codeBlock: 'resource "aws_db_instance" "default" {\n  multi_az = true\n}',
          codeBlockLanguage: 'terraform',
          severity: 'Info',
        },
      ];

      setConnectedRepos(prev => prev.map(repo => 
        repo.id === newRepo.id 
        ? { ...repo, status: 'completed', results: dummyResults } 
        : repo
      ));
      setIsSubmitting(false);
    }, 4000);
  };

  const getRepoTypeName = () => {
    if (selectedRepoType === 'github') return "GitHub";
    if (selectedRepoType === 'aws') return "AWS CodeCommit";
    return "Repository";
  }

  const renderStatusBadge = (status: ConnectedRepository['status']) => {
    switch (status) {
      case 'scanning':
        return <Badge variant="secondary"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Scanning</Badge>;
      case 'completed':
        return <Badge variant="success"><CheckCircle2 className="mr-2 h-4 w-4" />Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="mr-2 h-4 w-4" />Failed</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-2 space-y-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Connect Repositories</CardTitle>
          <CardDescription>
            Integrate CodeGuard with your source code repositories to enable automated scanning and analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Github className="h-10 w-10 text-primary" />
                  <CardTitle className="font-headline">GitHub</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyze repositories hosted on GitHub.
                </p>
                <Button className="w-full" onClick={() => handleConnectClick('github')}>
                  <Github className="mr-2 h-4 w-4" /> Connect to GitHub
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Cloud className="h-10 w-10 text-primary" />
                  <CardTitle className="font-headline">AWS CodeCommit</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Securely analyze repositories hosted on AWS CodeCommit.
                </p>
                <Button className="w-full" onClick={() => handleConnectClick('aws')}>
                  <Cloud className="mr-2 h-4 w-4" /> Connect to CodeCommit
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4">Connected Repositories</h2>
        <Card>
          <CardContent className="pt-6">
            {connectedRepos.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {connectedRepos.map(repo => (
                  <AccordionItem value={repo.id} key={repo.id}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          {repo.type === 'github' ? <Github className="h-6 w-6 text-primary" /> : <Cloud className="h-6 w-6 text-primary" />}
                          <div>
                            <p className="font-semibold text-left">{repo.name}</p>
                            <p className="text-xs text-muted-foreground text-left">{repo.url}</p>
                          </div>
                        </div>
                        {renderStatusBadge(repo.status)}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-secondary/20 border-t">
                      {repo.status === 'completed' && repo.results ? (
                        <div className="space-y-4">
                          {repo.results.map(result => <AnalysisResultCard key={result.id} result={result} />)}
                        </div>
                      ) : repo.status === 'scanning' ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          <p className="text-muted-foreground">Scan in progress...</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-8">
                          <XCircle className="mr-2 h-6 w-6 text-destructive" />
                          <p className="text-destructive">Scan failed. Please try again.</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-10 border-2 border-dashed rounded-lg bg-secondary/20">
                <p className="text-muted-foreground">No repositories connected yet.</p>
                <p className="text-sm text-muted-foreground">Connect one to start scanning.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Connect {getRepoTypeName()} Repository</DialogTitle>
            <DialogDescription>
              Enter the details of your {getRepoTypeName()} repository to begin the analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="repo-url" className="text-right">
                URL
              </Label>
              <Input
                id="repo-url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="col-span-3"
                placeholder={`https://your-provider.com/user/repo.git`}
              />
            </div>
            {selectedRepoType === 'github' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pat" className="text-right">
                  PAT
                </Label>
                <Input
                  id="pat"
                  type="password"
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter your Personal Access Token"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitRepository} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Repository
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
