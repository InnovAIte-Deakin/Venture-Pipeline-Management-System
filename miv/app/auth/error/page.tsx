"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

const messages: Record<string, string> = {
  AccessDenied: "Your Google account is not permitted to access this application.",
  OAuthAccountNotLinked: "This email is already associated with another sign-in method.",
  OAuthCallback: "Google sign-in could not be completed. Please try again.",
  Configuration: "Google sign-in is temporarily unavailable. Please contact support.",
};

export default function AuthErrorPage() {
  const [code, setCode] = useState("");
  useEffect(() => {
    setCode(new URLSearchParams(window.location.search).get("error") || "");
  }, []);
  const message = messages[code] || "We could not sign you in. Please try again or use email and password.";

  return (
    <AuthCard>
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600"><CircleAlert className="size-8" aria-hidden="true" /></div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">Sign-in Failed</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600" role="alert">{message}</p>
      <Button asChild className="mt-8 h-11 w-full bg-blue-600 text-white hover:bg-blue-700"><Link href="/auth/login">Return to Login</Link></Button>
      <a className="mt-6 inline-block text-sm font-medium text-blue-700 hover:underline" href="mailto:support@miv.org">Contact Support</a>
    </AuthCard>
  );
}
