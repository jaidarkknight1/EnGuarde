
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, UploadCloud, FileText, Github, ArrowRight } from "lucide-react";
import { AnalysisResultCard, type DisplayableAnalysisResult } from "@/components/analysis-result-card";
import { codeAnalysisFromPaste, type CodeAnalysisInput, type CodeAnalysisOutput } from "@/ai/flows/code-analysis";
import { improveCodeAwsFramework, type ImproveCodeAwsFrameworkInput, type ImproveCodeAwsFrameworkOutput } from "@/ai/flows/improve-code";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function CodeAnalyzer() {
  const [code, setCode] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<DisplayableAnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setFileName(null);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Please paste or upload some code to analyze.");
      return;
    }
    setError(null);
    setResults([]);

    startTransition(async () => {
      try {
        const analysisPromises = [
          codeAnalysisFromPaste({ code }),
          improveCodeAwsFramework({ code }),
        ];

        const [generalAnalysisResult, awsAnalysisResult] = await Promise.allSettled(analysisPromises);

        const newResults: DisplayableAnalysisResult[] = [];
        let hasErrors = false;

        if (generalAnalysisResult.status === 'fulfilled') {
          const output: CodeAnalysisOutput = generalAnalysisResult.value;
          newResults.push({
            id: `general-${Date.now()}`,
            title: "General Code Analysis & Security Review",
            content: output.recommendations,
            severity: "High", 
          });
        } else {
          console.error("General code analysis error:", generalAnalysisResult.reason);
          newResults.push({
            id: `general-error-${Date.now()}`,
            title: "General Code Analysis & Security Review - Failed",
            content: `An error occurred during this analysis: ${generalAnalysisResult.reason?.message || 'Unknown error'}`,
            severity: "Critical",
          });
          hasErrors = true;
        }

        if (awsAnalysisResult.status === 'fulfilled') {
          const output: ImproveCodeAwsFrameworkOutput = awsAnalysisResult.value;
          newResults.push({
            id: `aws-${Date.now()}`,
            title: "AWS Well-Architected Framework Analysis",
            content: output.explanation,
            codeBlock: output.improvedCode,
            codeBlockLanguage: "python", // This could be made dynamic in a future iteration
            severity: "Info",
          });
        } else {
          console.error("AWS analysis error:", awsAnalysisResult.reason);
          newResults.push({
            id: `aws-error-${Date.now()}`,
            title: "AWS Well-Architected Framework Analysis - Failed",
            content: `An error occurred during this analysis: ${awsAnalysisResult.reason?.message || 'Unknown error'}`,
            severity: "Critical",
          });
          hasErrors = true;
        }
        
        setResults(newResults);
        if (hasErrors) {
            setError("One or more analyses encountered an issue. Please check the results below.");
        }

      } catch (e) { 
        console.error("Overall analysis submission error:", e);
        setError("An unexpected error occurred while initiating analysis. Please try again.");
        setResults([]);
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Code Analysis Engine</CardTitle>
          <CardDescription>
            Paste your code, upload a file, or connect a repository to get AI-powered insights.
            All available analyses (General/Security & AWS Well-Architected) will be performed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-4">
              <TabsTrigger value="paste"><FileText className="mr-2 h-4 w-4" />Paste Code</TabsTrigger>
              <TabsTrigger value="upload"><UploadCloud className="mr-2 h-4 w-4" />Upload File</TabsTrigger>
              <TabsTrigger value="repository"><Github className="mr-2 h-4 w-4" />Repository</TabsTrigger>
            </TabsList>
            
            <TabsContent value="paste">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code-input" className="text-lg font-headline">Paste your code here:</Label>
                  <Textarea
                    id="code-input"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setFileName(null); }}
                    placeholder="Enter your code snippet..."
                    rows={15}
                    className="mt-2 font-code text-sm leading-relaxed p-4 bg-background border rounded-md shadow-inner focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <div className="space-y-4">
                <Label htmlFor="file-upload" className="text-lg font-headline">Upload a code file:</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="mt-2"
                  accept=".js,.ts,.py,.java,.cs,.go,.rb,.php,.html,.css, text/*"
                />
                {fileName && <p className="text-sm text-muted-foreground mt-2">Selected file: {fileName}</p>}
                 {code && fileName && (
                  <Textarea
                    id="file-preview"
                    value={code}
                    readOnly
                    rows={10}
                    className="mt-2 font-code text-sm bg-muted/50 p-4 rounded-md"
                    aria-label="File preview"
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="repository">
               <div className="text-center py-10 px-4">
                <Github className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-headline mb-2">Analyze Code from Repositories</h3>
                <p className="text-muted-foreground mb-6">
                  To analyze code directly from your GitHub or AWS CodeCommit repositories, please connect your accounts first.
                  Once connected, you will be able to select repositories for analysis here.
                </p>
                <Link href="/repositories" passHref>
                  <Button size="lg">
                    Connect Repositories <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-4">
            <Button onClick={handleSubmit} disabled={isPending || !code.trim()} className="w-full md:w-auto text-lg py-3 px-6">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Code"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-headline">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isPending && (
         <div className="space-y-6 mt-8">
          {[...Array(2)].map((_, i) => ( // Skeleton for two analysis cards
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-20 w-full mt-4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-24 ml-auto" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isPending && results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 font-headline text-center">Analysis Results</h2>
          {results.map((result) => (
            <AnalysisResultCard key={result.id} result={result} />
          ))}
        </div>
      )}
       {!isPending && results.length === 0 && !error && !code &&(
         <Card className="mt-8 text-center py-10 shadow-sm">
          <CardContent>
            <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground font-headline">Ready for comprehensive code analysis.</p>
            <p className="text-sm text-muted-foreground">Paste code or upload a file to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
