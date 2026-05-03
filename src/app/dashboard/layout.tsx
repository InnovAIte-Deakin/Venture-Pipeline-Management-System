"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Breadcrumb } from "@/components/breadcrumb";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Development authentication bypass
		// In production, this would check for proper authentication
		if (typeof window !== "undefined") {
			// For development, always authenticate
			setIsAuthenticated(true);
		}
		setLoading(false);
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
			<div className="hidden lg:block">
				<Sidebar />
			</div>

			{/* Mobile Navigation */}
			<div className="lg:hidden fixed top-4 left-4 z-50">
				<MobileNav />
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0 lg:ml-64">
				<div className="p-4 lg:p-6">
					<Breadcrumb />
					{children}
				</div>
			</div>

			{/* Fixed Notifications */}
			<div className="fixed top-4 right-4 z-50 space-y-2">
				{/* Add notification components here */}
			</div>
		</div>
	);
}
