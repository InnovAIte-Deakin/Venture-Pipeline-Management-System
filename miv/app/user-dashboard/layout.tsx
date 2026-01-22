"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { Breadcrumb } from "@/components/breadcrumb";
import { Search, Bell, Moon, HelpCircle, Download, User } from "lucide-react";
import UserSidebar from "@/components/user/user-sidebar";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Development authentication bypass
    // In production, this would check for proper authentication
    if (typeof window !== "undefined") {
      // For development, always authenticate
      setIsAuthenticated(true);
    }
    setLoading(false);

    // Fetch user data
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access the dashboard.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div>
        <UserSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <div>
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between gap-6">
              {/* Left Section - Logo and Status */}
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
                  Venture Pipeline 
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">
                    Live
                  </span>
                </div>
              </div>

              {/* Center Section - Search */}
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-3">

                {/* Help */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <HelpCircle className="w-6 h-6 text-gray-600" />
                </button>
                {/* User Avatar */}
                <Link href="/user-dashboard/profile" className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow">
                  {userData ? (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase() : ''}
                </Link>
              </div>
            </div>
          </header>
          <div className="p-4 lg:p-6">
            <Breadcrumb />
            {children}
          </div>
        </div>
      </div>

      {/* Fixed Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {/* Add notification components here */}
      </div>
    </div>
  );
}
