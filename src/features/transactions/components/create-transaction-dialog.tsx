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
import { useTransactionsControllerCreate } from "@/lib/generated/api/transactions/transactions";

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
        // Invalidate transactions list query
        await queryClient.invalidateQueries({
          queryKey: ["transactionsControllerFindAll"],
        });
        // Show success toast
        toast.success("Transação criada com sucesso");
        // Close dialog
        onOpenChange(false);
        // Clear error
        setError(null);
      },
      onError: (err) => {
        const message = err.message || "Erro ao criar transação";
        setError(message);
        toast.error(message);
      },
    },
  });

  const handleSubmit = (data: TransactionFormValues) => {
    setError(null);
    createMutation.mutate({
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
