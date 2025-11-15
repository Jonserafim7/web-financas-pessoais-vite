import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { createFileRoute } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { useSession } from "@/features/auth/hooks/use-session";
import { useTransactionsControllerFindAll } from "@/lib/generated/api/transactions/transactions";
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute("/_protected/")({
  component: Index,
});

function Index() {
  const { mutate: signOut } = useSignOut();
  const { data: session } = useSession();
  const { data: transactions } = useTransactionsControllerFindAll(undefined, {
    query: {
      enabled: !!session?.user?.id,
    },
  });

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-4">
      <div className="absolute top-0 right-0 flex items-center justify-center gap-2 p-4">
        <ModeToggle />
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => {
            signOut();
          }}
        >
          <LogOutIcon />
        </Button>
      </div>
      <h1 className="text-2xl font-bold">
        Bem-vindo(a) de volta, {session?.user?.name}!
      </h1>
    </div>
  );
}
