// "use client"

// import React, { useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"
// import {
//   House,
//   Building2,
//   Target,
//   DollarSign,
//   BarChart3,
//   TrendingUp,
//   ChartPie,
//   Users,
//   Settings,
//   // CircleQuestion, // Not available in this version
//   FileText,
//   Brain,
//   BarChart,
//   Calendar,
//   MapPin,
//   Globe,
//   Shield,
//   Zap,
//   Rocket,
//   Star,
//   Award,
//   Heart,
//   Activity,

//   ChevronDown,
//   ChevronRight,
//   Plus,
//   Search,
//   Bell,
//   User,
//   LogOut,
//   Menu,
//   X,
//   Home,
//   HelpCircle
// } from "lucide-react"
// import { Logo } from "@/components/logo"

// interface NavItem {
//   title: string
//   href?: string
//   icon: React.ComponentType<{ className?: string }>
//   badge?: string
//   children?: NavItem[]
// }

// const navigationItems: NavItem[] = [
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//     icon: House,
//     badge: "New"
//   },
//   {
//     title: "Pipeline Management",
//     icon: Building2,
//     children: [
//       { title: "Venture Intake", href: "/dashboard/venture-intake", icon: Plus },
//       { title: "Deal Flow", href: "/dashboard/deal-flow", icon: Activity },
//       { title: "Due Diligence", href: "/dashboard/due-diligence", icon: Shield },
//       { title: "Portfolio", href: "/dashboard/portfolio", icon: Building2 }
//     ]
//   },
//   {
//     title: "Analytics & Insights",
//     icon: BarChart3,
//     children: [
//       { title: "Performance Analytics", href: "/dashboard/performance-analytics", icon: TrendingUp },
//       { title: "AI Analysis", href: "/dashboard/ai-analysis", icon: Brain },
//       { title: "Advanced Reports", href: "/dashboard/advanced-reports", icon: FileText },
//       { title: "Custom Dashboards", href: "/dashboard/custom-dashboards", icon: BarChart }
//     ]
//   },
//   {
//     title: "Capital Management",
//     icon: DollarSign,
//     children: [
//       { title: "Capital Facilitation", href: "/dashboard/capital-facilitation", icon: DollarSign },
//       { title: "Investment Rounds", href: "/dashboard/investment-rounds", icon: TrendingUp },
//       { title: "Fund Management", href: "/dashboard/fund-management", icon: ChartPie },
//       { title: "Exit Strategy", href: "/dashboard/exit-strategy", icon: Rocket }
//     ]
//   },
//   {
//     title: "Impact & GEDSI",
//     icon: Heart,
//     children: [
//       { title: "GEDSI Tracker", href: "/dashboard/gedsi-tracker", icon: Users },
//       { title: "Impact Reports", href: "/dashboard/impact-reports", icon: Award },
//       { title: "Sustainability Metrics", href: "/dashboard/sustainability", icon: Globe },
//       { title: "Social Impact", href: "/dashboard/social-impact", icon: Heart }
//     ]
//   },
//   {
//     title: "Operations",
//     icon: Settings,
//     children: [
//       { title: "Team Management", href: "/dashboard/team-management", icon: Users },
//       { title: "Document Management", href: "/dashboard/documents", icon: FileText },
//       { title: "Calendar & Events", href: "/dashboard/calendar", icon: Calendar },
//       { title: "System Settings", href: "/dashboard/system-settings", icon: Settings }
//     ]
//   }
// ]

// export function MobileNav() {
//   const pathname = usePathname()
//   const [isOpen, setIsOpen] = useState(false)
//   const [expandedItems, setExpandedItems] = useState<string[]>([])

//   const toggleExpanded = (title: string) => {
//     setExpandedItems(prev => 
//       prev.includes(title) 
//         ? prev.filter(item => item !== title)
//         : [...prev, title]
//     )
//   }

//   const isActive = (href: string) => pathname === href
//   const isExpanded = (title: string) => expandedItems.includes(title)

//   const handleNavClick = (href: string) => {
//     setIsOpen(false)
//     // Reset expanded items when navigating
//     setExpandedItems([])
//   }

//   return (
//     <Sheet open={isOpen} onOpenChange={setIsOpen}>
//       <SheetTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className="lg:hidden border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-white"
//         >
//           <Menu className="h-4 w-4" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-80 p-0 bg-slate-900 text-slate-100">
//         <SheetHeader className="p-6 border-b border-slate-800">
//           <SheetTitle className="flex items-center gap-3">
//             <Logo size="sm" />
//             <div>
//               <h1 className="text-xl font-bold text-white tracking-wide">MIV</h1>
//               <p className="text-slate-400 text-xs font-medium">Enterprise Platform</p>
//             </div>
//           </SheetTitle>
//         </SheetHeader>

