"use client";

/**
 * GoogleAuthButton
 *
 * Renders Google Identity Services (GIS) sign-in / sign-up button.
 * On credential receipt it calls our backend Google SSO endpoint
 * (/backend/api/auth/google) and returns the user's role so the
 * parent page can perform a role-based redirect.
 *
 * Requirements
 *   • NEXT_PUBLIC_GOOGLE_CLIENT_ID must be set in the frontend .env
 *   • miv-backend POST /api/auth/google must be running
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

// ─── Google GSI Type Declarations ────────────────────────────────────────────

interface CredentialResponse {
  credential: string;
  select_by?: string;
  g_csrf_token?: string;
}

interface GsiButtonConfiguration {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
  locale?: string;
}

interface IdConfiguration {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleAccountsId {
  initialize: (config: IdConfiguration) => void;
  renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
  prompt: (notification?: (n: PromptNotification) => void) => void;
  cancel: () => void;
  disableAutoSelect: () => void;
}

interface PromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  getDismissedReason: () => string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
    // Stable callback reference registered on window so re-renders
    // don't break the GSI-registered handler.
    __gsiCallbackRegistry__?: Map<string, (r: CredentialResponse) => void>;
  }
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface GoogleAuthButtonProps {
  /** "login" checks for an existing account; "register" creates one if absent */
  mode: "login" | "register";
  /** Called with the user's role string on successful auth */
  onSuccess: (role: string) => void;
  /** Called with a human-readable error message on failure */
  onError: (message: string) => void;
  /** Optionally disable the button (e.g. while another form is submitting) */
  disabled?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const BACKEND_ENDPOINT = "/backend/api/auth/google";

export function GoogleAuthButton({
  mode,
  onSuccess,
  onError,
  disabled = false,
}: GoogleAuthButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const instanceId = useRef(`gsi-${mode}-${Math.random().toString(36).slice(2)}`);

  // Keep latest callbacks in refs so the stable window-registered handler
  // always calls the current prop values without re-initialising GSI.
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const setIsLoadingRef = useRef(setIsLoading);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    setIsLoadingRef.current = setIsLoading;
  });

  // ── Credential handler (called by GIS after Google popup) ──────────────────
  const handleCredentialResponse = useCallback(
    async (response: CredentialResponse) => {
      if (!response?.credential) {
        onErrorRef.current("Failed to receive Google credentials. Please try again.");
        return;
      }

      setIsLoadingRef.current(true);

      try {
        const res = await fetch(BACKEND_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Required to receive the Set-Cookie header via proxy
          body: JSON.stringify({ idToken: response.credential, mode }),
        });

        let data: {
          success: boolean;
          message?: string;
          error?: string;
          user?: { role: string; email: string; firstName: string; lastName: string };
        };

        try {
          data = await res.json();
        } catch {
          throw new Error("Invalid response from server.");
        }

        if (!res.ok || !data.success) {
          // Surface the exact backend error message for the UI
          onErrorRef.current(data?.message || "Authentication failed. Please try again.");
          return;
        }

        onSuccessRef.current(data.user?.role ?? "user");
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "A network error occurred. Please try again.";
        onErrorRef.current(msg);
      } finally {
        setIsLoadingRef.current(false);
      }
    },
    [mode], // `mode` is stable per page — safe to include
  );

  // ── Register the stable callback on window so GSI always finds it ──────────
  useEffect(() => {
    if (!window.__gsiCallbackRegistry__) {
      window.__gsiCallbackRegistry__ = new Map();
    }
    window.__gsiCallbackRegistry__.set(instanceId.current, handleCredentialResponse);
    return () => {
      window.__gsiCallbackRegistry__?.delete(instanceId.current);
    };
  }, [handleCredentialResponse]);

  // ── Load GSI script & render button ────────────────────────────────────────
  useEffect(() => {
    if (!clientId || typeof window === "undefined") return;

    const renderButton = () => {
      const container = buttonContainerRef.current;
      if (!container || !window.google?.accounts?.id) return;

      const id = instanceId.current;

      window.google.accounts.id.initialize({
        client_id: clientId,
        // Delegate to the registry entry so we always call the latest handler
        callback: (r) => window.__gsiCallbackRegistry__?.get(id)?.(r),
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(container, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: mode === "login" ? "signin_with" : "signup_with",
        shape: "rectangular",
        logo_alignment: "center",
        width: Math.max(container.offsetWidth || 0, 280),
      });

      setScriptReady(true);
    };

    // Script is already loaded (e.g., other page instance loaded it)
    if (window.google?.accounts?.id) {
      renderButton();
      return;
    }

    // Avoid injecting the script twice
    if (document.getElementById("google-gsi-script")) {
      // Script tag present but not yet evaluated — wait for load
      document.getElementById("google-gsi-script")!.addEventListener("load", renderButton, {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    script.onerror = () => {
      console.error("[GoogleSSO] Failed to load Google Identity Services script.");
      setScriptError(true);
    };
    document.head.appendChild(script);
  }, [clientId, mode]);

  // ─── Render ────────────────────────────────────────────────────────────────

  if (!clientId) {
    // NEXT_PUBLIC_GOOGLE_CLIENT_ID not set — show a visible placeholder so the
    // page layout is intact. In production this path should never be hit.
    return (
      <button
        type="button"
        disabled
        title="Google Sign-In is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env file."
        className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-400 opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
        aria-label="Sign in with Google (not configured)"
      >
        {/* Google 'G' logo SVG — no external image dependency */}
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
        {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
      </button>
    );
  }

  return (
    <div className="relative w-full">
      {/* Loading overlay */}
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded bg-white/80 dark:bg-slate-900/80"
          aria-label="Signing in with Google..."
          role="status"
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
            Signing in…
          </span>
        </div>
      )}

      {/* Disabled overlay */}
      {disabled && !isLoading && (
        <div className="absolute inset-0 z-10 cursor-not-allowed rounded bg-white/60 dark:bg-slate-900/60" />
      )}

      {/*
        Google renders its branded button INTO this div.
        We keep min-h so the layout doesn't collapse before the script loads.
      */}
      <div
        ref={buttonContainerRef}
        className="flex w-full justify-center"
        style={{ minHeight: 44 }}
        aria-hidden={isLoading || disabled}
      />

      {/* Error state — shown when the GSI script fails to load */}
      {scriptError && (
        <div className="absolute inset-0 flex items-center justify-center rounded border border-red-200 bg-red-50 px-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-xs text-red-600 dark:text-red-400">
            Google Sign-In unavailable. Check your connection.
          </p>
        </div>
      )}

      {/* Skeleton shown while script is loading */}
      {!scriptReady && !scriptError && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center gap-3 rounded border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-600" />
          <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-600" />
        </div>
      )}
    </div>
  );
}
