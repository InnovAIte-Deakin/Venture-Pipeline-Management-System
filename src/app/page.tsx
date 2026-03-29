"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	ArrowRight,
	Target,
	Heart,
	Globe,
	Users,
	Award,
	TrendingUp,
	Building2,
	MapPin,
	Calendar,
	CheckCircle,
	Sparkles,
	BarChart3,
	FileText,
	DollarSign,
	Shield,
	Zap,
	Star,
	ArrowUpRight,
	Play,
	ChevronDown,
	MousePointer,
	Layers,
	Cpu,
	Database,
	Network,
	Rocket,
	Eye,
	Code,
	Palette,
	Smartphone,
	Lightbulb,
	BarChart,
	PieChart,
	Activity,
	UserPlus,
	Menu,
	X,
	Search,
	Bell,
	Settings,
	LogIn,
	User,
	ChevronRight,
	ExternalLink,
	Download,
	Mail,
	Phone,
	MessageCircle,
	Clock,
	Globe2,
	Lock,
	RefreshCw,
	Brain,
	Facebook,
	Linkedin,
} from "lucide-react";
import { Logo } from "@/components/logo";

export default function HomePage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState("hero");
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
	const [fontSize, setFontSize] = useState(16);
	const [colorScheme, setColorScheme] = useState("default");

	// Intersection Observer for smooth scrolling
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{ threshold: 0.5 }
		);

		const sections = document.querySelectorAll("section[id]");
		sections.forEach((section) => observer.observe(section));

		return () => observer.disconnect();
	}, []);

	// Apply accessibility settings
	useEffect(() => {
		document.documentElement.style.fontSize = `${fontSize}px`;

		// Remove existing theme classes
		document.documentElement.classList.remove("high-contrast", "dark-mode");

		// Apply color scheme
		if (colorScheme === "high-contrast") {
			document.documentElement.classList.add("high-contrast");
		} else if (colorScheme === "dark") {
			document.documentElement.classList.add("dark-mode");
		}
	}, [fontSize, colorScheme]);

	const handleEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			setEmail("");
			// Show success message
		}, 2000);
	};

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-grey-300 via-[#f4f4f4] to-white text-gray-900">
			{/* Navigation */}
			<nav className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<div className="flex items-center">
							<Logo />
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-8">
							<button
								onClick={() => scrollToSection("features")}
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Features
							</button>
							<button
								onClick={() => scrollToSection("solutions")}
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Solutions
							</button>
							<button
								onClick={() => scrollToSection("reviews")}
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Reviews
							</button>
							<button
								onClick={() => scrollToSection("pricing")}
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Pricing
							</button>
							<button
								onClick={() => scrollToSection("about")}
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								About
							</button>
							<button
								onClick={() => scrollToSection("contact")}
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Contact
							</button>
						</div>

						{/* CTA Buttons */}
						<div className="hidden md:flex items-center space-x-4">
							<Link href="/auth/login">
								<Button
									variant="ghost"
									size="sm"
									className="sign-in-btn"
								>
									<LogIn className="h-4 w-4 mr-2" />
									Sign In
								</Button>
							</Link>
							<Link href="/auth/register">
								<Button size="sm" className="get-started-btn">
									<UserPlus className="h-4 w-4 mr-2" />
									Get Started
								</Button>
							</Link>
						</div>

						{/* Mobile Menu Button */}
						<button
							className="md:hidden"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden bg-white border-t border-gray-200">
						<div className="px-2 pt-2 pb-3 space-y-1">
							<button
								onClick={() => {
									scrollToSection("features");
									setIsMenuOpen(false);
								}}
								className="block px-3 py-2 text-gray-600 hover:text-gray-900"
							>
								Features
							</button>
							<button
								onClick={() => {
									scrollToSection("solutions");
									setIsMenuOpen(false);
								}}
								className="block px-3 py-2 text-gray-600 hover:text-gray-900"
							>
								Solutions
							</button>
							<button
								onClick={() => {
									scrollToSection("reviews");
									setIsMenuOpen(false);
								}}
								className="block px-3 py-2 text-gray-600 hover:text-gray-900"
							>
								Reviews
							</button>
							<button
								onClick={() => {
									scrollToSection("pricing");
									setIsMenuOpen(false);
								}}
								className="block px-3 py-2 text-gray-600 hover:text-gray-900"
							>
								Pricing
							</button>
							<button
								onClick={() => {
									scrollToSection("about");
									setIsMenuOpen(false);
								}}
								className="block px-3 py-2 text-gray-600 hover:text-gray-900"
							>
								About
							</button>
							<button
								onClick={() => {
									scrollToSection("contact");
									setIsMenuOpen(false);
								}}
								className="block px-3 py-2 text-gray-600 hover:text-gray-900"
							>
								Contact
							</button>
							<div className="pt-4 space-y-2">
								<Button
									variant="ghost"
									size="sm"
									className="w-full sign-in-btn"
								>
									<LogIn className="h-4 w-4 mr-2" />
									Sign In
								</Button>
								<Button
									size="sm"
									className="w-full get-started-btn"
								>
									<UserPlus className="h-4 w-4 mr-2" />
									Get Started
								</Button>
							</div>
						</div>
					</div>
				)}
			</nav>

			{/* Accessibility Button */}
			<button
				onClick={() => setIsAccessibilityOpen(true)}
				className="fixed top-20 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
				aria-label="Open accessibility settings"
			>
				<Settings className="h-5 w-5" />
			</button>

			{/* Accessibility Side Panel */}
			{isAccessibilityOpen && (
				<>
					{/* Overlay */}
					<div
						className="fixed inset-0 bg-black/50 z-50"
						onClick={() => setIsAccessibilityOpen(false)}
					/>

					{/* Side Panel */}
					<div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform">
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-bold text-gray-900">
									Accessibility Settings
								</h2>
								<button
									onClick={() =>
										setIsAccessibilityOpen(false)
									}
									className="text-gray-400 hover:text-gray-600"
									aria-label="Close accessibility settings"
								>
									<X className="h-6 w-6" />
								</button>
							</div>

							{/* Font Size Control */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-3">
									Font Size
								</label>
								<div className="flex items-center space-x-4">
									<button
										onClick={() =>
											setFontSize(
												Math.max(12, fontSize - 2)
											)
										}
										className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
										aria-label="Decrease font size"
									>
										<span className="text-lg font-bold">
											A-
										</span>
									</button>
									<span className="text-sm text-gray-600 min-w-[60px] text-center">
										{fontSize}px
									</span>
									<button
										onClick={() =>
											setFontSize(
												Math.min(24, fontSize + 2)
											)
										}
										className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
										aria-label="Increase font size"
									>
										<span className="text-lg font-bold">
											A+
										</span>
									</button>
								</div>
							</div>

							{/* Color Scheme Control */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-3">
									Color Scheme
								</label>
								<div className="space-y-2">
									<label className="flex items-center">
										<input
											type="radio"
											name="colorScheme"
											value="default"
											checked={colorScheme === "default"}
											onChange={(e) =>
												setColorScheme(e.target.value)
											}
											className="mr-3"
										/>
										<span className="text-sm">Default</span>
									</label>
									<label className="flex items-center">
										<input
											type="radio"
											name="colorScheme"
											value="high-contrast"
											checked={
												colorScheme === "high-contrast"
											}
											onChange={(e) =>
												setColorScheme(e.target.value)
											}
											className="mr-3"
										/>
										<span className="text-sm">
											High Contrast
										</span>
									</label>
									<label className="flex items-center">
										<input
											type="radio"
											name="colorScheme"
											value="dark"
											checked={colorScheme === "dark"}
											onChange={(e) =>
												setColorScheme(e.target.value)
											}
											className="mr-3"
										/>
										<span className="text-sm">
											Dark Mode
										</span>
									</label>
								</div>
							</div>

							{/* Reset Button */}
							<Button
								onClick={() => {
									setFontSize(16);
									setColorScheme("default");
								}}
								variant="outline"
								className="w-full"
							>
								Reset to Default
							</Button>
						</div>
					</div>
				</>
			)}

			{/* Hero Section */}
			<section
				id="hero"
				className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
			>
				{/* Animated Background Elements */}
				<div className="absolute inset-0">
					{/* Geometric Shapes */}
					<div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

					{/* Floating Particles */}
					<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
					<div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-300"></div>
					<div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-700"></div>
					<div className="absolute top-2/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-1000"></div>
				</div>

				{/* Main Content */}
				<div className="max-w-6xl mx-auto px-6 my-5 lg:px-8 relative z-10 text-center pb-20">
					{/* Status Badge */}
					<div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white/90 font-medium mb-8">
						<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
						<span className="text-sm">Platform Live</span>
						<span className="text-green-400 font-semibold">•</span>
						<span className="text-sm">AI-Powered</span>
					</div>

					{/* Main Headline */}
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 mt-16 leading-relaxed text-center hero-title">
						<span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent py-2">
							Mekong Inclusive Ventures
						</span>
					</h1>

					{/* Subtitle */}
					<p className="text-xl md:text-1xl text-slate-300 mb-24 max-w-4xl mx-auto leading-relaxed text-center">
						Your central hub for managing your venture's growth —
						from diagnostics to readiness, GEDSI compliance, and
						capital facilitation — all in one place.
					</p>

					{/* What is this platform section */}
					<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8 max-w-4xl mx-auto text-center">
						<h3 className="text-2xl font-bold text-white mb-4">
							What is this platform?
						</h3>
						<p className="text-slate-300 leading-relaxed">
							MIV is here to help your impact venture grow,
							guiding you through preparations for funding,
							tracking your progress, and centralising your
							venture data to one powerful platform! Our services
							include GEDSI compliance tracking, readiness
							assessments, and streamlined capital facilitation,
							to help you secure the resources you need.
						</p>
					</div>

					{/* Small Gap */}
					<div className="h-10"></div>

					{/* Key Features Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
						<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
								<Brain className="h-6 w-6 text-white" />
							</div>
							<h3 className="text-white font-semibold mb-2">
								AI Analytics
							</h3>
							<p className="text-slate-400 text-sm">
								Intelligent insights and predictive modeling
							</p>
						</div>

						<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
								<Target className="h-6 w-6 text-white" />
							</div>
							<h3 className="text-white font-semibold mb-2">
								Pipeline Management
							</h3>
							<p className="text-slate-400 text-sm">
								End-to-end deal flow optimization
							</p>
						</div>

						<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
							<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
								<Heart className="h-6 w-6 text-white" />
							</div>
							<h3 className="text-white font-semibold mb-2">
								Impact Tracking
							</h3>
							<p className="text-slate-400 text-sm">
								Comprehensive ESG and GEDSI metrics
							</p>
						</div>
					</div>

					{/* Trust Indicators */}
					<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-slate-400">
						<div className="flex items-center space-x-2">
							<CheckCircle className="h-4 w-4 text-green-400" />
							<span className="text-sm">
								500+ Ventures Managed
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<CheckCircle className="h-4 w-4 text-green-400" />
							<span className="text-sm">
								$2.5B+ Capital Deployed
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<CheckCircle className="h-4 w-4 text-green-400" />
							<span className="text-sm">98% Success Rate</span>
						</div>
					</div>
				</div>
			</section>

			{/* Content sections with transparent backgrounds */}
			<div>
				{/* Features Section */}
				<section id="features" className="py-20 bg-transparent">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
								Everything You Need to Scale Your Venture
								Portfolio
							</h2>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto">
								From deal sourcing to exit management, MIV
								provides the tools and insights you need to make
								data-driven investment decisions.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{/* Feature Cards */}
							<Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
								<CardHeader>
									<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
										<Target className="h-6 w-6 text-blue-600" />
									</div>
									<CardTitle>Pipeline Management</CardTitle>
									<CardDescription>
										Streamline your deal flow from initial
										contact to final investment decision
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
								<CardHeader>
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
										<Brain className="h-6 w-6 text-purple-600" />
									</div>
									<CardTitle>AI-Powered Analytics</CardTitle>
									<CardDescription>
										Get intelligent insights and risk
										assessments powered by advanced AI
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
								<CardHeader>
									<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
										<Users className="h-6 w-6 text-green-600" />
									</div>
									<CardTitle>GEDSI Integration</CardTitle>
									<CardDescription>
										Track and measure gender, equity,
										disability, and social inclusion impact
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
								<CardHeader>
									<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
										<BarChart3 className="h-6 w-6 text-orange-600" />
									</div>
									<CardTitle>Advanced Reporting</CardTitle>
									<CardDescription>
										Generate comprehensive reports and
										visualizations for stakeholders
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
								<CardHeader>
									<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
										<DollarSign className="h-6 w-6 text-red-600" />
									</div>
									<CardTitle>Capital Facilitation</CardTitle>
									<CardDescription>
										Manage investment rounds, due diligence,
										and capital deployment
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
								<CardHeader>
									<div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
										<Shield className="h-6 w-6 text-indigo-600" />
									</div>
									<CardTitle>Enterprise Security</CardTitle>
									<CardDescription>
										Bank-level security with SOC 2
										compliance and data encryption
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</section>

				{/* Section Separator */}
				<div className="flex justify-center py-8">
					<div className="w-1/2 h-px bg-gray-300"></div>
				</div>

				{/* Solutions Section */}
				<section id="solutions" className="py-20 bg-transparent">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
								Solutions for Every Stage
							</h2>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto">
								Whether you're a seed-stage fund or a growth
								equity firm, MIV adapts to your investment
								strategy and scale.
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div>
								<h3 className="text-2xl font-bold text-gray-900 mb-6">
									Early-Stage Venture Capital
								</h3>
								<ul className="space-y-4">
									<li className="flex items-start">
										<CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
										<span>
											Deal sourcing and pipeline
											management
										</span>
									</li>
									<li className="flex items-start">
										<CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
										<span>Due diligence automation</span>
									</li>
									<li className="flex items-start">
										<CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
										<span>Portfolio company tracking</span>
									</li>
									<li className="flex items-start">
										<CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
										<span>
											Impact measurement and reporting
										</span>
									</li>
								</ul>
							</div>
							<div className="bg-white p-8 rounded-2xl shadow-lg">
								<div className="text-center">
									<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<Building2 className="h-8 w-8 text-blue-600" />
									</div>
									<h4 className="text-xl font-semibold mb-2">
										Venture Capital
									</h4>
									<p className="text-gray-600 mb-4">
										Perfect for funds managing $10M - $100M
									</p>
									<Button className="learn-more-btn">
										Learn More
									</Button>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Section Separator */}
				<div className="flex justify-center py-8">
					<div className="w-1/2 h-px bg-gray-300"></div>
				</div>

				{/* Latest Reviews Section */}
				<section id="reviews" className="py-20 bg-transparent">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
								Latest Reviews
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{/* Review 1 */}
							<Card className="border-0 shadow-md">
								<CardContent className="pt-6">
									<div className="flex mb-4">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="h-4 w-4 text-yellow-400 fill-current"
											/>
										))}
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3">
										Transformative Platform
									</h3>
									<p className="text-gray-600 text-sm leading-relaxed mb-4">
										MIV has completely revolutionized how we
										manage our venture pipeline. The GEDSI
										tracking capabilities alone have saved
										us countless hours and improved our
										impact reporting significantly.
									</p>
									<div className="flex items-center">
										<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
											S
										</div>
										<div>
											<div className="text-sm font-medium text-gray-900">
												Sarah Johnson
											</div>
											<div className="text-xs text-gray-500">
												Impact Investment Director
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Review 2 */}
							<Card className="border-0 shadow-md">
								<CardContent className="pt-6">
									<div className="flex mb-4">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="h-4 w-4 text-yellow-400 fill-current"
											/>
										))}
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3">
										Excellent Analytics
									</h3>
									<p className="text-gray-600 text-sm leading-relaxed mb-4">
										The AI-powered insights have helped us
										identify promising ventures we might
										have otherwise overlooked. The platform
										is intuitive and the support team is
										incredibly responsive.
									</p>
									<div className="flex items-center">
										<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold mr-3">
											M
										</div>
										<div>
											<div className="text-sm font-medium text-gray-900">
												Michael Chen
											</div>
											<div className="text-xs text-gray-500">
												Senior Investment Analyst
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Review 3 */}
							<Card className="border-0 shadow-md">
								<CardContent className="pt-6">
									<div className="flex mb-4">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="h-4 w-4 text-yellow-400 fill-current"
											/>
										))}
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3">
										Game Changer for Impact Investing
									</h3>
									<p className="text-gray-600 text-sm leading-relaxed mb-4">
										As a fund focused on sustainable
										development in Southeast Asia, MIV has
										been indispensable. The capital
										facilitation features streamlined our
										investment process significantly.
									</p>
									<div className="flex items-center">
										<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold mr-3">
											A
										</div>
										<div>
											<div className="text-sm font-medium text-gray-900">
												Aisha Rahman
											</div>
											<div className="text-xs text-gray-500">
												Fund Managing Partner
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Pricing Section */}
				<section id="pricing" className="py-20 bg-[#ededef]">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
								Simple, Transparent Pricing
							</h2>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto">
								Choose the plan that fits your fund size and
								investment strategy.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{/* Starter Plan */}
							<Card className="relative border-2 hover:border-blue-500 transition-colors">
								<CardHeader className="text-center">
									<CardTitle>Starter</CardTitle>
									<div className="text-3xl font-bold">
										$99
										<span className="text-lg text-gray-500">
											/month
										</span>
									</div>
									<CardDescription>
										Perfect for emerging managers
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 mb-6">
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											Up to 50 ventures
										</li>
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											Basic analytics
										</li>
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											Email support
										</li>
									</ul>
									<Button className="w-full get-started-btn">
										Get Started
									</Button>
								</CardContent>
							</Card>

							{/* Professional Plan */}
							<Card className="relative border-2 border-blue-500 shadow-lg scale-105">
								<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
									<Badge className="bg-blue-500 text-white">
										Most Popular
									</Badge>
								</div>
								<CardHeader className="text-center">
									<CardTitle>Professional</CardTitle>
									<div className="text-3xl font-bold">
										$299
										<span className="text-lg text-gray-500">
											/month
										</span>
									</div>
									<CardDescription>
										For growing venture firms
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 mb-6">
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											Up to 200 ventures
										</li>
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											AI-powered analytics
										</li>
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											Priority support
										</li>
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											Advanced reporting
										</li>
									</ul>
									<Button className="w-full get-started-btn">
										Get Started
									</Button>
								</CardContent>
							</Card>

							{/* Enterprise Plan */}
							<Card className="relative border-2 hover:border-purple-500 transition-colors">
								<CardHeader className="text-center">
									<CardTitle>Enterprise</CardTitle>
									<div className="text-3xl font-bold">
										Custom
									</div>
									<CardDescription>
										For large investment firms
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 mb-6">
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											Unlimited ventures
										</li>
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											Custom integrations
										</li>
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											Dedicated support
										</li>
										<li className="flex items-center">
											<CheckCircle className="h-4 w-4 text-green-500 mr-2" />
											White-label options
										</li>
									</ul>
									<Button
										variant="outline"
										className="w-full contact-sales-btn"
									>
										Contact Sales
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* About Section */}
				<section id="about" className="py-20 bg-transparent">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div>
								<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
									About MIV
								</h2>
								<p className="text-lg text-gray-600 mb-6">
									MIV (Mekong Inclusive Ventures) is a
									comprehensive platform designed to empower
									venture capital firms across Southeast Asia.
									We believe in the power of inclusive
									investment to drive sustainable economic
									growth.
								</p>
								<div className="grid grid-cols-2 gap-6">
									<div>
										<div className="text-2xl font-bold text-blue-600">
											500+
										</div>
										<div className="text-gray-600">
											Ventures Managed
										</div>
									</div>
									<div>
										<div className="text-2xl font-bold text-purple-600">
											$2.8B
										</div>
										<div className="text-gray-600">
											Capital Facilitated
										</div>
									</div>
									<div>
										<div className="text-2xl font-bold text-green-600">
											89%
										</div>
										<div className="text-gray-600">
											GEDSI Compliance
										</div>
									</div>
									<div>
										<div className="text-2xl font-bold text-orange-600">
											76%
										</div>
										<div className="text-gray-600">
											Success Rate
										</div>
									</div>
								</div>
							</div>
							<div className="bg-white p-8 rounded-2xl shadow-lg mission-card">
								<h3 className="text-xl font-semibold mb-4 text-gray-900">
									Our Mission
								</h3>
								<p className="text-gray-600 mb-6">
									To democratize access to venture capital and
									create sustainable impact through
									technology-driven investment management.
								</p>
								<div className="space-y-4">
									<div className="flex items-center">
										<Target className="h-5 w-5 text-blue-500 mr-3" />
										<span className="text-gray-700">
											Inclusive Investment
										</span>
									</div>
									<div className="flex items-center">
										<Globe className="h-5 w-5 text-green-500 mr-3" />
										<span className="text-gray-700">
											Sustainable Growth
										</span>
									</div>
									<div className="flex items-center">
										<Users className="h-5 w-5 text-purple-500 mr-3" />
										<span className="text-gray-700">
											Community Impact
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Section Separator */}
				<div className="flex justify-center py-8">
					<div className="w-1/2 h-px bg-gray-300"></div>
				</div>

				{/* Contact Section */}
				<section id="contact" className="py-20 bg-transparent">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
								Get in Touch
							</h2>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto">
								Ready to transform your venture pipeline? Let's
								discuss how MIV can help you achieve your
								investment goals.
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
							<div>
								<h3 className="text-2xl font-semibold mb-6">
									Contact Information
								</h3>
								<div className="space-y-4">
									<div className="flex items-center">
										<Mail className="h-5 w-5 text-blue-500 mr-3" />
										<span>hello@miv-platform.com</span>
									</div>
									<div className="flex items-center">
										<Phone className="h-5 w-5 text-green-500 mr-3" />
										<span>+1 (555) 123-4567</span>
									</div>
									<div className="flex items-center">
										<MapPin className="h-5 w-5 text-purple-500 mr-3" />
										<span>Singapore, Southeast Asia</span>
									</div>
								</div>
							</div>
							<div>
								<form className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Input placeholder="First Name" />
										<Input placeholder="Last Name" />
									</div>
									<Input
										type="email"
										placeholder="Email Address"
									/>
									<Input placeholder="Company" />
									<textarea
										className="w-full p-3 border border-gray-300 rounded-md resize-none"
										rows={4}
										placeholder="Message"
									/>
									<Button className="w-full send-message-btn">
										Send Message
									</Button>
								</form>
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<div className="flex items-center mb-4">
								<Logo />
							</div>
							<p className="text-gray-400 mb-4">
								Empowering inclusive ventures across Southeast{" "}
								<br /> Asia through innovative pipeline
								management.
							</p>
							<div className="flex space-x-4">
								<a
									href="https://www.facebook.com/MekongInclusiveVentures/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-white transition-colors"
								>
									<Facebook className="h-5 w-5" />
								</a>
								<a
									href="https://www.linkedin.com/company/mekong-inclusive-ventures/?originalSubdomain=kh"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-white transition-colors"
								>
									<Linkedin className="h-5 w-5" />
								</a>
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-4">
								Contact Details
							</h4>
							<div className="text-gray-400 space-y-2">
								<p className="leading-relaxed">
									#1381, National Road 2, Phum Tuol Roka,
									<br />
									Sangkat Chat Angre Krom,
									<br />
									Khan Meanchey Phnom Penh,
									<br />
									Cambodia
								</p>
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-4">
								Phone Numbers
							</h4>
							<div className="space-y-2 text-gray-400">
								<div className="flex items-center">
									<Phone className="h-4 w-4 mr-2" />
									<a
										href="tel:+85517350544"
										className="hover:text-white transition-colors"
									>
										+855 17 350 544
									</a>
								</div>
								<div className="flex items-center">
									<Phone className="h-4 w-4 mr-2" />
									<a
										href="tel:+85516708848"
										className="hover:text-white transition-colors"
									>
										+855 16 708 848
									</a>
								</div>
								<div className="flex items-center">
									<Phone className="h-4 w-4 mr-2" />
									<a
										href="tel:+85588733492"
										className="hover:text-white transition-colors"
									>
										+855 88 733 4902
									</a>
								</div>
							</div>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2026 MIV Platform. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
