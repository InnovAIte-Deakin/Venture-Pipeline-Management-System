"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/dashboard/navigation/mobile-nav";
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
			<div className="hidden lg:block">
				<Sidebar />
			</div>

			{/* Mobile Navigation */}
			<div className="lg:hidden">
				<MobileNav />
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0 lg:ml-64">
				<div className="p-4 pt-20 pb-20 lg:p-6 lg:pt-6 lg:pb-0">
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
