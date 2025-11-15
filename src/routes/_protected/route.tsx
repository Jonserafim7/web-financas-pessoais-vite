import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { authKeys } from "@/features/auth/query-keys";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context }) => {
    // Check session from query cache directly (more reliable than context)
    const sessionFromCache = context.queryClient.getQueryData(authKeys.session);

    if (!sessionFromCache) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: () => <Outlet />,
});
