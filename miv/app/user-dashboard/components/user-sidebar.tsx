"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Target,
  DollarSign,
  BarChart3,
  Users,
  TrendingUp,
  FileText,
  PieChart,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Logo from "@/components/logo";
import { useRouter } from "next/navigation";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function UserSidebar() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch('/backend/api/users', {
          credentials: 'include',
        });
        const body = await res.json().catch(() => null);
        if (res.ok && body?.success && body?.user) {
          setUserData({
            firstName: body.user.firstName || '',
            lastName: body.user.lastName || '',
            email: body.user.email || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    }
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      const res = await fetch('/backend/api/auth/login', {
        method: 'DELETE',
        credentials: 'include',
      })

      const body = await res.json().catch(() => null)

      if (res.ok && body?.success) {
        router.push('/auth/login')
      } else {
        console.error('Logout failed', body)
        router.push('/auth/login')
      }
    } catch (err) {
      console.error('Logout error', err)
      router.push('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const menuSections = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, href: "/user-dashboard" },
        { name: "Diagnostics & Readiness", icon: Target, href: "/user-dashboard/diagnostics" },
        { name: "Documents", icon: FileText, href: "/user-dashboard/documents" },
      ],
    },
    {
      title: "SETTINGS",
      items: [
        {
          name: "System Settings",
          icon: Settings,
          href: "/user-dashboard/profile",
        },
        { name: "Help & Support", icon: HelpCircle, href: "/user-dashboard/support" },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 w-64 h-screen bg-sidebar text-sidebar-foreground shadow-2xl border-r border-sidebar-border flex flex-col z-50 transition-all duration-300",
        isCollapsed && "w-16",
      )}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border flex items-center gap-3 hover:bg-sidebar-accent transition-colors duration-200">
        <Logo size={isCollapsed ? "sm" : "md"} />
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-sidebar-accent-foreground tracking-wide">MIV</h1>
            <p className="text-sidebar-foreground/70 text-xs font-medium">Impact Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        {menuSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-8">
            {!isCollapsed && (
              <h3 className="px-4 mb-3 text-xs font-bold text-sidebar-foreground/70 tracking-wider">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = activeItem === item.name;

                return (
                  <li key={itemIdx}>
                    <div
                      onClick={() => {
                        router.push(item.href);
                        setActiveItem(item.name);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground border-l-4 border-sidebar-ring"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-l-4 hover:border-sidebar-border",
                      )}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 ${isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70"}`}
                      />
                      {!isCollapsed && (
                        <span className="font-medium text-xs">{item.name}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer - User Section */}
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent">
            <div className="w-10 h-10 bg-sidebar-primary text-sidebar-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {userData ? (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0" id="userdata">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                {userData ? `${userData.firstName} ${userData.lastName}` : 'User Portal'}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{userData?.email || 'portal@mekong.vc'}</p>
            </div>
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-60"
          >
           {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
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
  );
}