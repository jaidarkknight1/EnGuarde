
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useState } from "react";

const awsPillars = [
  { id: "security", label: "Security" },
  { id: "operationalExcellence", label: "Operational Excellence" },
  { id: "reliability", label: "Reliability" },
  { id: "performanceEfficiency", label: "Performance Efficiency" },
  { id: "costOptimization", label: "Cost Optimization" },
  { id: "sustainability", label: "Sustainability" },
];

const solidPrinciples = [
  { id: "srp", label: "Single Responsibility Principle (SRP)" },
  { id: "ocp", label: "Open/Closed Principle (OCP)" },
  { id: "lsp", label: "Liskov Substitution Principle (LSP)" },
  { id: "isp", label: "Interface Segregation Principle (ISP)" },
  { id: "dip", label: "Dependency Inversion Principle (DIP)" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  // In a real app, these would come from user preferences/API
  const [selectedPillars, setSelectedPillars] = useState<Record<string, boolean>>({ 
    security: true, 
    operationalExcellence: true, 
    reliability: true, 
    performanceEfficiency: true, 
    costOptimization: true, 
    sustainability: true 
  });
  const [selectedPrinciples, setSelectedPrinciples] = useState<Record<string, boolean>>({ 
    srp: true, 
    ocp: true, 
    lsp: true, 
    isp: true, 
    dip: true 
  });

  const handlePillarChange = (pillarId: string, checked: boolean) => {
    setSelectedPillars(prev => ({ ...prev, [pillarId]: checked }));
  };

  const handlePrincipleChange = (principleId: string, checked: boolean) => {
    setSelectedPrinciples(prev => ({ ...prev, [principleId]: checked }));
  };

  const handleSaveSettings = () => {
    // Placeholder for saving settings
    console.log("Selected AWS Pillars:", selectedPillars);
    console.log("Selected SOLID Principles:", selectedPrinciples);
    toast({
      title: "Settings Saved",
      description: "Your analysis preferences have been updated.",
    });
  };

  return (
    <div className="container mx-auto py-2">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Analysis Settings</CardTitle>
          <CardDescription>
            Customize the frameworks and principles CodeGuard uses for code analysis.
            These settings refine the focus of AI-driven recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-headline">AWS Well-Architected Pillars</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Select the AWS Well-Architected Pillars to focus on during code reviews. 
              This helps align your code with AWS best practices for cloud architecture.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {awsPillars.map((pillar) => (
                <div key={pillar.id} className="flex items-center space-x-3 p-4 bg-secondary/20 rounded-lg border">
                  <Checkbox
                    id={`pillar-${pillar.id}`}
                    checked={selectedPillars[pillar.id] || false}
                    onCheckedChange={(checked) => handlePillarChange(pillar.id, Boolean(checked))}
                  />
                  <Label htmlFor={`pillar-${pillar.id}`} className="text-base font-medium cursor-pointer">
                    {pillar.label}
                  </Label>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 font-headline">SOLID Principles</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Choose which SOLID principles to emphasize in the analysis. 
              Adhering to SOLID principles leads to more maintainable, scalable, and robust software.
            </p>
            <div className="space-y-4">
              {solidPrinciples.map((principle) => (
                <div key={principle.id} className="flex items-center space-x-3 p-3 bg-secondary/20 rounded-lg border">
                  <Checkbox
                    id={`principle-${principle.id}`}
                    checked={selectedPrinciples[principle.id] || false}
                    onCheckedChange={(checked) => handlePrincipleChange(principle.id, Boolean(checked))}
                  />
                  <Label htmlFor={`principle-${principle.id}`} className="text-base font-medium cursor-pointer">
                    {principle.label}
                  </Label>
                </div>
              ))}
            </div>
          </section>
          
          <Separator />

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveSettings} size="lg">
              <Save className="mr-2 h-5 w-5" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
