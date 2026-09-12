"use client";

import { useMemo, useState } from "react";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, LogOut, Menu, MoreHorizontal, Phone, Search, Settings } from "lucide-react";
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

function getScreenTitle(pathname: string) {
  const activeItem = flattenNavItems([
    ...dashboardMobileBottomItems,
    ...dashboardDesktopNavigationItems,
  ])
    .filter((item) => item.href && isDashboardRouteActive(pathname, item.href))
    .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))[0];

  return activeItem?.title ?? "Dashboard";
}

export function MobileNav({ title }: { title?: string } = {}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const screenTitle = title ?? getScreenTitle(pathname);
  const isMoreActive = dashboardDesktopNavigationItems.some((item) => {
    if (item.href && isDashboardRouteActive(pathname, item.href)) {
      return true;
    }

    return item.children?.some(
      (child) => child.href && isDashboardRouteActive(pathname, child.href),
    );
  });
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
        <div className="flex h-full items-center justify-between">
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
            />
          </Sheet>
          <div className="min-w-0 flex-1 px-4 text-center">
            <h1 className="truncate text-base font-semibold text-slate-900">
              {screenTitle}
            </h1>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Search dashboard"
            className="h-9 w-9 p-0 text-slate-700"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </header>

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

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open more dashboard navigation"
            aria-current={isMoreActive ? "page" : undefined}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium transition-colors",
              isMoreActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            <span>More</span>
          </button>
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
}: {
  pathname: string;
  quickItems: { label: string; item: DashboardNavItem }[];
  showMore: boolean;
  onShowMoreChange: (value: boolean) => void;
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
              <MobileNavTile key={label} label={label} item={item} />
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
                <MobileNavGroup key={item.title} item={item} pathname={pathname} />
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
}: {
  label: string;
  item: DashboardNavItem;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      className="flex min-h-20 flex-col items-start justify-between rounded-md border-2 border-slate-400 bg-white p-3 text-left text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <Icon className="h-8 w-8 text-slate-950" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

function MobileNavGroup({
  item,
  pathname,
}: {
  item: DashboardNavItem;
  pathname: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = item.icon;

  if (!item.children) {
    return <MobileNavRow item={item} pathname={pathname} />;
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
            <MobileNavRow key={child.title} item={child} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavRow({
  item,
  pathname,
}: {
  item: DashboardNavItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const active = item.href ? isDashboardRouteActive(pathname, item.href) : false;

  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{item.title}</span>
    </button>
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
