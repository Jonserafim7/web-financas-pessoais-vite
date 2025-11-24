import { useState } from "react";
import { useTransactionsControllerFindAll } from "@/lib/generated/api/transactions/transactions";
import { useSession } from "@/features/auth/hooks/use-session";
import { TransactionItem } from "./transaction-item";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircleIcon, InboxIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCategoriesControllerFindAll } from "@/lib/generated/api/categories/categories";
import type { TransactionsControllerFindAllType } from "@/lib/generated/models";
import { TransactionTypeFilter } from "./transaction-type-filter";
import { TransactionCategoryFilter } from "./transaction-category-filter";
import { TransactionPagination } from "./transaction-pagination";

interface TransactionListProps {
  dateFrom?: string;
  dateTo?: string;
}

export function TransactionList({ dateFrom, dateTo }: TransactionListProps) {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<
    "all" | TransactionsControllerFindAllType
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const pageSize = 10;

  const { data: session } = useSession();

  const { data: categories, isLoading: isLoadingCategories } =
    useCategoriesControllerFindAll(undefined, {
      query: {
        enabled: !!session?.user?.id,
      },
    });

  const apiTypeFilter =
    typeFilter === "all"
      ? undefined
      : (typeFilter as TransactionsControllerFindAllType);
  const apiCategoryFilter = categoryFilter === "all" ? undefined : categoryFilter;

  const {
    data: transactions,
    isPending,
    isError,
  } = useTransactionsControllerFindAll(
    dateFrom || dateTo
      ? {
          dateFrom,
          dateTo,
          type: apiTypeFilter,
          categoryId: apiCategoryFilter,
          limit: pageSize,
          offset: (page - 1) * pageSize,
        }
      : {
          type: apiTypeFilter,
          categoryId: apiCategoryFilter,
          limit: pageSize,
          offset: (page - 1) * pageSize,
        },
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

  const hasTransactions = transactions?.results && transactions.results.length > 0;
  const total = transactions?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  return (
    <div className="space-y-4">
      <TransactionTypeFilter
        value={typeFilter}
        onChange={(value) => {
          setTypeFilter(value);
          setPage(1);
        }}
      />

      <TransactionCategoryFilter
        value={categoryFilter}
        onChange={(value) => {
          setCategoryFilter(value);
          setPage(1);
        }}
        categories={categories}
        isLoading={isLoadingCategories}
      />

      {hasTransactions ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {transactions.results?.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>

          <TransactionPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <InboxIcon className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Nenhuma transação encontrada
          </h3>
          <p className="text-muted-foreground text-sm">
            Comece criando sua primeira transação.
          </p>
        </div>
      )}
    </div>
  );
}
