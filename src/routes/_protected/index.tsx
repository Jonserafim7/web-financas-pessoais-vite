import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { createFileRoute } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";

export const Route = createFileRoute("/_protected/")({
  component: Index,
});

function Index() {
  const { mutate: signOut } = useSignOut();
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Welcome Home!</h1>
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Sair
        <LogOutIcon />
      </Button>
    </div>
  );
}
