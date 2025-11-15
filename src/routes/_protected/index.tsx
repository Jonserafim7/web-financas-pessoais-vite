import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { TransactionList } from "@/features/transactions/components/transaction-list";
import {
  CreateTransactionDialog,
  TransactionsSummary,
} from "@/features/transactions/components";

export const Route = createFileRoute("/_protected/")({
  component: Index,
});

function Index() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <AppHeader title="Minhas Finanças" />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-12 flex flex-col gap-4">
          <h2 className="font-medium">Resumo</h2>
          <TransactionsSummary />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-medium">Histórico</h2>
          </div>
          <Button
            variant={"outline"}
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <PlusIcon />
            Nova Transação
          </Button>
        </div>

        <TransactionList />
      </main>

      <CreateTransactionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
