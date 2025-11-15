import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { authKeys } from "../query-keys";

/**
 * Fetch current authenticated session. Returns user data + session state.
 * Always refetches on invalidation (staleTime: 0) to ensure immediate updates
 * after sign-in/sign-up/sign-out operations.
 */
export function useSession() {
  return useQuery({
    // Namespaced query key for cache isolation
    queryKey: authKeys.session,
    queryFn: async () => {
      const result = await authClient.getSession();
      if (result.error) {
        throw new Error(result.error.message || "Failed to fetch session");
      }
      return result.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
}
