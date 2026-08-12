"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { GlobalSearch, useGlobalSearch } from "@/components/global-search";
import { MobileBottomNavigation } from "./mobile-bottom-navigation";
import { MobileSidebarNavigation } from "./mobile-sidebar-navigation";

export function MobileDashboardNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<"EN" | "KH">("EN");
  const globalSearch = useGlobalSearch();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <div className="flex h-full items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Open mobile sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
            className="h-9 w-9 border-slate-300 p-0"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>

          <Link
            href="/dashboard"
            aria-label="Go to dashboard home"
            className="flex shrink-0 items-center"
          >
            <Logo size="sm" className="h-9 w-9" />
          </Link>

          <div
            className="ml-auto flex h-8 overflow-hidden rounded-md border border-slate-300 bg-slate-100 text-xs font-semibold text-slate-600"
            aria-label="Language selector"
          >
            {(["EN", "KH"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLanguage(option)}
                aria-pressed={language === option}
                className={
                  language === option
                    ? "min-w-9 bg-slate-900 px-2 text-white transition-colors"
                    : "min-w-9 px-2 transition-colors hover:bg-white hover:text-slate-900"
                }
              >
                {option}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Search dashboard"
            onClick={globalSearch.open}
            className="h-9 w-9 p-0 text-slate-700"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <MobileSidebarNavigation
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      <GlobalSearch isOpen={globalSearch.isOpen} onClose={globalSearch.close} />
      <MobileBottomNavigation />
    </>
  );
}
