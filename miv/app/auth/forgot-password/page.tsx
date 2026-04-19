"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const submitRequest = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:3001/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong.");
      } else {
        setMessage(
          "If this email or username exists in our system, a password reset link will be sent."
        );
        setHasSubmitted(true);
      }
    } catch (err) {
      setError("Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRequest();
  };

  const handleResend = async () => {
    await submitRequest();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-2 text-center">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your registered email or username and we’ll send you a password
          reset link!!
        </p>

        {!hasSubmitted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username Input */}
            <input
              type="text"
              placeholder="Email or username"
              className="w-full border px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Sending..." : "Reset password"}
            </button>
          </form>
        )}

        {/* Confirmation Message */}
        {message && (
          <p className="mt-4 text-sm text-green-600 text-center">{message}</p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}

        {/* Resend Option */}
        {hasSubmitted && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Didn’t receive the email?
            </p>
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-sm text-blue-600 hover:underline mt-1 disabled:opacity-50"
            >
              {loading ? "Resending..." : "Resend reset link"}
            </button>
          </div>
        )}

        {/* Back to Login */}
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
