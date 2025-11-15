import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../query-keys";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

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
  const router = useRouter();
  return useMutation({
    mutationFn: async (variables: SignInVariables) => {
      const result = await authClient.signIn.email({
        email: variables.email,
        password: variables.password,
      });
      if (result.error) {
        throw new Error(result.error.message || "Erro ao fazer login");
      }
      return result.data;
    },
    onSuccess: async () => {
      // Refetch session query and wait for it to complete
      await queryClient.refetchQueries({ queryKey: authKeys.session });
      // Navigate to home page - beforeLoad guards will check cache directly
      await router.navigate({ to: "/" });
      // Show success toast
      toast.success("Login realizado com sucesso");
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Erro ao fazer login");
    },
  });
}
