import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import type { useSession } from "@/features/auth/hooks/use-session";
import "@/index.css";
import { Toaster } from "sonner";

interface RouterContext {
  queryClient: QueryClient;
  session: ReturnType<typeof useSession>["data"];
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFountComponent,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
      <TanStackDevtools
        plugins={[
          {
            name: "TanStack Query",
            render: <ReactQueryDevtoolsPanel />,
            defaultOpen: false,
          },
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
            defaultOpen: false,
          },
          {
            name: "TanStack Form",
            render: <FormDevtoolsPanel />,
            defaultOpen: true,
          },
        ]}
      />
    </>
  );
}

function NotFountComponent() {
  return (
    <div>
      <p>This is the notFoundComponent configured on root route</p>
      <Link to="/">Start Over</Link>
    </div>
  );
}
