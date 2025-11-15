import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up")({
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/sign-up"!</div>;
}
