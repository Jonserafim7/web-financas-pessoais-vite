import { createFileRoute, redirect } from "@tanstack/react-router";
// components
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { ModeToggle } from "@/components/mode-toggle";
import { authKeys } from "@/features/auth/query-keys";

export const Route = createFileRoute("/sign-in")({
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
      <SignInForm />
    </div>
  );
}
