"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setToken(new URLSearchParams(window.location.search).get("token") || ""); }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) { setError("This password reset link is invalid or incomplete. Request a new link and try again."); return; }
    if (password.length < 8) { setError("Your new password must be at least 8 characters long."); return; }
    if (password !== confirmation) { setError("The passwords do not match."); return; }
    setError(""); setIsLoading(true);
    try {
      await authClient.resetPassword(token, password);
      setIsComplete(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The reset link is invalid or expired. Please request a new one.");
    } finally { setIsLoading(false); }
  };

  if (isComplete) {
    return (
      <AuthCard>
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-8" aria-hidden="true" /></div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Password Reset Successful</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600" role="status">Your password has been updated. You can now sign in with your new password.</p>
        <Button asChild className="mt-8 h-11 w-full bg-blue-600 text-white hover:bg-blue-700"><Link href="/auth/login">Back to Login</Link></Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-blue-50 text-blue-600"><KeyRound className="size-8" aria-hidden="true" /></div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">Reset Password</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">Choose a secure new password for your account.</p>
      <form className="mt-8 space-y-5 text-left" onSubmit={submit}>
        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <div className="relative"><Input id="new-password" type={showPassword ? "text" : "password"} minLength={8} autoComplete="new-password" required value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} className="h-11 pr-11" disabled={isLoading} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
        </div>
        <div className="space-y-2"><Label htmlFor="confirm-password">Confirm new password</Label><Input id="confirm-password" type={showPassword ? "text" : "password"} minLength={8} autoComplete="new-password" required value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setError(""); }} className="h-11" disabled={isLoading} /></div>
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        <Button type="submit" disabled={isLoading || !password || !confirmation} className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700">{isLoading ? <><Loader2 className="animate-spin motion-reduce:animate-none" /> Resetting...</> : "Reset Password"}</Button>
      </form>
      <Link className="mt-7 inline-block text-sm font-medium text-slate-600 hover:text-blue-700" href="/auth/forgot-password">Request a new reset link</Link>
    </AuthCard>
  );
}
