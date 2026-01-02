"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";

const Success = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Welcome to Vibe Pulse Pro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Unlimited Journal Entries</p>
                <p className="text-sm text-muted-foreground">
                  Write as many entries as you want
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Advanced AI Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Get deeper insights into your emotional patterns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Priority Support</p>
                <p className="text-sm text-muted-foreground">
                  Get help whenever you need it
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-center text-muted-foreground">
              Your subscription is now active. You can start enjoying all Pro features immediately!
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full"
              size="lg"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/journal")}
              variant="outline"
              className="w-full"
            >
              Start Journaling
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
