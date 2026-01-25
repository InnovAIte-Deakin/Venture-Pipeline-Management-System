"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Activity,
  DollarSign,
  BarChart3,
  LineChart,
  Settings,
  HelpCircle,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/impact-user/dashboard", icon: LayoutGrid, section: "MAIN" },
  { label: "Diagnostics & Readiness", href: "/impact-user/dashboard/diagnostics", icon: Activity, section: "MAIN" },
  { label: "Capital Facilitation", href: "/impact-user/dashboard/capital", icon: DollarSign, section: "MAIN" },
  { label: "GEDSI Tracker", href: "/impact-user/dashboard/gedsi", icon: BarChart3, section: "MAIN" },
  { label: "Investor Management", href: "/impact-user/dashboard/investors", icon: LineChart, section: "MAIN" },
  { label: "Funding Round Tracker", href: "/impact-user/dashboard/funding", icon: BarChart3, section: "MAIN" },

  { label: "Impact Reports", href: "/impact-user/dashboard/reports", icon: LineChart, section: "REPORTS" },
  { label: "Performance Analytics", href: "/impact-user/dashboard/analytics", icon: BarChart3, section: "REPORTS" },

  { label: "System Settings", href: "/impact-user/dashboard/settings", icon: Settings, section: "SETTINGS" },
  { label: "Help & Support", href: "/impact-user/dashboard/help", icon: HelpCircle, section: "SETTINGS" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[270px] min-h-screen bg-[#0f2a3a] text-white">
      {/* Logo */}
      <div className="px-6 pt-7 pb-5 border-b border-white/10">
        {/* If you have logo.png, you can replace text with <Image/> */}
        <div className="text-4xl font-extrabold leading-none">MiV</div>
        <div className="text-sm text-white/70 mt-1">Mekong Inclusive Ventures</div>
      </div>

      {/* Nav */}
      <div className="px-4 py-5">
        {["MAIN", "REPORTS", "SETTINGS"].map((section) => (
          <div key={section} className="mb-6">
            <div className="px-2 text-xs font-semibold tracking-widest text-[#62d5cf] mb-3">
              {section}
            </div>

            <div className="space-y-2">
              {NAV.filter((n) => n.section === section).map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/impact-user/dashboard"
                    ? pathname === item.href
                    : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-3 rounded-xl px-4 py-3 transition",
                      active
                        ? "bg-[#0ea5a0] text-white shadow-[0_6px_14px_rgba(0,0,0,0.25)]"
                        : "text-white/90 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                      <Icon size={18} />
                    </span>
                    <span className="text-[15px]">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* small circle icon bottom-left like figma */}
      <div className="px-5 pb-6 mt-auto">
        <div className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center text-white/90">
          N
        </div>
      </div>
    </aside>
  );
}
