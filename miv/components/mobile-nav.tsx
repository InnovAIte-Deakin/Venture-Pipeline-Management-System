"use client";

import { useMemo, useState } from "react";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Lock, LogOut, Menu, MoreHorizontal, Phone, Search, Settings, User } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
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

function getScreenTitle(pathname: string) {
  const activeItem = flattenNavItems([
    ...dashboardMobileBottomItems,
    ...dashboardDesktopNavigationItems,
  ])
    .filter((item) => item.href && isDashboardRouteActive(pathname, item.href))
    .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))[0];

  return activeItem?.title ?? "Dashboard";
}

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const screenTitle = getScreenTitle(pathname);
  const isMoreActive = dashboardDesktopNavigationItems.some((item) => {
    if (item.href && isDashboardRouteActive(pathname, item.href)) {
      return true;
    }

    return item.children?.some(
      (child) => child.href && isDashboardRouteActive(pathname, child.href),
    );
  });

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-slate-800 bg-slate-900 px-4 lg:hidden">
        <div className="flex h-full items-center justify-between">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Open mobile sidebar"
                className="h-9 w-9 border-slate-700 bg-slate-800/50 p-0 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <MobileSidebar pathname={pathname} />
          </Sheet>
          <div className="min-w-0 flex-1 px-4 text-center">
            <h1 className="truncate text-base font-semibold text-white">
              {screenTitle}
            </h1>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Search dashboard"
            className="h-9 w-9 p-0 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-900 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 lg:hidden"
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
                    ? "bg-blue-600/20 text-blue-100"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white",
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
                ? "bg-blue-600/20 text-blue-100"
                : "text-slate-400 hover:bg-slate-800/80 hover:text-white",
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

function MobileSidebar({ pathname }: { pathname: string }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const isExpanded = (title: string) => expandedItems.includes(title);
  const isActive = (href: string) => isDashboardRouteActive(pathname, href);

  return (
    <SheetContent
      side="left"
      className="w-[min(85vw,320px)] overflow-y-auto border-r border-slate-800 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900/95 p-0 text-slate-100"
    >
      <SheetHeader className="sr-only">
        <SheetTitle>Mobile dashboard sidebar</SheetTitle>
      </SheetHeader>

      <div className="flex min-h-full flex-col">
        <div className="flex items-center gap-3 border-b border-slate-800 p-6">
          <Logo size="md" />
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">MIV</h1>
            <p className="text-xs font-medium text-slate-400">Enterprise Platform</p>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {dashboardDesktopNavigationItems.map((item) => (
            <div key={item.title}>
              <div className="flex items-center justify-between">
                {item.href ? (
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive(item.href)
                        ? "border-l-4 border-blue-500 bg-blue-600/20 text-blue-100"
                        : "text-slate-300 hover:border-l-4 hover:border-slate-600 hover:bg-slate-800/80 hover:text-white",
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-300" />
                    <span className="flex-1">{item.title}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.title)}
                    aria-expanded={isExpanded(item.title)}
                    className="group flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 transition-all duration-200 hover:border-l-4 hover:border-slate-600 hover:bg-slate-800/80 hover:text-white"
                  >
                    <item.icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-300" />
                    <span className="flex-1">{item.title}</span>
                  </button>
                )}

                {item.children && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(item.title)}
                    aria-label={`${isExpanded(item.title) ? "Collapse" : "Expand"} ${item.title}`}
                    className="ml-1 h-6 w-6 shrink-0 p-0 text-slate-400 hover:text-slate-300"
                  >
                    {isExpanded(item.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>

              {item.children && isExpanded(item.title) && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href || child.title}
                      href={child.href || "#"}
                      aria-current={child.href && isActive(child.href) ? "page" : undefined}
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        child.href && isActive(child.href)
                          ? "border-l-2 border-blue-500 bg-blue-600/20 text-blue-100"
                          : "text-slate-400 hover:border-l-2 hover:border-slate-600 hover:bg-slate-800/60 hover:text-slate-200",
                      )}
                    >
                      <child.icon className="mr-3 h-4 w-4" />
                      <span>{child.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center space-x-3 rounded-lg bg-slate-800/50 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              {isAuthenticated && user ? (
                <span className="text-sm font-bold text-white">
                  {(user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase()}
                </span>
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              {loading ? (
                <p className="truncate text-sm font-medium text-slate-100">Loading...</p>
              ) : isAuthenticated && user ? (
                <>
                  <p className="truncate text-sm font-medium text-slate-100">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-slate-400">{user.email}</p>
                </>
              ) : (
                <p className="truncate text-sm font-medium text-slate-100">Not signed in</p>
              )}
            </div>
            {isAuthenticated && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-slate-300 hover:text-white"
                onClick={logout}
                aria-label="Sign out"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              <Phone className="h-4 w-4" />
              Help
            </button>
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>

          <button
            type="button"
            className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-red-600/20 text-xs font-semibold text-red-300 hover:bg-red-600/30"
          >
            <Lock className="h-4 w-4" />
            Lock App
          </button>
        </div>

        <address className="border-t border-slate-800 px-6 py-4 text-center text-xs not-italic leading-5 text-slate-500">
          <p className="font-medium text-slate-400">Contact Details</p>
          {contactDetails.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="mt-4 font-medium text-slate-400">Phone Number</p>
          <p>+855 17 350 544</p>
        </address>
      </div>
    </SheetContent>
  );
}
