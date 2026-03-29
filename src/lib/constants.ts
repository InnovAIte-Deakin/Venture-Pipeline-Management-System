// Publicly accessible backend base URL used by both client and server.
// Priority: NEXT_PUBLIC_BACKEND_URL -> PUBLIC_BACKEND_URL -> default localhost
export const PUBLIC_BACKEND_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL ||
	process.env.PUBLIC_BACKEND_URL ||
	'http://localhost:3001';

export default PUBLIC_BACKEND_URL;