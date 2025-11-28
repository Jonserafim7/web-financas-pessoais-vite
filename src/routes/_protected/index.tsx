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
import {
  DateRangePicker,
  type DateRangeValue,
} from "@/components/date-range-picker";


export const Route = createFileRoute("/_protected/")({
  component: Index,
});

function Index() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeValue>();

  return (
    <div className="bg-background min-h-screen">
      <AppHeader title="Minhas Finanças" />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-medium">Resumo Geral</h2>
        </div>
        <div className="mb-6">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        <div className="mb-12 flex flex-col gap-4">
          <TransactionsSummary
            dateFrom={dateRange?.dateFrom}
            dateTo={dateRange?.dateTo}
          />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-medium">Transações</h2>
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

        <TransactionList
          dateFrom={dateRange?.dateFrom}
          dateTo={dateRange?.dateTo}
        />
      </main>

      <CreateTransactionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
