import { ModeToggle } from "@/components/mode-toggle";
import { authKeys } from "@/features/auth/query-keys";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    // Check session from query cache directly (more reliable than context)
    const sessionFromCache = context.queryClient.getQueryData(authKeys.session);

    if (sessionFromCache) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Outlet />
    </div>
  );
}
