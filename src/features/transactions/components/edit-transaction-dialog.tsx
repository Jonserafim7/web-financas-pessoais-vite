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
import {
  TransactionForm,
  type TransactionFormValues,
} from "./form/transaction-form";
import {
  useTransactionsControllerUpdate,
  getTransactionsControllerFindAllQueryKey,
} from "@/lib/generated/api/transactions/transactions";
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
      onSuccess: async (data) => {
        console.log("[EditTransactionDialog] Mutation success:", data);
        console.log("[EditTransactionDialog] Invalidating queries...");
        await queryClient.invalidateQueries({
          queryKey: getTransactionsControllerFindAllQueryKey(),
        });
        console.log("[EditTransactionDialog] Queries invalidated");
        toast.success("Transação atualizada com sucesso");
        onOpenChange(false);
        setError(null);
      },
      onError: (err) => {
        console.error("[EditTransactionDialog] Mutation error:", err);
        console.error("[EditTransactionDialog] Error details:", {
          message: err.message,
          response: err.response,
          status: err.status,
          error: err,
        });
        const message = err.message || "Erro ao atualizar transação";
        setError(message);
        toast.error(message);
      },
      onMutate: (variables) => {
        console.log(
          "[EditTransactionDialog] Mutation started with variables:",
          variables,
        );
      },
    },
  });

  const handleSubmit = (data: TransactionFormValues) => {
    console.log("[EditTransactionDialog] handleSubmit called with data:", data);
    setError(null);

    const mutationData = {
      id: transaction.id,
      data: {
        type: data.type,
        categoryId: data.categoryId,
        amount: data.amount,
        description: data.description,
        date: data.date.toISOString(),
      },
    };

    console.log("[EditTransactionDialog] Mutation data prepared:", mutationData);
    console.log("[EditTransactionDialog] Calling updateMutation.mutate...");

    updateMutation.mutate(mutationData);

    console.log("[EditTransactionDialog] updateMutation state:", {
      isPending: updateMutation.isPending,
      isError: updateMutation.isError,
      error: updateMutation.error,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogDescription>Altere os dados da transação</DialogDescription>
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
