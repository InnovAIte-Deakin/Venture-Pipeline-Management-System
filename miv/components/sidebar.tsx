"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  User,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { signIn } from "next-auth/react";
import { useGlobalSearch } from "@/components/global-search";
import { useAuth } from "@/hooks/useAuth";
import {
  dashboardDesktopNavigationItems,
  isDashboardRouteActive,
} from "@/lib/dashboard-navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const globalSearch = useGlobalSearch();

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const isActive = (href: string) => isDashboardRouteActive(pathname, href);
  const isExpanded = (title: string) => expandedItems.includes(title);

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 w-64 h-screen bg-sidebar text-sidebar-foreground shadow-2xl border-r border-sidebar-border flex flex-col z-50 transition-all duration-300",
          isCollapsed && "w-16",
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border flex items-center gap-3 hover:bg-sidebar-accent transition-colors duration-200">
          <Logo size={isCollapsed ? "sm" : "md"} />
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-sidebar-accent-foreground tracking-wide">
                MIV
              </h1>
              <p className="text-sidebar-foreground/70 text-xs font-medium">
                Enterprise Platform
              </p>
            </div>
          )}
        </div>

        {/* Global Search Button */}
        {!isCollapsed && (
          <div className="p-4 border-b border-sidebar-border">
            <button
              onClick={globalSearch.open}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-sidebar-accent border border-sidebar-border rounded-lg text-sidebar-foreground/70 hover:text-sidebar-accent-foreground transition-all group"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left text-sm">
                Search everything...
              </span>
              <div className="flex items-center gap-1 text-xs">
                <kbd className="px-1.5 py-0.5 bg-sidebar border border-sidebar-border rounded text-sidebar-foreground/70 font-mono transition-colors">
                  {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-sidebar border border-sidebar-border rounded text-sidebar-foreground/70 font-mono transition-colors">
                  K
                </kbd>
              </div>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
          {dashboardDesktopNavigationItems.map((item) => (
            <div key={item.title}>
              {/* Main Navigation Item */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-sidebar w-full",
                        isActive(item.href)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground border-l-4 border-sidebar-ring"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-l-4 hover:border-sidebar-border",
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 transition-colors" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.title)}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer w-full text-left",
                        "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-l-4 hover:border-sidebar-border",
                      )}
                      aria-expanded={isExpanded(item.title)}
                    >
                      <item.icon className="mr-3 h-5 w-5 transition-colors" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </button>
                  )}

                  {/* Expand/Collapse Button */}
                  {item.children && !isCollapsed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(item.title)}
                      aria-label={`${isExpanded(item.title) ? "Collapse" : "Expand"} ${item.title}`}
                      className="h-6 w-6 p-0 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground ml-1 shrink-0"
                    >
                      {isExpanded(item.title) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Sub-navigation Items */}
                {item.children && isExpanded(item.title) && !isCollapsed && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href || child.title}
                        href={child.href || "#"}
                        aria-current={
                          child.href && isActive(child.href) ? "page" : undefined
                        }
                        className={cn(
                          "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-sidebar",
                          child.href && isActive(child.href)
                            ? "bg-sidebar-primary text-sidebar-primary-foreground border-l-2 border-sidebar-ring"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-l-2 hover:border-sidebar-border",
                        )}
                      >
                        <child.icon className="mr-3 h-4 w-4 transition-colors" />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {!isCollapsed && (
            <div className="space-y-3">
              {/* Quick Actions */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New Venture
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                >
                  <BarChart className="h-3 w-3 mr-1" />
                  Report
                </Button>
              </div>

              

              <div className="flex items-center space-x-3 p-2 bg-sidebar-accent rounded-lg">
                <div className="w-8 h-8 bg-sidebar-primary text-sidebar-primary-foreground rounded-full flex items-center justify-center">
                  {isAuthenticated && user ? (
                    <span className="text-sm font-bold">
                      {(
                        user.firstName.charAt(0) + user.lastName.charAt(0)
                      ).toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {loading ? (
                    <>
                      <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                        Loading...
                      </p>
                      <p className="text-xs text-sidebar-foreground/70 truncate">
                        Please wait
                      </p>
                    </>
                  ) : isAuthenticated && user ? (
                    <>
                      <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-sidebar-foreground/70 truncate">
                        {user.email}
                      </p>
                      <p className="text-[10px] text-sidebar-foreground/50 truncate">
                        ID: {user.id}
                      </p>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => signIn()}
                      aria-label="Sign in"
                    >
                      <User className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {isAuthenticated ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={logout}
                    aria-label="Sign out"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => (window.location.href = "/auth/login")}
                    aria-label="Sign in"
                  >
                    <User className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-full mt-2 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