//         {/* Search Bar */}
//         <div className="p-4 border-b border-slate-800">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
//           {navigationItems.map((item) => (
//             <div key={item.title}>
//               {/* Main Navigation Item */}
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   {item.href ? (
//                     <Link
//                       href={item.href}
//                       onClick={() => handleNavClick(item.href)}
//                       className={cn(
//                         "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex-1",
//                         isActive(item.href)
//                           ? "bg-blue-600/20 text-blue-100 border-l-4 border-blue-500"
//                           : "text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-l-4 hover:border-slate-600"
//                       )}
//                     >
//                       <item.icon className="mr-3 h-5 w-5 transition-colors text-slate-400 group-hover:text-slate-300" />
//                       <span className="flex-1">{item.title}</span>
//                       {item.badge && (
//                         <Badge variant="secondary" className="ml-2 text-xs">
//                           {item.badge}
//                         </Badge>
//                       )}
//                     </Link>
//                   ) : (
//                     <div
//                       onClick={() => toggleExpanded(item.title)}
//                       className={cn(
//                         "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer flex-1",
//                         "text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-l-4 hover:border-slate-600"
//                       )}
//                     >
//                       <item.icon className="mr-3 h-5 w-5 transition-colors text-slate-400 group-hover:text-slate-300" />
//                       <span className="flex-1">{item.title}</span>
//                       {item.badge && (
//                         <Badge variant="secondary" className="ml-2 text-xs">
//                           {item.badge}
//                         </Badge>
//                       )}
//                     </div>
//                   )}
                  
//                   {/* Expand/Collapse Button */}
//                   {item.children && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleExpanded(item.title)}
//                       className="h-8 w-8 p-0 text-slate-400 hover:text-slate-300"
//                     >
//                       {isExpanded(item.title) ? (
//                         <ChevronDown className="h-4 w-4" />
//                       ) : (
//                         <ChevronRight className="h-4 w-4" />
//                       )}
//                     </Button>
//                   )}
//                 </div>

//                 {/* Sub-navigation Items */}
//                 {item.children && isExpanded(item.title) && (
//                   <div className="ml-6 space-y-1">
//                     {item.children.map((child) => (
//                       <Link
//                         key={child.href}
//                         href={child.href}
//                         onClick={() => handleNavClick(child.href)}
//                         className={cn(
//                           "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900",
//                           isActive(child.href)
//                             ? "bg-blue-600/20 text-blue-100 border-l-2 border-blue-500"
//                             : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-l-2 hover:border-slate-600"
//                         )}
//                       >
//                         <child.icon className="mr-3 h-4 w-4 transition-colors" />
//                         <span>{child.title}</span>
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className="p-4 border-t border-slate-800 space-y-4">
//           {/* Quick Actions */}
//           <div className="grid grid-cols-2 gap-2">
//             <Button size="sm" variant="outline" className="text-xs text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900">
//               <Plus className="h-3 w-3 mr-1" />
//               New Venture
//             </Button>
//             <Button size="sm" variant="outline" className="text-xs text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900">
//               <BarChart className="h-3 w-3 mr-1" />
//               Report
//             </Button>
//           </div>

//           {/* User Profile */}
//           <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
//             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
//               <User className="h-5 w-5 text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-slate-100 truncate">John Doe</p>
//               <p className="text-xs text-slate-400 truncate">john@miv.com</p>
//             </div>
//             <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
//               <LogOut className="h-4 w-4" />
//             </Button>
//           </div>

//           {/* Additional Actions */}
//           <div className="flex space-x-2">
//             <Button size="sm" variant="ghost" className="flex-1 text-xs">
//               <Bell className="h-3 w-3 mr-1" />
//               Notifications
//             </Button>
//             <Button size="sm" variant="ghost" className="flex-1 text-xs">
//               <HelpCircle className="h-3 w-3 mr-1" />
//               Help
//             </Button>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// } 

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  House,
  Building2,
  Heart,
  FileText,
  Menu,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Bell,
  User,
  LogOut,
  BarChart,
  Users,
  Shield,
  TrendingUp,
  Brain,
  DollarSign,
  Globe,
  Settings,
  Calendar,
  Award,
  Activity,
  HelpCircle,
} from "lucide-react";
import { Logo } from "@/components/logo";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: House,
    badge: "New",
  },
  {
    title: "Pipeline Management",
    icon: Building2,
    children: [
      { title: "Venture Intake", href: "/dashboard/venture-intake", icon: Plus },
      { title: "Deal Flow", href: "/dashboard/deal-flow", icon: Activity },
      { title: "Due Diligence", href: "/dashboard/due-diligence", icon: Shield },
      { title: "Portfolio", href: "/dashboard/portfolio", icon: Building2 },
    ],
  },
  {
    title: "Analytics & Insights",
    icon: BarChart,
    children: [
      { title: "Performance Analytics", href: "/dashboard/performance-analytics", icon: TrendingUp },
      { title: "AI Analysis", href: "/dashboard/ai-analysis", icon: Brain },
      { title: "Advanced Reports", href: "/dashboard/advanced-reports", icon: FileText },
      { title: "Custom Dashboards", href: "/dashboard/custom-dashboards", icon: BarChart },
    ],
  },
  {
    title: "Capital Management",
    icon: DollarSign,
    children: [
      { title: "Capital Facilitation", href: "/dashboard/capital-facilitation", icon: DollarSign },
      { title: "Investment Rounds", href: "/dashboard/investment-rounds", icon: TrendingUp },
      { title: "Fund Management", href: "/dashboard/fund-management", icon: BarChart },
      { title: "Exit Strategy", href: "/dashboard/exit-strategy", icon: TrendingUp },
    ],
  },
  {
    title: "Impact & GEDSI",
    icon: Heart,
    children: [
      { title: "GEDSI Tracker", href: "/dashboard/gedsi-tracker", icon: Users },
      { title: "Impact Reports", href: "/dashboard/impact-reports", icon: Award },
      { title: "Sustainability Metrics", href: "/dashboard/sustainability", icon: Globe },
      { title: "Social Impact", href: "/dashboard/social-impact", icon: Heart },
    ],
  },
  {
    title: "Operations",
    icon: Settings,
    children: [
      { title: "Team Management", href: "/dashboard/team-management", icon: Users },
      { title: "Document Management", href: "/dashboard/documents", icon: FileText },
      { title: "Calendar & Events", href: "/dashboard/calendar", icon: Calendar },
      { title: "System Settings", href: "/dashboard/system-settings", icon: Settings },
    ],
  },
];

