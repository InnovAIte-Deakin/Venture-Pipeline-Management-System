"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const authState =
    error === "AccessDenied"
      ? {
          title: "Google sign-in was cancelled",
          description:
            "You closed the Google sign-in window before the account could be connected.",
          tone: "default" as const,
        }
      : {
          title: "Google sign-in failed",
          description:
            "We could not complete the Google authentication request. Please try again or use your email and password.",
          tone: "destructive" as const,
        };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Authentication Notice
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              {authState.title}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <Alert variant={authState.tone}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{authState.title}</AlertTitle>
            <AlertDescription>{authState.description}</AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <Link href="/auth/login" className="w-full">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
