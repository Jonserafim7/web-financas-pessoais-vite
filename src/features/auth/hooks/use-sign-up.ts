import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../query-keys";

/** Sign-up mutation variables. */
interface SignUpVariables {
	name: string;
	email: string;
	password: string;
}

/**
 * Mutation to register new user with email/password.
 * Invalidates session query on success to trigger redirect.
 */
export function useSignUp() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (variables: SignUpVariables) => {
			const result = await authClient.signUp.email({
				name: variables.name,
				email: variables.email,
				password: variables.password,
			});
			if (result.error) {
				throw new Error(result.error.message || "Failed to sign up");
			}
			return result.data;
		},
		onSuccess: () => {
			// Invalidate session query to trigger refetch and redirect
			queryClient.invalidateQueries({ queryKey: authKeys.session });
		},
	});
}

