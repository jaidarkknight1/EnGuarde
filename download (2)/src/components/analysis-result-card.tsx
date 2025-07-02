
"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface DisplayableAnalysisResult {
  id: string;
  title: string;
  content: string;
  codeBlock?: string;
  codeBlockLanguage?: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical' | 'Info';
}

interface AnalysisResultCardProps {
  result: DisplayableAnalysisResult;
}

export function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFeedback = (reaction: string) => {
    setFeedback(reaction);
    // Here you could potentially send feedback to a backend if needed
    // For now, it's just UI state
  };
  
  const severityMap = {
    'Critical': 'destructive',
    'High': 'destructive',
    'Medium': 'secondary',
    'Low': 'outline',
    'Info': 'default',
  } as const;

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-xl">{result.title}</CardTitle>
          {result.severity && (
            <Badge variant={severityMap[result.severity] || 'default'}>
              {result.severity}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground whitespace-pre-wrap">{result.content}</p>
          {result.codeBlock && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2 font-headline">Suggested Code:</h4>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code className={`font-code language-${result.codeBlockLanguage || 'plaintext'}`}>
                  {result.codeBlock}
                </code>
              </pre>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant={feedback === "thumbs_up" ? "default" : "outline"}
          size="icon"
          onClick={() => handleFeedback("thumbs_up")}
          aria-label="Helpful"
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          variant={feedback === "thumbs_down" ? "default" : "outline"}
          size="icon"
          onClick={() => handleFeedback("thumbs_down")}
          aria-label="Not helpful"
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        <Button
          variant={feedback === "lightbulb" ? "default" : "outline"}
          size="icon"
          onClick={() => handleFeedback("lightbulb")}
          aria-label="Insightful"
        >
          <Lightbulb className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
