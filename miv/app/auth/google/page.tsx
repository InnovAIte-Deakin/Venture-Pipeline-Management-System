"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";

export default function GoogleAuthPage() {
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    const safeCallback = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/dashboard";
    void signIn("google", { callbackUrl: safeCallback }).then((result) => {
      if (result?.error) setError("Google sign-in could not be completed. Please try again.");
    }).catch(() => setError("Google sign-in could not be completed. Please try again."));
  }, []);

  return (
    <AuthCard>
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
        <GoogleIcon className="size-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">Signing you in...</h1>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">Please wait while we connect to your Google account.</p>
      <div className="my-8 flex flex-col items-center gap-3" role="status" aria-live="polite">
        <Loader2 className="size-9 animate-spin text-blue-600 motion-reduce:animate-none" aria-hidden="true" />
        <span className="text-xs font-semibold tracking-[0.2em] text-slate-500">{error ? "SIGN-IN FAILED" : "AUTHORIZING"}</span>
      </div>
      {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}
      <Button variant="outline" className="h-11 w-full" onClick={() => window.location.replace("/auth/login")}>Cancel</Button>
      <Link className="mt-5 inline-block text-sm font-medium text-slate-600 hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" href="/auth/login">← Back to Login</Link>
    </AuthCard>
  );
}
