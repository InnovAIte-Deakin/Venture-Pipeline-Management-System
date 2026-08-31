"use client";

import { useState } from "react";
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
import { GoogleIcon } from "@/components/auth/google-icon";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = `/api/session/login`;

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

      // Redirect on success. Honour the proxy's ?next= deep link when it's a safe
      // same-site relative path; otherwise fall back to the role-based landing page.
      if (responseBody?.success && responseBody?.user) {
        const nextParam = new URLSearchParams(window.location.search).get("next");
        const safeNext =
          nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
            ? nextParam
            : null;
        if (safeNext) {
          window.location.href = safeNext;
        } else if (
          responseBody.user.role === "user" ||
          responseBody.user.role === "founder"
        ) {
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
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-50 dark:bg-slate-800"
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              const next = new URLSearchParams(window.location.search).get("next");
              const callbackUrl = next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
              window.location.assign(`/auth/google?callbackUrl=${encodeURIComponent(callbackUrl)}`);
            }}
          >
            <GoogleIcon className="size-5" />
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            or continue with email
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

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

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3"
              disabled={isLoading}
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
