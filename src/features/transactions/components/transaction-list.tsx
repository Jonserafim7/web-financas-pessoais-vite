import { useTransactionsControllerFindAll } from "@/lib/generated/api/transactions/transactions";
import { useSession } from "@/features/auth/hooks/use-session";
import { TransactionItem } from "./transaction-item";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircleIcon, InboxIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TransactionListProps {
	dateFrom?: string;
	dateTo?: string;
}

export function TransactionList({ dateFrom, dateTo }: TransactionListProps) {
  const { data: session } = useSession();
  const {
    data: transactions,
    isPending,
    isError,
  } = useTransactionsControllerFindAll(
    dateFrom || dateTo ? { dateFrom, dateTo } : undefined,
    {
      query: {
        enabled: !!session?.user?.id,
      },
    },
  );

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar as transações. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (!transactions?.results || transactions?.results.length === 0) {
    return (
      <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <InboxIcon className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="text-foreground mb-2 text-lg font-semibold">
          Nenhuma transação encontrada
        </h3>
        <p className="text-muted-foreground text-sm">
          Comece criando sua primeira transação.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.results.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
        />
      ))}
    </div>
  );
}
