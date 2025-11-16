import { useState } from "react";
import { useTransactionsControllerFindAll } from "@/lib/generated/api/transactions/transactions";
import { useSession } from "@/features/auth/hooks/use-session";
import { TransactionItem } from "./transaction-item";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircleIcon, InboxIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TransactionsControllerFindAllType } from "@/lib/generated/models";

interface TransactionListProps {
  dateFrom?: string;
  dateTo?: string;
}

export function TransactionList({ dateFrom, dateTo }: TransactionListProps) {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<
    "all" | TransactionsControllerFindAllType
  >("all");
  const pageSize = 10;

  const { data: session } = useSession();

  const apiTypeFilter =
    typeFilter === "all"
      ? undefined
      : (typeFilter as TransactionsControllerFindAllType);

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
          limit: pageSize,
          offset: (page - 1) * pageSize,
        }
      : {
          type: apiTypeFilter,
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

  const total = transactions.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  return (
    <Tabs
      value={typeFilter}
      onValueChange={(value) => {
        const typedValue = value as "all" | TransactionsControllerFindAllType;
        setTypeFilter(typedValue);
        setPage(1);
      }}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="INCOME">Receitas</TabsTrigger>
        <TabsTrigger value="EXPENSE">Despesas</TabsTrigger>
      </TabsList>

      <div className="space-y-4">
        <div className="space-y-3">
          {transactions.results?.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(page - 1);
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNumber}
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Tabs>
  );
}
