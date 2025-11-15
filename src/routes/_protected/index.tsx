import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { createFileRoute } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { TransactionList } from "@/features/transactions/components/transaction-list";

export const Route = createFileRoute("/_protected/")({
  component: Index,
});

function Index() {
  const { mutate: signOut } = useSignOut();

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-4">
      <header className="absolute top-0 right-0 flex items-center justify-center gap-2 p-4">
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
      </header>
      <main className="flex flex-col items-center justify-center gap-4">
        <TransactionList />
      </main>
    </div>
  );
}
