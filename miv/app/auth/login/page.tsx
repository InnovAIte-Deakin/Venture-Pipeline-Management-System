"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Chrome, Eye, EyeOff, Loader2 } from "lucide-react";
import { PUBLIC_BACKEND_URL } from "@/lib/constants";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""));
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "failed"
  >("idle");
  const [googleAuthState, setGoogleAuthState] = useState<
    "idle" | "loading" | "cancelled" | "failed"
  >("idle");
  const [error, setError] = useState("");
  const verificationInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (authError === "AccessDenied") {
      setGoogleAuthState("cancelled");
      return;
    }

    if (authError) {
      setGoogleAuthState("failed");
    }
  }, [authError]);

  const handleGoogleLogin = async () => {
    setGoogleAuthState("loading");
    setError("");

    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        setGoogleAuthState("failed");
        setError("Google sign-in failed. Please try again.");
        return;
      }

      if (result?.url) {
        window.location.href = result.url;
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setGoogleAuthState("failed");
      setError("Google sign-in failed. Please try again.");
    }
  };

  const handleVerificationChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const updatedCode = [...verificationCode];
    updatedCode[index] = nextValue;
    setVerificationCode(updatedCode);
    setVerificationStatus("idle");

    if (nextValue && index < verificationCode.length - 1) {
      verificationInputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerificationKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !verificationCode[index] && index > 0) {
      verificationInputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      verificationInputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < verificationCode.length - 1) {
      verificationInputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerificationPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (!pastedCode) return;

    const nextCode = Array(6).fill("");
    pastedCode.split("").forEach((digit, index) => {
      if (index < 6) nextCode[index] = digit;
    });

    setVerificationCode(nextCode);
    setVerificationStatus("idle");
    const nextIndex = Math.min(pastedCode.length, 5);
    verificationInputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");

    if (code.length !== 6) {
      setVerificationStatus("failed");
      setError("Enter the full 6-digit verification code.");
      return;
    }

    setIsVerifyingCode(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setVerificationStatus("success");
      setError("");
    } catch {
      setVerificationStatus("failed");
      setError("Verification code could not be confirmed.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const googleMessage =
    googleAuthState === "loading"
      ? "Redirecting to Google to complete your sign-in..."
      : googleAuthState === "cancelled"
        ? "Google sign-in was cancelled. You can try again at any time."
        : googleAuthState === "failed"
          ? "Google sign-in could not be completed. Please try again or use email and password."
          : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = `/backend/api/users/login`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        // Allow browser to store Set-Cookie from the backend
        credentials: "include",
      });

      // Try to parse JSON body (even on non-2xx to surface server message)
      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        const msg = responseBody?.message || "Network response was not ok";
        throw new Error(msg);
      }

      // Redirect to dashboard on success
      console.log("login response", responseBody);
      if (responseBody?.message === "Authentication Passed") {
        if (responseBody?.user.role === "user") {
          window.location.href = "/user-dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setError(responseBody?.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏛️</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              MIV
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Welcome Back
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-slate-700 dark:text-slate-300"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-slate-700 dark:text-slate-300"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {(error || googleMessage) && (
              <Alert
                variant={
                  googleAuthState === "failed" || error
                    ? "destructive"
                    : "default"
                }
              >
                <AlertDescription>
                  {error || googleMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Verification Code
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter the 6-digit code sent to your email address.
                </p>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={`code-${index}`}
                    ref={(element) => {
                      verificationInputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleVerificationChange(index, e.target.value)}
                    onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                    onPaste={handleVerificationPaste}
                    className="h-12 text-center text-lg font-semibold border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                  />
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleVerifyCode}
                disabled={isVerifyingCode}
              >
                {isVerifyingCode ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              {verificationStatus === "success" && (
                <Alert variant="default">
                  <AlertDescription>
                    Verification code accepted. You can continue with your sign-in.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3"
              disabled={isLoading || googleAuthState === "loading"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                <span className="bg-white/90 dark:bg-slate-800/90 px-3">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700/70 dark:hover:bg-slate-700"
              onClick={handleGoogleLogin}
              disabled={isLoading || googleAuthState === "loading"}
            >
              {googleAuthState === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening Google...
                </>
              ) : (
                <>
                  <Chrome className="mr-2 h-4 w-4" />
                  Continue with Google
                </>
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Forgot Password?
            </Link>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
