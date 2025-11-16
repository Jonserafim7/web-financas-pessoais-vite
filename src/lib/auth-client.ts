import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client configured for cookie-based authentication.
 * Handles authentication state, session management, and cookie persistence.
 */
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: import.meta.env.VITE_API_URL,
  /** Override default "/api/auth" to match backend routes */
  basePath: "/auth",
  fetchOptions: {
    credentials: "include", // Send cookies with every auth request
  },
});
