import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL ||
	process.env.PUBLIC_BACKEND_URL ||
	"http://localhost:3001";

function getPayloadToken(setCookie: string | null): string | null {
	if (!setCookie) return null;

	const match = setCookie.match(/(?:^|,\s*)payload-token=([^;]+)/);
	return match?.[1] ?? null;
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.text();
		const backendResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": request.headers.get("content-type") || "application/json",
			},
			body,
		});

		const data = await backendResponse.json().catch(() => ({
			success: false,
			message: "Login failed",
		}));

		const response = NextResponse.json(data, {
			status: backendResponse.status,
		});

		const token = getPayloadToken(backendResponse.headers.get("set-cookie"));
		if (token) {
			response.cookies.set("payload-token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 7,
				path: "/",
			});
		}

		return response;
	} catch (error) {
		console.error("Frontend session login error:", error);

		return NextResponse.json(
			{
				success: false,
				message: "An error occurred during login. Please try again.",
			},
			{ status: 500 }
		);
	}
}
