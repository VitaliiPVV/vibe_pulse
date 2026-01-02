"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

function FailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Unknown error occurred";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We couldn&apos;t process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium mb-2">What happened?</p>
            <p className="text-sm text-muted-foreground">
              Your payment could not be completed. This might be due to:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>Insufficient funds</li>
              <li>Card declined by your bank</li>
              <li>Incorrect payment details</li>
              <li>Network connection issues</li>
            </ul>
          </div>

          {error && error !== "Unknown error occurred" && (
            <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4">
              <p className="text-sm font-medium text-red-900 dark:text-red-400">
                Error Details:
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={() => router.push("/pricing")}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const Failed = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <FailedContent />
    </Suspense>
  );
};

export default Failed;
