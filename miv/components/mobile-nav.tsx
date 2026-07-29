"use client";

import { useMemo, useState } from "react";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, LogOut, Menu, Phone, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { GlobalSearch, useGlobalSearch } from "@/components/global-search";
import {
  dashboardDesktopNavigationItems,
  dashboardMobileBottomItems,
  isDashboardRouteActive,
} from "@/lib/dashboard-navigation";
import type { DashboardNavItem } from "@/lib/dashboard-navigation";

const contactDetails = [
  "#1381, National Road 2, Phum Tuol Roka,",
  "Sangkat Chat Angre Krom, Khan Meanchey",
  "Phnom Penh, Cambodia",
];

function flattenNavItems(items: DashboardNavItem[]) {
  return items.flatMap((item) => (item.children ? item.children : [item]));
}

function findNavItem(title: string) {
  return flattenNavItems(dashboardDesktopNavigationItems).find(
    (item) => item.title === title,
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [language, setLanguage] = useState<"EN" | "KH">("EN");
  const globalSearch = useGlobalSearch();
  const quickItems = useMemo(
    () =>
      [
        { label: "Start A New Venture", item: findNavItem("Venture Intake") },
        { label: "Reports", item: findNavItem("Advanced Reports") },
        { label: "Dashboard", item: findNavItem("Dashboard") },
        { label: "Account", item: findNavItem("Team Management") },
        { label: "Ventures", item: { ...findNavItem("Deal Flow"), title: "Ventures" } },
        { label: "Notifications", item: findNavItem("Notifications") },
      ].filter(
        (entry): entry is { label: string; item: DashboardNavItem } =>
          Boolean(entry.item),
      ),
    [],
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <div className="flex h-full items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Open mobile sidebar"
                className="h-9 w-9 border-slate-300 p-0"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <MobileSidebar
              pathname={pathname}
              quickItems={quickItems}
              showMore={showMore}
              onShowMoreChange={setShowMore}
              onNavigate={() => setIsOpen(false)}
            />
          </Sheet>
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
                className={cn(
                  "min-w-9 px-2 transition-colors",
                  language === option
                    ? "bg-slate-900 text-white"
                    : "hover:bg-white hover:text-slate-900",
                )}
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
      <GlobalSearch isOpen={globalSearch.isOpen} onClose={globalSearch.close} />

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur lg:hidden"
        aria-label="Mobile dashboard bottom navigation"
      >
        <div className="grid grid-cols-5 gap-1">
          {dashboardMobileBottomItems.map((item) => {
            if (!item.href) return null;

            const active = isDashboardRouteActive(pathname, item.href);

            return (
              <Link
                key={item.title}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function MobileSidebar({
  pathname,
  quickItems,
  showMore,
  onShowMoreChange,
  onNavigate,
}: {
  pathname: string;
  quickItems: { label: string; item: DashboardNavItem }[];
  showMore: boolean;
  onShowMoreChange: (value: boolean) => void;
  onNavigate: () => void;
}) {
  return (
    <SheetContent
      side="left"
      className="w-[min(100vw,360px)] overflow-y-auto bg-white p-0 text-slate-900"
    >
      <SheetHeader className="sr-only">
        <SheetTitle>Mobile dashboard sidebar</SheetTitle>
      </SheetHeader>

      <div className="min-h-full border-r border-slate-200 pb-8">
        <div className="relative flex justify-center px-5 pb-5 pt-10">
          <Logo size="xl" className="h-24 w-24" />
        </div>

        <nav className="px-3" aria-label="Mobile dashboard sidebar">
          <div className="grid grid-cols-2 gap-3">
            {quickItems.map(({ label, item }) => (
              <MobileNavTile
                key={label}
                label={label}
                item={item}
                active={item.href ? isDashboardRouteActive(pathname, item.href) : false}
                onNavigate={onNavigate}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => onShowMoreChange(!showMore)}
            aria-expanded={showMore}
            className="mt-3 h-8 w-full rounded-md bg-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-300"
          >
            {showMore ? "See less" : "See more"}
          </Button>

          {showMore && (
            <div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
              {dashboardDesktopNavigationItems.map((item) => (
                <MobileNavGroup
                  key={item.title}
                  item={item}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </nav>

        <div className="mt-4 border-t border-slate-300">
          <SidebarUtilityButton
            icon={Phone}
            label="Help & Support"
            className="border-b border-slate-300"
          />
          <SidebarUtilityButton
            icon={Settings}
            label="Settings & Privacy"
            className="border-b border-slate-300"
          />
        </div>

        <div className="px-10 py-4">
          <Button
            type="button"
            className="h-10 w-full rounded-md bg-red-300 text-xs font-semibold text-slate-600 hover:bg-red-300"
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Log Out
          </Button>
          <Button
            type="button"
            className="mt-3 h-10 w-full rounded-md bg-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-300"
          >
            <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
            Lock App
          </Button>
        </div>

        <address className="px-8 text-center text-xs not-italic leading-5 text-slate-500">
          <p className="font-medium text-slate-600">Contact Details</p>
          {contactDetails.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="mt-4 font-medium text-slate-600">Phone Number</p>
          <p>+855 17 350 544</p>
        </address>
      </div>
    </SheetContent>
  );
}

function MobileNavTile({
  label,
  item,
  active,
  onNavigate,
}: {
  label: string;
  item: DashboardNavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const className = cn(
    "flex min-h-20 flex-col items-start justify-between rounded-md border-2 p-3 text-left text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
    active
      ? "border-blue-500 bg-blue-50 text-blue-700"
      : "border-slate-400 bg-white text-slate-600 hover:bg-slate-50",
  );

  if (!item.href) {
    return (
      <button type="button" className={className} disabled>
        <Icon className="h-8 w-8 text-slate-950" aria-hidden="true" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      <Icon className="h-8 w-8 text-slate-950" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

function MobileNavGroup({
  item,
  pathname,
  onNavigate,
}: {
  item: DashboardNavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = item.icon;

  if (!item.children) {
    return <MobileNavRow item={item} pathname={pathname} onNavigate={onNavigate} />;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Icon className="h-5 w-5 text-slate-950" aria-hidden="true" />
        <span className="flex-1">{item.title}</span>
        <span className="text-xs text-slate-500">{expanded ? "Less" : "More"}</span>
      </button>
      {expanded && (
        <div className="mt-1 space-y-1 pl-5">
          {item.children.map((child) => (
            <MobileNavRow
              key={child.title}
              item={child}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavRow({
  item,
  pathname,
  onNavigate,
}: {
  item: DashboardNavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const active = item.href ? isDashboardRouteActive(pathname, item.href) : false;
  const className = cn(
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
    active
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  );

  if (!item.href) {
    return (
      <button type="button" className={className} disabled>
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span>{item.title}</span>
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{item.title}</span>
    </Link>
  );
}

function SidebarUtilityButton({
  icon: Icon,
  label,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-11 w-full items-center gap-3 px-4 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className,
      )}
    >
      <Icon className="h-5 w-5 text-slate-950" aria-hidden="true" />
      {label}
    </button>
  );
}
