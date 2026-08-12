"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RecoveryStep = "email" | "otp" | "password" | "success";

const DEMO_OTP = "123456";
const RESEND_SECONDS = 30;

const steps: Array<{ key: RecoveryStep; label: string }> = [
  { key: "email", label: "Email" },
  { key: "otp", label: "Code" },
  { key: "password", label: "Password" },
  { key: "success", label: "Done" },
];

function getPasswordScore(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.filter(Boolean).length;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otpValue = otp.join("");
  const passwordScore = getPasswordScore(password);
  const activeStepIndex = steps.findIndex((item) => item.key === step);
  const passwordStrength = useMemo(() => {
    if (!password) return { label: "Not started", color: "bg-slate-200", width: "0%" };
    if (passwordScore <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (passwordScore <= 4) return { label: "Good", color: "bg-amber-500", width: "66%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  }, [password, passwordScore]);

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;

    const interval = window.setInterval(() => {
      setTimer((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [step, timer]);

  const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));
    setStep("otp");
    setTimer(RESEND_SECONDS);
    setIsSubmitting(false);
  };

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    setError("");

    if (digit && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (otpValue !== DEMO_OTP) {
      setError("Invalid verification code. For this frontend demo, use 123456.");
      setIsSubmitting(false);
      return;
    }

    setStep("password");
    setIsSubmitting(false);
  };

  const resendOtp = () => {
    setOtp(Array(6).fill(""));
    setError("");
    setTimer(RESEND_SECONDS);
    otpRefs.current[0]?.focus();
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (passwordScore < 4) {
      setError("Choose a stronger password before continuing.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    setStep("success");
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-6 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md items-center justify-center sm:max-w-lg">
        <Card className="w-full rounded-xl border-slate-200 bg-white/95 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95 sm:rounded-2xl">
          <CardHeader className="space-y-4 px-5 pb-3 pt-5 text-center sm:px-8 sm:pt-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg sm:h-14 sm:w-14">
              {step === "success" ? (
                <CheckCircle2 className="h-7 w-7 text-white" />
              ) : (
                <ShieldCheck className="h-7 w-7 text-white" />
              )}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                Reset Password
              </CardTitle>
              <CardDescription className="mx-auto max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                {step === "email" && "Enter your account email to receive a verification code."}
                {step === "otp" && "Enter the 6-digit code sent to your email."}
                {step === "password" && "Create a new secure password."}
                {step === "success" && "Your password has been updated successfully."}
              </CardDescription>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2">
              {steps.map((item, index) => (
                <div
                  key={item.key}
                  className={`h-1.5 rounded-full ${
                    index <= activeStepIndex ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                  aria-label={`${item.label} step`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-5 pb-5 sm:px-8 sm:pb-8">
          {step === "email" && (
            <form onSubmit={submitEmail} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="h-11 bg-slate-50 pl-10 dark:bg-slate-700 border-slate-200 dark:border-slate-600 sm:h-12"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="h-11 w-full bg-blue-600 hover:bg-blue-700 sm:h-12" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={verifyOtp} className="space-y-5">
              <div className="space-y-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <Label className="text-slate-700 dark:text-slate-300">Verification code</Label>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Sent to {email || "your email"}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      value={digit}
                      onChange={(event) => updateOtp(index, event.target.value)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      inputMode="numeric"
                      aria-label={`Digit ${index + 1}`}
                      className="aspect-square h-auto min-h-10 rounded-lg bg-slate-50 p-0 text-center text-base font-semibold dark:bg-slate-700 border-slate-200 dark:border-slate-600 sm:min-h-12 sm:text-lg"
                      maxLength={1}
                    />
                  ))}
                </div>
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                  Frontend demo code: {DEMO_OTP}
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="h-11 w-full bg-blue-600 hover:bg-blue-700 sm:h-12"
                disabled={isSubmitting || otpValue.length !== 6}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resendOtp}
                  disabled={timer > 0}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
                </Button>
              </div>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={resetPassword} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                  New password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a new password"
                    className="h-11 bg-slate-50 pr-10 dark:bg-slate-700 border-slate-200 dark:border-slate-600 sm:h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Password strength</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{passwordStrength.label}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className={`h-2 rounded-full transition-all ${passwordStrength.color}`} style={{ width: passwordStrength.width }} />
                </div>
                <ul className="grid gap-1 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-2 sm:gap-x-3">
                  <li className={password.length >= 8 ? "text-green-700 dark:text-green-400" : ""}>8+ characters</li>
                  <li className={/[A-Z]/.test(password) ? "text-green-700 dark:text-green-400" : ""}>Uppercase letter</li>
                  <li className={/[a-z]/.test(password) ? "text-green-700 dark:text-green-400" : ""}>Lowercase letter</li>
                  <li className={/[\d\W]/.test(password) ? "text-green-700 dark:text-green-400" : ""}>Number or symbol</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300">
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm your new password"
                    className="h-11 bg-slate-50 pr-10 dark:bg-slate-700 border-slate-200 dark:border-slate-600 sm:h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="h-11 w-full bg-blue-600 hover:bg-blue-700 sm:h-12" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          )}

          {step === "success" && (
            <div className="space-y-5 text-center">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800">
                Password reset complete. You can now sign in with your new password.
              </div>
              <Button asChild className="h-11 w-full bg-blue-600 hover:bg-blue-700 sm:h-12">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>
          )}

            {step !== "success" && (
            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
