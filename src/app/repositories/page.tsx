
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cloud, Github } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";

export default function RepositoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRepoType, setSelectedRepoType] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const { toast } = useToast();

  const handleConnectClick = (repoType: string) => {
    setSelectedRepoType(repoType);
    setIsModalOpen(true);
    setRepoUrl(""); // Clear previous URL
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
    // In a real app, you'd handle the repository connection here
    console.log(`Connecting to ${selectedRepoType} repository: ${repoUrl}`);
    toast({
      title: "Repository Submitted",
      description: `URL: ${repoUrl} for ${selectedRepoType}. Check console for details.`,
    });
    setIsModalOpen(false);
  };

  const getRepoTypeName = () => {
    if (selectedRepoType === 'github') return "GitHub";
    if (selectedRepoType === 'aws') return "AWS CodeCommit";
    return "Repository";
  }

  return (
    <div className="container mx-auto py-2">
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
          
          <div className="mt-8 p-6 bg-secondary/30 rounded-lg border border-dashed">
            <h3 className="text-xl font-semibold font-headline mb-2">How it works:</h3>
            <ol className="list-decimal list-inside text-muted-foreground space-y-1 text-sm">
              <li>Click "Connect" for your desired repository provider.</li>
              <li>Enter your repository URL in the dialog that appears.</li>
              <li>Authorize CodeGuard to access your selected repositories (read-only - simulated for now).</li>
              <li>Choose which branches or specific commits to analyze (future feature).</li>
              <li>View analysis results directly within the CodeGuard dashboard.</li>
            </ol>
          </div>

        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect {getRepoTypeName()} Repository</DialogTitle>
            <DialogDescription>
              Enter the URL of your {getRepoTypeName()} repository to begin the analysis process.
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitRepository}>Submit Repository</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
