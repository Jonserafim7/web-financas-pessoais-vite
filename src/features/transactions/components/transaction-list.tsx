import { useTransactionsControllerFindAll } from "@/lib/generated/api/transactions/transactions";
import { useSession } from "@/features/auth/hooks/use-session";
import { TransactionItem } from "./transaction-item";
import { Spinner } from "@/components/ui/spinner";

export function TransactionList() {
  const { data: session } = useSession();
  const {
    data: transactions,
    isPending,
    isError,
  } = useTransactionsControllerFindAll(undefined, {
    query: {
      enabled: !!session?.user?.id,
    },
  });
  if (isPending) return <Spinner />;
  if (isError) return <div>Erro ao carregar transações</div>;
  if (!transactions?.results || transactions?.results.length === 0)
    return <div>Nenhuma transação encontrada</div>;

  return (
    <div>
      {transactions?.results?.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
        />
      ))}
    </div>
  );
}
