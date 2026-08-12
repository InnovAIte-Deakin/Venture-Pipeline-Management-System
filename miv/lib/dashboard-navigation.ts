import type React from "react";
import type { Permission } from "@/lib/rbac";
import {
  Activity,
  Award,
  BarChart,
  BarChart3,
  Bell,
  BookOpenCheck,
  Brain,
  Building2,
  Calendar,
  ChartPie,
  DollarSign,
  FileText,
  Globe,
  Heart,
  House,
  Plus,
  Rocket,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

export interface DashboardNavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  requiredPermissions?: Permission[];
  ownerOnly?: boolean;
  children?: DashboardNavItem[];
  desktopHidden?: boolean;
  mobileBottom?: boolean;
}

export const dashboardNavigationItems: DashboardNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: House,
    badge: "New",
    mobileBottom: true,
    requiredPermissions: ["dashboard:view"],
  },
  {
    title: "Ventures",
    href: "/dashboard/ventures",
    icon: Building2,
    desktopHidden: true,
    mobileBottom: true,
    requiredPermissions: ["ventures:review"],
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
    desktopHidden: true,
    mobileBottom: true,
    requiredPermissions: ["documents:review"],
  },
  {
    title: "Reviews",
    href: "/dashboard/due-diligence",
    icon: BookOpenCheck,
    desktopHidden: true,
    mobileBottom: true,
    requiredPermissions: ["ventures:review"],
  },
  {
    title: "Pipeline Management",
    icon: Building2,
    requiredPermissions: ["ventures:review"],
    children: [
      {
        title: "Venture Intake",
        href: "/dashboard/venture-intake",
        icon: Plus,
        requiredPermissions: ["ventures:create"],
      },
      { title: "Deal Flow", href: "/dashboard/deal-flow", icon: Activity, requiredPermissions: ["ventures:review"] },
      {
        title: "Due Diligence",
        href: "/dashboard/due-diligence",
        icon: Shield,
        requiredPermissions: ["ventures:review"],
      },
      { title: "Portfolio", href: "/dashboard/portfolio", icon: Building2, requiredPermissions: ["ventures:review"] },
    ],
  },
  {
    title: "Analytics & Insights",
    icon: BarChart3,
    requiredPermissions: ["analytics:view"],
    children: [
      {
        title: "Performance Analytics",
        href: "/dashboard/performance-analytics",
        icon: TrendingUp,
        requiredPermissions: ["analytics:view"],
      },
      { title: "AI Analysis", href: "/dashboard/ai-analysis", icon: Brain, requiredPermissions: ["analytics:view"] },
      {
        title: "Advanced Reports",
        href: "/dashboard/advanced-reports",
        icon: FileText,
        requiredPermissions: ["analytics:view"],
      },
      {
        title: "Custom Dashboards",
        href: "/dashboard/custom-dashboards",
        icon: BarChart,
        requiredPermissions: ["analytics:view"],
      },
    ],
  },
  {
    title: "Capital Management",
    icon: DollarSign,
    requiredPermissions: ["capital:view"],
    children: [
      {
        title: "Capital Facilitation",
        href: "/dashboard/capital-facilitation",
        icon: DollarSign,
        requiredPermissions: ["capital:view"],
      },
      {
        title: "Investment Rounds",
        href: "/dashboard/investment-rounds",
        icon: TrendingUp,
        requiredPermissions: ["capital:view"],
      },
      {
        title: "Fund Management",
        href: "/dashboard/fund-management",
        icon: ChartPie,
        requiredPermissions: ["capital:view"],
      },
      {
        title: "Exit Strategy",
        href: "/dashboard/exit-strategy",
        icon: Rocket,
        requiredPermissions: ["capital:view"],
      },
    ],
  },
  {
    title: "Impact & GEDSI",
    icon: Heart,
    requiredPermissions: ["impact:view"],
    children: [
      { title: "GEDSI Tracker", href: "/dashboard/gedsi-tracker", icon: Users, requiredPermissions: ["impact:view"] },
      {
        title: "Impact Reports",
        href: "/dashboard/impact-reports",
        icon: Award,
        requiredPermissions: ["impact:view"],
      },
      {
        title: "Sustainability Metrics",
        href: "/dashboard/sustainability",
        icon: Globe,
        requiredPermissions: ["impact:view"],
      },
      { title: "Social Impact", href: "/dashboard/social-impact", icon: Heart, requiredPermissions: ["impact:view"] },
      {
        title: "IRIS Metrics",
        href: "/dashboard/iris-metrics",
        icon: ChartPie,
        requiredPermissions: ["impact:view"],
      },
    ],
  },
  {
    title: "Operations",
    icon: Settings,
    children: [
      {
        title: "Impact Documents",
        href: "/dashboard/impact-documents",
        icon: FileText,
        requiredPermissions: ["documents:review"],
      },
      {
        title: "Team Management",
        href: "/dashboard/team-management",
        icon: Users,
        requiredPermissions: ["team:manage"],
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
        requiredPermissions: ["dashboard:view"],
      },
      {
        title: "Calendar & Events",
        href: "/dashboard/calendar",
        icon: Calendar,
        requiredPermissions: ["dashboard:view"],
      },
      {
        title: "System Settings",
        href: "/dashboard/system-settings",
        icon: Settings,
        requiredPermissions: ["settings:manage"],
        ownerOnly: true,
      },
      { title: "Workflows", href: "/dashboard/workflows", icon: Activity, requiredPermissions: ["dashboard:view"] },
      {
        title: "Document Management",
        href: "/dashboard/documents",
        icon: FileText,
        requiredPermissions: ["documents:review"],
      },
    ],
  },
];

export const dashboardDesktopNavigationItems = dashboardNavigationItems.filter(
  (item) => !item.desktopHidden,
);

export const dashboardMobileBottomItems = dashboardNavigationItems.filter(
  (item) => item.mobileBottom && item.href,
);

export const dashboardMobileDrawerItems = dashboardNavigationItems.filter(
  (item) => !item.mobileBottom,
);

export function isDashboardRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
