"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) { event.currentTarget.reportValidity(); return; }
    setError(""); setIsLoading(true);
    try {
      await authClient.forgotPassword(email.trim().toLowerCase());
      setIsComplete(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not send reset instructions. Please try again.");
    } finally { setIsLoading(false); }
  };

  if (isComplete) {
    return (
      <AuthCard>
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-8" aria-hidden="true" /></div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Check your email</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600" role="status">If an account exists for this email address, we've sent password reset instructions.</p>
        <Button asChild className="mt-8 h-11 w-full bg-blue-600 text-white hover:bg-blue-700"><Link href="/auth/login">Back to Login</Link></Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Mail className="size-8" aria-hidden="true" /></div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">Forgot Password?</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">Enter the email address associated with your account and we'll send you instructions to reset your password.</p>
      <form className="mt-8 space-y-5 text-left" onSubmit={submit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="recovery-email" className="text-slate-700">Email address</Label>
          <Input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="you@example.com" aria-invalid={Boolean(error)} className="h-11 bg-white" disabled={isLoading} />
        </div>
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        <Button type="submit" disabled={isLoading || !email.trim()} className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700">
          {isLoading ? <><Loader2 className="animate-spin motion-reduce:animate-none" /> Sending...</> : "Send Reset Link"}
        </Button>
      </form>
      <Link className="mt-7 inline-block text-sm font-medium text-slate-600 hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" href="/auth/login">← Back to Login</Link>
    </AuthCard>
  );
}
