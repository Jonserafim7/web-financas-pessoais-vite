import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { useSession } from "@/features/auth/hooks/use-session";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected"!</div>;
}
