import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../query-keys";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

/**
 * Mutation to sign out current user session.
 * Clears authentication state, cache, and redirects to login.
 */
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const result = await authClient.signOut();
      if (result.error) {
        throw new Error(result.error.message || "Erro ao fazer logout");
      }
      return result.data;
    },
    onSuccess: async () => {
      // Refetch session query (server returns null after sign-out)
      await queryClient.refetchQueries({ queryKey: authKeys.session });
      // Navigate to sign-in page (guards check cache, see null session)
      await router.navigate({ to: "/sign-in" });
      // Clear all other cached queries to prevent data leakage between users
      queryClient.removeQueries({
        predicate: (query) => {
          // Keep session query (already null), remove everything else
          const [namespace, key] = query.queryKey;
          return !(namespace === "auth" && key === "session");
        },
      });
      // Show success toast
      toast.success("Logout realizado com sucesso");
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Erro ao fazer logout");
    },
  });
}
