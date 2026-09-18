"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MobileNav } from "@/components/dashboard/navigation/mobile-nav";
import { Breadcrumb } from "@/components/breadcrumb";
import { Search, Bell, Moon, HelpCircle, Download, User } from "lucide-react";
import UserSidebar from "./components/user-sidebar";

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
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Required
          </h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access the dashboard.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div>
        <UserSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <div>
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between gap-6">
              {/* Left Section - Logo and Status */}
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-primary whitespace-nowrap">
                  Venture Pipeline 
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-success">
                    Live
                  </span>
                </div>
              </div>

              {/* Center Section - Search */}
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-12 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-3">

                {/* Help */}
                <button className="p-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                  <HelpCircle className="w-6 h-6 text-muted-foreground" />
                </button>
                {/* User Avatar */}
                <Link href="/user-dashboard/profile" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold hover:shadow-lg transition-shadow">
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
