import { useState } from "react";
import { TagIcon, TrendingDown, TrendingUp } from "lucide-react";
import type { TransactionResponseDto } from "@/lib/generated/models/transactionResponseDto";
import { formatTransactionDate } from "@/lib/utils";
import { EditTransactionDialog } from "./edit-transaction-dialog";

interface TransactionItemProps {
  transaction: TransactionResponseDto;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isExpense = transaction.type === "EXPENSE";
  const isIncome = transaction.type === "INCOME";

  // Format amount with +/- prefix
  const formattedAmount = `R$ ${isIncome ? "+" : "-"}${Math.abs(Number(transaction.amount)).toFixed(2)}`;

  // Format date as "DD MMM" in pt-BR (e.g., "25 jun")
  const formattedDate = formatTransactionDate(transaction.date);

  return (
    <>
      <div
        onClick={() => setIsEditDialogOpen(true)}
        className="bg-card border-border hover:bg-muted/50 flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 shadow-sm transition-colors"
      >
        {/* Left section: Icon + Category + Description */}
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isExpense ? "bg-destructive/10" : "bg-success/10"
            }`}
          >
            {isExpense ? (
              <TrendingDown className="text-destructive size-5" />
            ) : (
              <TrendingUp className="text-success size-5" />
            )}
          </div>

          {/* Category + Description */}
          <div className="flex flex-col">
            <span className="text-foreground font-medium">
              {transaction.description && transaction.description.trim() !== ""
                ? transaction.description
                : isIncome
                  ? "Receita"
                  : "Despesa"}
            </span>
            <div className="flex items-center gap-1.5">
              <TagIcon className="text-muted-foreground size-3.5" />
              <span className="text-muted-foreground text-sm">
                {transaction.category.name}
              </span>
            </div>
          </div>
        </div>

        {/* Right section: Amount + Date */}
        <div className="flex flex-col items-end">
          <span
            className={`font-semibold ${
              isExpense ? "text-destructive" : "text-success"
            }`}
          >
            {formattedAmount}
          </span>
          <span className="text-muted-foreground text-sm">{formattedDate}</span>
        </div>
      </div>

      {/* Edit Transaction Dialog */}
      <EditTransactionDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        transaction={transaction}
      />
    </>
  );
}
