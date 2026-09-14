"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { HelpCircle, Menu, Search } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobileMenuOpen]);

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
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <UserSidebar />
      </div>

      {/* Mobile sidebar and backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative h-full w-fit">
            <UserSidebar mobile onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <div>
          <header className="bg-card border-b border-border px-4 py-3 lg:px-6 lg:py-4">
            <div className="flex items-center justify-between gap-3 lg:gap-6">
              {/* Left Section - Logo and Status */}
              <div className="flex min-w-0 items-center gap-3 lg:gap-4">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open navigation menu"
                  aria-expanded={isMobileMenuOpen}
                  className="rounded-lg border border-border p-2 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h1 className="truncate text-lg font-bold text-primary whitespace-nowrap sm:text-xl lg:text-2xl">
                  Venture Pipeline 
                </h1>
                <div className="hidden items-center gap-2 rounded-full bg-success/10 px-3 py-1 sm:flex">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-success">
                    Live
                  </span>
                </div>
              </div>

              {/* Center Section - Search */}
              <div className="hidden flex-1 max-w-2xl md:block">
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
                <button
                  type="button"
                  aria-label="Help"
                  className="hidden p-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors sm:block"
                >
                  <HelpCircle className="w-6 h-6 text-muted-foreground" />
                </button>
                {/* User Avatar */}
                <Link href="/user-dashboard/profile" aria-label="Open profile" className="w-9 h-9 lg:w-10 lg:h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold hover:shadow-lg transition-shadow">
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
