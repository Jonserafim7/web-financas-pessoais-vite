import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import {
  useTransactionsControllerRemove,
  getTransactionsControllerFindAllQueryKey,
} from "@/lib/generated/api/transactions/transactions";
import type { TransactionResponseDto } from "@/lib/generated/models";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface DeleteTransactionAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionResponseDto;
  onDeleteSuccess?: () => void;
}

export function DeleteTransactionAlertDialog({
  open,
  onOpenChange,
  transaction,
  onDeleteSuccess,
}: DeleteTransactionAlertDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useTransactionsControllerRemove({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getTransactionsControllerFindAllQueryKey(),
        });
        toast.success("Transação excluída com sucesso");
        onOpenChange(false);
        onDeleteSuccess?.();
      },
      onError: (err) => {
        console.error("[DeleteTransactionAlertDialog] Mutation error:", err);
        const message = err.message || "Erro ao excluir transação";
        toast.error(message);
      },
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({ id: transaction.id });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. A transação será permanentemente
            excluída.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {deleteMutation.isPending ? (
              <Spinner />
            ) : (
              <>
                <Trash2 />
                Excluir
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
