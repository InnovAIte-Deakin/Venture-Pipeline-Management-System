"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { VerificationCodeInput } from "@/components/auth/verification-code-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthRequestError, authClient } from "@/lib/auth-client";

const RESEND_SECONDS = 60;

export default function VerificationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [storedEmail, setStoredEmail] = useState("");
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const email = session?.user?.email || storedEmail;

  useEffect(() => {
    setStoredEmail(window.sessionStorage.getItem("authVerificationEmail") || "");
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const maskedEmail = useMemo(() => {
    if (!email) return "your email address";
    const [name, domain] = email.split("@");
    if (!domain) return email;
    return `${name.slice(0, 2)}${"•".repeat(Math.max(2, name.length - 2))}@${domain}`;
  }, [email]);

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (code.length !== 6) { setError("Enter all six digits of your verification code."); return; }
    if (!email) { setError("Your verification session has expired. Please return to login and request a new code."); return; }
    setError(""); setIsVerifying(true);
    try {
      const result = await authClient.verifyCode(email, code);
      router.replace(result?.redirectTo || "/dashboard");
    } catch (requestError) {
      if (requestError instanceof AuthRequestError && requestError.status === 403) { router.replace("/forbidden"); return; }
      setError(requestError instanceof Error ? requestError.message : "The code is incorrect or expired. Please try again.");
    } finally { setIsVerifying(false); }
  };

  const resend = async () => {
    if (!email || isResending || seconds > 0) return;
    setError(""); setResent(false); setIsResending(true);
    try {
      await authClient.resendCode(email);
      setSeconds(RESEND_SECONDS); setResent(true);
    } catch (requestError) {
      if (requestError instanceof AuthRequestError && requestError.status === 403) { router.replace("/forbidden"); return; }
      setError(requestError instanceof Error ? requestError.message : "A new code could not be sent. Please try again.");
    } finally { setIsResending(false); }
  };

  return (
    <AuthCard width="md">
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-blue-50 text-blue-600"><ShieldCheck className="size-8" aria-hidden="true" /></div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Enter Verification Code</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">We sent a six-digit verification code to <span className="font-medium text-slate-800">{maskedEmail}</span>.</p>
      <form className="mt-8" onSubmit={verify}>
        <VerificationCodeInput value={code} onChange={(value) => { setCode(value); setError(""); }} disabled={isVerifying} invalid={Boolean(error)} />
        {error && <Alert variant="destructive" className="mt-5 text-left" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
        {resent && <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-emerald-700" role="status"><Check className="size-4" /> A new code has been sent.</p>}
        <Button type="submit" disabled={isVerifying || code.length !== 6} className="mt-7 h-11 w-full bg-blue-600 text-white hover:bg-blue-700">
          {isVerifying ? <><Loader2 className="animate-spin motion-reduce:animate-none" /> Verifying...</> : "Verify Code"}
        </Button>
      </form>
      <div className="mt-6 text-sm text-slate-600">
        <p>Didn't receive the code?</p>
        {seconds > 0 ? <p className="mt-2 font-medium text-slate-500" aria-live="polite">Resend in {seconds}s</p> : <button className="mt-2 font-semibold text-blue-700 hover:underline disabled:opacity-50" disabled={isResending || !email} onClick={resend}>{isResending ? "Sending..." : "Resend Code"}</button>}
      </div>
      <Link className="mt-7 inline-block text-sm font-medium text-slate-600 hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" href="/auth/login">← Back to Login</Link>
    </AuthCard>
  );
}
