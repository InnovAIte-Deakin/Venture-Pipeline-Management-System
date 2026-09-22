"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  FileText,
  Settings,
  HelpCircle,
} from "lucide-react";

const bottomNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/user-dashboard" },
  { name: "Diagnostics", icon: Target, href: "/user-dashboard/diagnostics" },
  { name: "Documents", icon: FileText, href: "/user-dashboard/documents" },
  { name: "Settings", icon: Settings, href: "/user-dashboard/profile" },
  { name: "Help", icon: HelpCircle, href: "/user-dashboard/support" },
];

export default function UserBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-sidebar/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur lg:hidden"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-5 gap-1">
        {bottomNavItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium transition-colors",
                active
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}