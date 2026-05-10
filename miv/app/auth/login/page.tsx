"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleAuthButton } from "@/components/ui/google-auth-button";

// ─── Role → redirect mapping (mirrors the backend roles) ─────────────────────
function getRedirectPathForRole(role: string | undefined): string {
  if (role === "user" || role === "founder") return "/user-dashboard";
  return "/dashboard"; // admin, miv_analyst, etc.
}

// Validate that a redirect target is a safe internal path (no open-redirect)
function safeNextPath(next: string | null, fallback: string): string {
  if (!next) return fallback;
  try {
    // Reject absolute URLs and protocol-relative paths
    if (next.startsWith("http") || next.startsWith("//") || next.startsWith("\\")) {
      return fallback;
    }
    // Must start with /
    return next.startsWith("/") ? next : fallback;
  } catch {
    return fallback;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Credentials login ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/backend/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        const msg = responseBody?.message || "Invalid email or password";
        throw new Error(msg);
      }

      if (responseBody?.success === true) {
        const dest = safeNextPath(nextParam, getRedirectPathForRole(responseBody?.user?.role));
        window.location.href = dest;
      } else {
        setError(responseBody?.message || "Invalid email or password");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google SSO callbacks ───────────────────────────────────────────────────
  const handleGoogleSuccess = useCallback((role: string) => {
    setError("");
    const dest = safeNextPath(nextParam, getRedirectPathForRole(role));
    window.location.href = dest;
  }, [nextParam]);

  const handleGoogleError = useCallback((message: string) => {
    setError(message);
    setIsGoogleLoading(false);
  }, []);

  const isAnyLoading = isLoading || isGoogleLoading;

  // ─── Render ────────────────────────────────────────────────────────────────
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

        <CardContent className="space-y-5">
          {/* ── Google SSO ── */}
          <GoogleAuthButton
            mode="login"
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={isAnyLoading}
          />

          {/* ── Divider ── */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-600" />
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              or continue with email
            </span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-600" />
          </div>

          {/* ── Email / Password form ── */}
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
                disabled={isAnyLoading}
                autoComplete="email"
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
                  disabled={isAnyLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3"
              disabled={isAnyLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* ── Footer links ── */}
          <div className="text-center space-y-3">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Forgot Password?
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
