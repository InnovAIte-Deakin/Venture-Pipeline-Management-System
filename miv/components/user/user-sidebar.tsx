"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Logo from "../logo";
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
        // navigate to login page
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
        // { name: "Capital Facilitation", icon: DollarSign, href: "/capital" },
        // { name: "GEDSI Tracker", icon: BarChart3, href: "/gedsi" },
        // { name: "Investor Management", icon: Users, href: "/investors" },
        // { name: "Funding Round Tracker", icon: TrendingUp, href: "/funding" },
      ],
    },
    {
      title: "REPORTS",
      items: [
        { name: "Impact Reports", icon: FileText, href: "/reports/impact" },
        {
          name: "Performance Analytics",
          icon: PieChart,
          href: "/reports/analytics",
        },
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
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900/95 backdrop-blur-md text-slate-100 shadow-2xl border-r border-slate-800 flex flex-col z-50 transition-all duration-300">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3 hover:bg-slate-800/50 transition-colors duration-200">
        <Logo size={"md"} />
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">MIV</h1>
          <p className="text-slate-400 text-xs font-medium">Impact Dashboard</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        {menuSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-8">
            <h3 className="px-4 mb-3 text-xs font-bold text-slate-400 tracking-wider">
              {section.title}
            </h3>
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/50"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`}
                      />
                      <span className="font-medium text-xs">{item.name}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer - Optional User Section */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-sm font-bold">
            {userData ? (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0" id="userdata">
            <p className="text-sm font-medium text-white truncate">
              {userData ? `${userData.firstName} ${userData.lastName}` : 'User Portal'}
            </p>
            <p className="text-xs text-slate-400 truncate">{userData?.email || 'portal@mekong.vc'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-60"
        >
         {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
