"use client";

import { useState } from "react";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const url = `/backend/api/users/login`;

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					password: password,
				}),
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			window.location.href = "/dashboard";
		} catch (err) {
			setError("Invalid email or password");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSuccess = async (credentialResponse: any) => {
		setIsGoogleLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/google/callback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token: credentialResponse.credential,
				}),
			});

			const text = await response.text();
			let data;

			try {
				data = JSON.parse(text);
			} catch {
				throw new Error(text || "Google sign-in failed");
			}

			if (!response.ok || !data.success) {
				throw new Error(data.message || data.error || "Google sign-in failed");
			}

			if (data?.user?.role === "user" || data?.user?.role === "founder") {
				window.location.href = "/user-dashboard";
			} else {
				window.location.href = "/dashboard";
			}
		} catch (err: any) {
			setError(err.message || "Google sign-in failed");
		} finally {
			setIsGoogleLoading(false);
		}
	};

	const handleGoogleError = () => {
		setError("Google sign-in failed");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 flex items-center justify-center p-4">
			<Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-xl">
				<CardHeader className="text-center space-y-4">
					<div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
						<span className="text-2xl">🏛️</span>
					</div>
					<div>
						<CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
							MIV
						</CardTitle>
						<CardDescription className="text-slate-600 dark:text-slate-400">
							Welcome Back
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
									className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 pr-10"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3"
							disabled={isLoading || isGoogleLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Login"
							)}
						</Button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-slate-300 dark:border-slate-600" />
						</div>

						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white dark:bg-slate-800 px-2 text-slate-500">
								Or continue with
							</span>
						</div>
					</div>

					<div className="flex justify-center">
						{isGoogleLoading ? (
							<Button className="w-full" disabled>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing in with Google...
							</Button>
						) : (
							<GoogleLogin
								onSuccess={handleGoogleSuccess}
								onError={handleGoogleError}
							/>
						)}
					</div>

					<div className="text-center space-y-4">
						<Link
							href="/auth/forgot-password"
							className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
						>
							Forgot Password?
						</Link>

						<div className="text-sm text-slate-600 dark:text-slate-400">
							Don't have an account?{" "}
							<Link
								href="/auth/register"
								className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
							>
								Sign up
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}