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
import { AlertCircleIcon, Trash2 } from "lucide-react";
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
import { DeleteTransactionAlertDialog } from "./delete-transaction-alert-dialog";

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
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateMutation = useTransactionsControllerUpdate({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getTransactionsControllerFindAllQueryKey(),
        });
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
    },
  });

  const handleSubmit = (data: TransactionFormValues) => {
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

    updateMutation.mutate(mutationData);
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

        <DeleteTransactionAlertDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          transaction={transaction}
          onDeleteSuccess={() => onOpenChange(false)}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2"
          >
            <Trash2 />
            Excluir
          </Button>
          <Button
            type="submit"
            variant={"secondary"}
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