const primaryNavItems = [
  { title: "Home", href: "/dashboard", icon: House },
  { title: "Portfolio", href: "/dashboard/portfolio", icon: Building2 },
  { title: "Impact", href: "/dashboard/social-impact", icon: Heart },
  { title: "Reports", href: "/dashboard/impact-reports", icon: FileText },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isExpanded = (title: string) => expandedItems.includes(title);

  const handleNavClick = () => {
    setIsOpen(false);
    setExpandedItems([]);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="grid grid-cols-5 h-16">
          {/* {primaryNavItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-[11px] font-medium transition-colors",
                isActive(item.href)
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.title}</span>
            </Link>
          ))} */}
          {primaryNavItems.map((item) => {
          const active =
            // pathname === item.href || pathname.startsWith(`${item.href}/`);
            item.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(item.href); 

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex flex-col items-center justify-center text-[11px] font-medium"
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                  active ? "bg-blue-50 text-blue-600" : "text-slate-500"
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "mt-1",
                  active ? "text-blue-600" : "text-slate-500"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              {/* <button
                className="flex flex-col items-center justify-center text-[11px] font-medium text-slate-500 hover:text-slate-900"
                aria-label="Open more navigation"
              >
                <Menu className="h-5 w-5 mb-1" />
                <span>More</span>
              </button> */}
              <button className="flex flex-col items-center justify-center text-[11px] font-medium text-slate-500 outline-none border-none">
                <div className="flex h-9 w-9 items-center justify-center rounded-full">
                  <Menu className="h-5 w-5" />
                </div>
                <span className="mt-1">More</span>
              </button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[85vh] p-0">
              <SheetHeader className="p-4 border-b border-slate-200 bg-slate-900 text-slate-100">
                <SheetTitle className="flex items-center gap-3 text-left">
                  <Logo size="sm" />
                  <div>
                    <h1 className="text-lg font-bold text-white tracking-wide">MIV</h1>
                    <p className="text-slate-400 text-xs font-medium">
                      Enterprise Platform
                    </p>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-full bg-slate-900 text-slate-100">
                {/* Search */}
                <div className="p-4 border-b border-slate-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Full Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
                  {navigationItems.map((item) => (
                    <div key={item.title}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          {item.href ? (
                            <Link
                              href={item.href}
                              onClick={handleNavClick}
                              className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex-1",
                                isActive(item.href)
                                  ? "bg-blue-600/20 text-blue-100 border-l-4 border-blue-500"
                                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-l-4 hover:border-slate-600"
                              )}
                            >
                              <item.icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-300" />
                              <span className="flex-1">{item.title}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          ) : (
                            <button
                              onClick={() => toggleExpanded(item.title)}
                              className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex-1 text-slate-300 hover:bg-slate-800/80 hover:text-white text-left"
                            >
                              <item.icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-300" />
                              <span className="flex-1">{item.title}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </button>
                          )}

                          {item.children && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(item.title)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-300 hover:bg-slate-800"
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
                          <div className="ml-6 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href!}
                                onClick={handleNavClick}
                                className={cn(
                                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                  isActive(child.href!)
                                    ? "bg-blue-600/20 text-blue-100 border-l-2 border-blue-500"
                                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-l-2 hover:border-slate-600"
                                )}
                              >
                                <child.icon className="mr-3 h-4 w-4" />
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
                <div className="p-4 border-t border-slate-800 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      New Venture
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <BarChart className="h-3 w-3 mr-1" />
                      Report
                    </Button>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">
                        John Doe
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        john@miv.com
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="flex-1 text-xs">
                      <Bell className="h-3 w-3 mr-1" />
                      Notifications
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1 text-xs">
                      <HelpCircle className="h-3 w-3 mr-1" />
                      Help
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}