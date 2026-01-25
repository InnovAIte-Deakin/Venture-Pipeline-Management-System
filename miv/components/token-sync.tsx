"use client";

import { useEffect } from "react";
import { getSession } from "next-auth/react";

const SESSION_MARKER_KEY = "miv-session-marker";

export default function TokenSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sync = async () => {
      const session = await getSession();
      console.log("TokenSync getSession:", session);

      if (session?.user) {
        const marker =
          (session as any).accessToken ||
          (session.user as any).id ||
          (session.user as any).email ||
          "logged-in";

        localStorage.setItem(SESSION_MARKER_KEY, marker);
      } else {
        localStorage.removeItem(SESSION_MARKER_KEY);
      }
    };

    sync();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "nextauth.message") {
        sync();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return null;
}
