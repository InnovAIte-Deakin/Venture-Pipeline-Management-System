"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  House,
  Building2,
  Target,
  DollarSign,
  BarChart3,
  TrendingUp,
  ChartPie,
  Users,
  Settings,
  
  FileText,
  Brain,
  BarChart,
  Calendar,
  MapPin,
  Globe,
  Shield,
  Zap,
  Rocket,
  Star,
  Award,
  Heart,
  Activity,
  PieChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Gauge,

  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Logo } from "@/components/logo"
import { useAuth } from "@/hooks/useAuth"

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: House,
    badge: "New"
  },
  {
    title: "Pipeline Management",
    icon: Building2,
    children: [
      { title: "Venture Intake", href: "/dashboard/venture-intake", icon: Plus },
      { title: "Deal Flow", href: "/dashboard/deal-flow", icon: Activity },
      { title: "Due Diligence", href: "/dashboard/due-diligence", icon: Shield },
             { title: "Portfolio", href: "/dashboard/portfolio", icon: Building2 }
    ]
  },
  {
    title: "Analytics & Insights",
    icon: BarChart3,
    children: [
      { title: "Performance Analytics", href: "/dashboard/performance-analytics", icon: TrendingUp },
      { title: "AI Analysis", href: "/dashboard/ai-analysis", icon: Brain },
      { title: "Advanced Reports", href: "/dashboard/advanced-reports", icon: FileText },
      { title: "Custom Dashboards", href: "/dashboard/custom-dashboards", icon: BarChart }
    ]
  },
  {
    title: "Capital Management",
    icon: DollarSign,
    children: [
      { title: "Capital Facilitation", href: "/dashboard/capital-facilitation", icon: DollarSign },
      { title: "Investment Rounds", href: "/dashboard/investment-rounds", icon: TrendingUp },
      { title: "Fund Management", href: "/dashboard/fund-management", icon: ChartPie },
      { title: "Exit Strategy", href: "/dashboard/exit-strategy", icon: Rocket }
    ]
  },
  {
    title: "Impact & GEDSI",
    icon: Heart,
    children: [
      { title: "GEDSI Tracker", href: "/dashboard/gedsi-tracker", icon: Users },
      { title: "Impact Reports", href: "/dashboard/impact-reports", icon: Award },
      { title: "Sustainability Metrics", href: "/dashboard/sustainability", icon: Globe },
      { title: "Social Impact", href: "/dashboard/social-impact", icon: Heart },
      { title: "IRIS Metrics", href: "/dashboard/iris-metrics", icon: PieChart }
    ]
  },
  {
    title: "Operations",
    icon: Settings,
    children: [
      { title: "Impact Documents", href: "/dashboard/impact-documents", icon: FileText },
      { title: "Team Management", href: "/dashboard/team-management", icon: Users },
      { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { title: "Calendar & Events", href: "/dashboard/calendar", icon: Calendar },
      { title: "Test Environment", href: "/dashboard/test-environment", icon: Settings },
      { title: "System Settings", href: "/dashboard/system-settings", icon: Settings },
      { title: "Workflows", href: "/dashboard/workflows", icon: Activity },
      { title: "Document Management", href: "/dashboard/documents", icon: FileText }
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, loading, isAuthenticated, logout } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => pathname === href
  const isExpanded = (title: string) => expandedItems.includes(title)

  return (
    <aside className={cn(
      "fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900/95 backdrop-blur-md text-slate-100 shadow-2xl border-r border-slate-800 flex flex-col z-50 transition-all duration-300",
      isCollapsed && "w-16"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3 hover:bg-slate-800/50 transition-colors duration-200">
        <Logo size={isCollapsed ? "sm" : "md"} />
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">MIV</h1>
            <p className="text-slate-400 text-xs font-medium">Enterprise Platform</p>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {navigationItems.map((item) => (
          <div key={item.title}>
            {/* Main Navigation Item */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900",
                      isActive(item.href)
                        ? "bg-blue-600/20 text-blue-100 border-l-4 border-blue-500"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-l-4 hover:border-slate-600"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 transition-colors text-slate-400 group-hover:text-slate-300" />
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
                  <div
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer",
                      "text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-l-4 hover:border-slate-600"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 transition-colors text-slate-400 group-hover:text-slate-300" />
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
                  </div>
                )}
                
                {/* Expand/Collapse Button */}
                {item.children && !isCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(item.title)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-slate-300"
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
                      href={child.href || '#'}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900",
                        child.href && isActive(child.href)
                          ? "bg-blue-600/20 text-blue-100 border-l-2 border-blue-500"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-l-2 hover:border-slate-600"
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
      <div className="p-4 border-t border-slate-800">
        {!isCollapsed && (
          <div className="space-y-3">
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900">
                <Plus className="h-3 w-3 mr-1" />
                New Venture
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900">
                <BarChart className="h-3 w-3 mr-1" />
                Report
              </Button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3 p-2 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                {isAuthenticated && user ? (
                  <span className="text-sm font-bold text-white">
                    {(user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase()}
                  </span>
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {loading ? (
                  <>
                    <p className="text-sm font-medium text-slate-100 truncate">Loading...</p>
                    <p className="text-xs text-slate-400 truncate">Please wait</p>
                  </>
                ) : isAuthenticated && user ? (
                  <>
                    <p className="text-sm font-medium text-slate-100 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <p className="text-[10px] text-slate-500 truncate">ID: {user.id}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-100 truncate">Not signed in</p>
                    <p className="text-xs text-slate-400 truncate">Click to sign in</p>
                  </>
                )}
              </div>
              {isAuthenticated ? (
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={logout}>
                  <LogOut className="h-3 w-3" />
                </Button>
              ) : (
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => window.location.href = '/auth/login'}>
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
          className="w-full mt-2 text-slate-400 hover:text-slate-300"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  )
}
