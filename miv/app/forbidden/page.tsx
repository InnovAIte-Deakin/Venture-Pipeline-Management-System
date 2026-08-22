"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  const goBack = () => {
    if (window.history.length > 1 && document.referrer) window.history.back();
    else window.location.assign("/dashboard");
  };

  return (
    <AuthCard width="md">
      <div className="relative mx-auto mb-6 w-fit">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600"><ShieldX className="size-8" aria-hidden="true" /></div>
        <span className="absolute -right-3 -top-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">403</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">Access Denied</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600">You do not have permission to access this page. Please return to a safe page or contact your administrator if you believe this is a mistake.</p>
      <div className="mt-8 space-y-3">
        <Button asChild className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"><Link href="/dashboard">Go to Dashboard</Link></Button>
        <Button variant="outline" className="h-11 w-full" onClick={goBack}>← Back to Previous Page</Button>
      </div>
      <a className="mt-6 inline-block text-sm font-medium text-blue-700 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" href="mailto:support@miv.org">Contact Support</a>
    </AuthCard>
  );
}
