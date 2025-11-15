/**
 * Centralized query keys for auth-related queries.
 * Using 'as const' ensures type safety and prevents accidental mutations.
 */
export const authKeys = {
  session: ["auth", "session"] as const,
};
