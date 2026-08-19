import { DashboardStateShell } from "@/components/dashboard/dashboard-state-shell";

export default function NotFound() {
  return (
    <DashboardStateShell
      kind="error"
      title="Page not found"
      message="The page you're looking for doesn't exist or may have been moved."
    />
  );
}
