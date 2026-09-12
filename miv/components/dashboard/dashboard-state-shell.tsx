"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";

type DashboardStateShellProps =
  | {
      kind: "loading";
      message?: string;
    }
  | {
      kind: "error";
      title: string;
      message: string;
    };

export function DashboardStateShell(props: DashboardStateShellProps) {
  const router = useRouter();
  const isLoading = props.kind === "loading";
  const screenTitle = isLoading ? "Authentication" : "Error";

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-slate-100 lg:hidden">
          <MobileNav title={screenTitle} />
          <main className="flex min-h-screen items-center justify-center px-4 pb-24 pt-20">
            <section
              className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm"
              aria-live="polite"
            >
              <LoaderCircle
                className="mx-auto h-10 w-10 animate-spin text-teal-600"
                aria-hidden="true"
              />
              <p className="mt-5 text-base font-medium text-slate-700">
                {props.message ?? "Verifying your account"}
              </p>
              <span className="sr-only">Please wait</span>
            </section>
          </main>
        </div>

        <div className="hidden min-h-screen items-center justify-center lg:flex">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex lg:items-center lg:justify-center lg:bg-white">
      <div className="lg:hidden">
        <MobileNav title={screenTitle} />
      </div>

      <main className="flex min-h-screen items-center justify-center px-4 pb-24 pt-20 lg:min-h-0 lg:p-0">
        <section
          className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm lg:min-w-md lg:shadow-none"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle
              className="h-7 w-7 text-red-600"
              aria-hidden="true"
            />
          </div>
          <h1 className="mt-5 text-xl font-semibold text-slate-900">
            {props.title}
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600">
            {props.message}
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-11 rounded-md border border-teal-700 bg-white px-4 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              Go Back
            </button>
            <Link
              href="/dashboard"
              className="flex h-11 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              Go to Home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
