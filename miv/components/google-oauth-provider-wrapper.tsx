"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

export function GoogleOAuthProviderWrapper({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<GoogleOAuthProvider
			clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
		>
			{children}
		</GoogleOAuthProvider>
	);
}