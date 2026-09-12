"use client";

import { useMemo, useState } from "react";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, LogOut, Phone, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import {
  dashboardDesktopNavigationItems,
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

export function MobileSidebarNavigation({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const quickItems = useMemo(
    () =>
      [
        { label: "Start A New Venture", item: findNavItem("Venture Intake") },
        { label: "Reports", item: findNavItem("Advanced Reports") },
        { label: "Dashboard", item: findNavItem("Dashboard") },
        { label: "Account", item: findNavItem("Team Management") },
        { label: "Ventures", item: findNavItem("Ventures") },
        { label: "Notifications", item: findNavItem("Notifications") },
      ].filter(
        (entry): entry is { label: string; item: DashboardNavItem } =>
          Boolean(entry.item?.href),
      ),
    [],
  );

  const handleNavigate = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[min(100vw,360px)] overflow-y-auto bg-background p-0 text-foreground"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile dashboard sidebar</SheetTitle>
        </SheetHeader>

        <div className="min-h-full border-r border-border pb-8">
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
                  active={
                    item.href ? isDashboardRouteActive(pathname, item.href) : false
                  }
                  onNavigate={handleNavigate}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowMore(!showMore)}
              aria-expanded={showMore}
              className="mt-3 h-8 w-full rounded-md bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {showMore ? "See less" : "See more"}
            </Button>

            {showMore && (
              <div className="mt-4 space-y-4 border-t border-border pt-4">
                {dashboardDesktopNavigationItems.map((item) => (
                  <MobileNavGroup
                    key={item.title}
                    item={item}
                    pathname={pathname}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            )}
          </nav>

          <div className="mt-4 border-t border-border">
            <SidebarUtilityLink
              icon={Phone}
              label="Help & Support"
              href="/dashboard/help-support"
              onNavigate={handleNavigate}
              className="border-b border-border"
            />
            <SidebarUtilityLink
              icon={Settings}
              label="Settings & Privacy"
              href="/dashboard/system-settings"
              onNavigate={handleNavigate}
              className="border-b border-border"
            />
          </div>

          <div className="px-10 py-4">
            <Button
              type="button"
              className="h-10 w-full rounded-md bg-destructive text-xs font-semibold text-destructive-foreground hover:bg-destructive/90"
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Log Out
            </Button>
            <Button
              type="button"
              className="mt-3 h-10 w-full rounded-md bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
              Lock App
            </Button>
          </div>

          <address className="px-8 text-center text-xs not-italic leading-5 text-muted-foreground">
            <p className="font-medium text-foreground">Contact Details</p>
            {contactDetails.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p className="mt-4 font-medium text-foreground">Phone Number</p>
            <p>+855 17 350 544</p>
          </address>
        </div>
      </SheetContent>
    </Sheet>
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
    "flex min-h-20 flex-col items-start justify-between rounded-md border-2 p-3 text-left text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
    active
      ? "border-primary bg-primary/10 text-primary"
      : "border-border bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary",
  );

  if (!item.href) {
    return (
      <button type="button" className={className} disabled>
        <Icon className="h-8 w-8 text-foreground" aria-hidden="true" />
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
      <Icon className="h-8 w-8 text-foreground" aria-hidden="true" />
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
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold text-foreground hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
        <span className="flex-1">{item.title}</span>
        <span className="text-xs text-muted-foreground">{expanded ? "Less" : "More"}</span>
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
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
    active
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
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

function SidebarUtilityLink({
  icon: Icon,
  label,
  href,
  onNavigate,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex h-11 w-full items-center gap-3 px-4 text-left text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring",
        className,
      )}
    >
      <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
      {label}
    </Link>
  );
}
