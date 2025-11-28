import * as Sentry from "@sentry/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import { useSession } from "./features/auth/hooks/use-session";
import { ThemeProvider } from "./components/theme-provider";
import { routeTree } from "./routeTree.gen";
import { Spinner } from "./components/ui/spinner";

Sentry.init({
  dsn: "https://f6082a98ad580f26220840d8f63c370f@o4510440027324416.ingest.us.sentry.io/4510440028241920",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    session: undefined!,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const { data: session, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <RouterProvider
      router={router}
      context={{ queryClient, session }}
    />
  );
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="vite-ui-theme"
        >
          <InnerApp />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
