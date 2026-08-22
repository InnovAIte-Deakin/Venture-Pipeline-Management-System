export class AuthRequestError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "AuthRequestError";
  }
}

async function postOtp(path: string, body: Record<string, string>, signal?: AbortSignal) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
    signal,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const fallback = response.status === 403
      ? "You do not have permission to complete this request."
      : response.status === 404
        ? "Verification is not available yet. Please contact support."
        : "We could not complete the request. Please try again.";
    throw new AuthRequestError(payload?.message || payload?.error || fallback, response.status);
  }
  return payload;
}

async function postPasswordRecovery(path: string, body: Record<string, string>, signal?: AbortSignal) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
    signal,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new AuthRequestError(
      payload?.message || "We could not complete the request. Please try again.",
      response.status,
    );
  }
  return payload;
}

export const authClient = {
  verifyCode(email: string, code: string, signal?: AbortSignal) {
    return postOtp("/api/auth/otp/verify", { email, code }, signal);
  },
  resendCode(email: string, signal?: AbortSignal) {
    return postOtp("/api/auth/otp/resend", { email }, signal);
  },
  forgotPassword(email: string, signal?: AbortSignal) {
    return postPasswordRecovery("/backend/api/auth/forgot-password", { email }, signal);
  },
  resetPassword(token: string, newPassword: string, signal?: AbortSignal) {
    return postPasswordRecovery("/backend/api/auth/reset-password", { token, newPassword }, signal);
  },
};
