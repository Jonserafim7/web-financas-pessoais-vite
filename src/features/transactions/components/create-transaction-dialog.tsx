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
  useTransactionsControllerCreate,
  getTransactionsControllerFindAllQueryKey,
} from "@/lib/generated/api/transactions/transactions";
import { getReportsControllerGetSummaryQueryKey } from "@/lib/generated/api/reports/reports";

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTransactionDialog({
  open,
  onOpenChange,
}: CreateTransactionDialogProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const createMutation = useTransactionsControllerCreate({
    mutation: {
      onSuccess: async () => {
        // Invalidate queries in parallel
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getTransactionsControllerFindAllQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: getReportsControllerGetSummaryQueryKey(),
          }),
        ]);
        // Show success toast
        toast.success("Transação criada com sucesso");
        // Close dialog
        onOpenChange(false);
        // Clear error
        setError(null);
      },
      onError: (err) => {
        console.error("[CreateTransactionDialog] Mutation error:", err);
        console.error("[CreateTransactionDialog] Error details:", {
          message: err.message,
          response: err.response,
          status: err.status,
          error: err,
        });
        const message = err.message || "Erro ao criar transação";
        setError(message);
        toast.error(message);
      },
    },
  });

  const handleSubmit = (data: TransactionFormValues) => {
    setError(null);

    const mutationData = {
      type: data.type,
      categoryId: data.categoryId,
      amount: data.amount,
      description: data.description,
      date: data.date.toISOString(),
    };

    createMutation.mutate({
      data: mutationData,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Adicione uma nova receita ou despesa
          </DialogDescription>
        </DialogHeader>

        <TransactionForm
          onSubmit={handleSubmit}
          isPending={createMutation.isPending}
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
            disabled={createMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant={"secondary"}
            type="submit"
            form="transaction-form"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? <Spinner /> : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
