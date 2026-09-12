import { NextRequest, NextResponse } from "next/server";

const configuredBackendUrl =
	process.env.NEXT_PUBLIC_BACKEND_URL ||
	process.env.PUBLIC_BACKEND_URL ||
	"http://localhost:3001";

function getBackendUrl(): string {
	try {
		const url = new URL(configuredBackendUrl);
		if (url.hostname === "localhost") {
			url.hostname = "127.0.0.1";
		}
		return url.toString().replace(/\/$/, "");
	} catch {
		return configuredBackendUrl.replace(/\/$/, "");
	}
}

function getPayloadToken(setCookie: string | null): string | null {
	if (!setCookie) return null;

	const match = setCookie.match(/(?:^|,\s*)payload-token=([^;]+)/);
	return match?.[1] ?? null;
}

async function fetchBackendLogin(body: string, contentType: string): Promise<Response> {
	const backendUrl = `${getBackendUrl()}/api/auth/login`;
	let lastError: unknown;

	for (let attempt = 1; attempt <= 3; attempt += 1) {
		try {
			return await fetch(backendUrl, {
				method: "POST",
				headers: {
					"Content-Type": contentType,
					Connection: "close",
				},
				body,
				cache: "no-store",
			});
		} catch (error) {
			lastError = error;
			if (attempt < 3) {
				await new Promise((resolve) => setTimeout(resolve, attempt * 250));
			}
		}
	}

	throw lastError;
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.text();
		const backendResponse = await fetchBackendLogin(
			body,
			request.headers.get("content-type") || "application/json"
		);

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
				message:
					"Unable to reach the authentication service. Please try again after the backend is ready.",
			},
			{ status: 502 }
		);
	}
}

export async function DELETE() {
	const response = NextResponse.json({ success: true });

	response.cookies.set("payload-token", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0,
		path: "/",
	});

	return response;
}
