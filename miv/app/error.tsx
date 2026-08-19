"use client";

import { useEffect } from "react";
import { DashboardStateShell } from "@/components/dashboard/dashboard-state-shell";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <DashboardStateShell
      kind="error"
      title="Something went wrong"
      message="We couldn't complete your request. Please go back and try again, or return to the dashboard."
    />
  );
}
