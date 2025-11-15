import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { TransactionForm, type TransactionFormValues } from "./form/transaction-form";
import { useTransactionsControllerUpdate } from "@/lib/generated/api/transactions/transactions";
import type { TransactionResponseDto } from "@/lib/generated/models";

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionResponseDto;
}

export function EditTransactionDialog({
  open,
  onOpenChange,
  transaction,
}: EditTransactionDialogProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useTransactionsControllerUpdate({
    mutation: {
      onSuccess: async () => {
        // Invalidate transactions list query
        await queryClient.invalidateQueries({
          queryKey: ["transactionsControllerFindAll"],
        });
        // Show success toast
        toast.success("Transação atualizada com sucesso");
        // Close dialog
        onOpenChange(false);
        // Clear error
        setError(null);
      },
      onError: (err) => {
        const message = err.message || "Erro ao atualizar transação";
        setError(message);
        toast.error(message);
      },
    },
  });

  const handleSubmit = (data: TransactionFormValues) => {
    setError(null);
    updateMutation.mutate({
      id: transaction.id,
      data: {
        type: data.type,
        categoryId: data.categoryId,
        amount: data.amount,
        description: data.description,
        date: data.date.toISOString(),
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogDescription>
            Altere os dados da transação
          </DialogDescription>
        </DialogHeader>

        <TransactionForm
          transaction={transaction}
          onSubmit={handleSubmit}
          isPending={updateMutation.isPending}
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="transaction-form"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? <Spinner /> : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
