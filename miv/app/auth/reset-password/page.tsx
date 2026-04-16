"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters long.";
  if (!/[a-z]/.test(pw)) return "Password must include at least one lowercase letter.";
  if (!/[A-Z]/.test(pw)) return "Password must include at least one uppercase letter.";
  if (!/[0-9]/.test(pw)) return "Password must include at least one number.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password must include at least one special character.";
  return null;
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!token) {
      setError("Missing reset token. Please request a new reset link.");
      return;
    }

    const pwError = validatePassword(newPassword);
    if (pwError) {
      setError(pwError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(data?.message || "Unable to reset password.");
      } else {
        setMessage("Password reset successfully. Redirecting to login...");
        // Small UX improvement: redirect after success
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const passwordHint = useMemo(() => {
    if (!newPassword) return null;
    return validatePassword(newPassword);
  }, [newPassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-2 text-center">Reset Password</h1>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter a new password to complete your reset.
        </p>

        {!token && (
          <p className="mb-4 text-sm text-red-600 text-center">
            Invalid reset link (missing token). Please go back and request a new one.
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <input
              type={showPw ? "text" : "password"}
              placeholder="New password"
              className="w-full border px-3 py-2 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {passwordHint && (
              <p className="text-xs text-gray-600">{passwordHint}</p>
            )}
          </div>

          <input
            type={showPw ? "text" : "password"}
            placeholder="Confirm new password"
            className="w-full border px-3 py-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showPw ? "Hide password" : "Show password"}
            </button>

            <span className="text-xs text-gray-500">
              Min 8, upper, lower, number, symbol
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-green-600 text-center">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
