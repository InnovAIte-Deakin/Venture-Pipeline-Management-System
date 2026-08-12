import type React from "react";
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
  },
  {
    title: "Ventures",
    href: "/dashboard/ventures",
    icon: Building2,
    desktopHidden: true,
    mobileBottom: true,
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
    desktopHidden: true,
    mobileBottom: true,
  },
  {
    title: "Reviews",
    href: "/dashboard/due-diligence",
    icon: BookOpenCheck,
    desktopHidden: true,
    mobileBottom: true,
  },
  {
    title: "Pipeline Management",
    icon: Building2,
    children: [
      {
        title: "Venture Intake",
        href: "/dashboard/venture-intake",
        icon: Plus,
      },
      { title: "Deal Flow", href: "/dashboard/deal-flow", icon: Activity },
      {
        title: "Due Diligence",
        href: "/dashboard/due-diligence",
        icon: Shield,
      },
      { title: "Portfolio", href: "/dashboard/portfolio", icon: Building2 },
    ],
  },
  {
    title: "Analytics & Insights",
    icon: BarChart3,
    children: [
      {
        title: "Performance Analytics",
        href: "/dashboard/performance-analytics",
        icon: TrendingUp,
      },
      { title: "AI Analysis", href: "/dashboard/ai-analysis", icon: Brain },
      {
        title: "Advanced Reports",
        href: "/dashboard/advanced-reports",
        icon: FileText,
      },
      {
        title: "Custom Dashboards",
        href: "/dashboard/custom-dashboards",
        icon: BarChart,
      },
    ],
  },
  {
    title: "Capital Management",
    icon: DollarSign,
    children: [
      {
        title: "Capital Facilitation",
        href: "/dashboard/capital-facilitation",
        icon: DollarSign,
      },
      {
        title: "Investment Rounds",
        href: "/dashboard/investment-rounds",
        icon: TrendingUp,
      },
      {
        title: "Fund Management",
        href: "/dashboard/fund-management",
        icon: ChartPie,
      },
      {
        title: "Exit Strategy",
        href: "/dashboard/exit-strategy",
        icon: Rocket,
      },
    ],
  },
  {
    title: "Impact & GEDSI",
    icon: Heart,
    children: [
      { title: "GEDSI Tracker", href: "/dashboard/gedsi-tracker", icon: Users },
      {
        title: "Impact Reports",
        href: "/dashboard/impact-reports",
        icon: Award,
      },
      {
        title: "Sustainability Metrics",
        href: "/dashboard/sustainability",
        icon: Globe,
      },
      { title: "Social Impact", href: "/dashboard/social-impact", icon: Heart },
      {
        title: "IRIS Metrics",
        href: "/dashboard/iris-metrics",
        icon: ChartPie,
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
      },
      {
        title: "Team Management",
        href: "/dashboard/team-management",
        icon: Users,
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Calendar & Events",
        href: "/dashboard/calendar",
        icon: Calendar,
      },
      {
        title: "System Settings",
        href: "/dashboard/system-settings",
        icon: Settings,
      },
      { title: "Workflows", href: "/dashboard/workflows", icon: Activity },
      {
        title: "Document Management",
        href: "/dashboard/documents",
        icon: FileText,
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
