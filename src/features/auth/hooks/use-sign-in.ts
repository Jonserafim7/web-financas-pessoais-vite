import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../query-keys";

/** Sign-in mutation variables. */
interface SignInVariables {
  email: string;
  password: string;
}

/**
 * Mutation to sign in user with email/password.
 * Invalidates session query on success to trigger redirect.
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: SignInVariables) => {
      const result = await authClient.signIn.email({
        email: variables.email,
        password: variables.password,
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to sign in");
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate session query to trigger refetch and redirect
      queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}
