"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Analysis {
  mood: string;
  stress_level: number;
  topic: string;
  summary: string;
  advice: string;
}

const Journal = () => {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error("Please write something first");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/groq-analize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze");
      }

      const data = await response.json();
      setAnalysis(data);
      
      const saveResponse = await fetch("/api/journal/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, analysis: data }),
      });

      if (saveResponse.ok) {
        toast.success("Entry analyzed and saved!");
      } else {
        toast.warning("Entry analyzed but failed to save");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Journal Entry</h1>
        <p className="text-muted-foreground">
          Write about your day and get AI-powered insights
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>How was your day?</CardTitle>
            <CardDescription>
              Share your thoughts, feelings, and experiences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Today I felt..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] resize-none"
              disabled={loading}
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze & Save"
              )}
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                AI-powered insights about your entry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  Mood
                </h3>
                <p className="text-lg">{analysis.mood}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  Stress Level
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(analysis.stress_level / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {analysis.stress_level}/10
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  Topic
                </h3>
                <p>{analysis.topic}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  Summary
                </h3>
                <p>{analysis.summary}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  Advice
                </h3>
                <p className="text-sm leading-relaxed">{analysis.advice}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default Journal;
