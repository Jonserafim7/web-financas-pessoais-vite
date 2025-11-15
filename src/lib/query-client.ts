import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query client configuration
 * Configured with sensible defaults for data fetching and caching
 */
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Time before data is considered stale (5 minutes)
			staleTime: 1000 * 60 * 5,

			// Time before inactive queries are garbage collected (10 minutes)
			gcTime: 1000 * 60 * 10,

			// Retry failed requests once
			retry: 1,

			// Refetch on window focus for fresh data
			refetchOnWindowFocus: true,

			// Refetch on reconnect
			refetchOnReconnect: true,

			// Don't refetch on mount if data is fresh
			refetchOnMount: true,
		},
		mutations: {
			// Retry failed mutations once
			retry: 1,
		},
	},
});

