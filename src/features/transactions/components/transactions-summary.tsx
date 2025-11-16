import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useReportsControllerGetSummary } from "@/lib/generated/api/reports/reports";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  ChevronsDown,
  ChevronsUp,
} from "lucide-react";

interface TransactionsSummaryProps {
	dateFrom?: string;
	dateTo?: string;
}

export function TransactionsSummary({ dateFrom, dateTo }: TransactionsSummaryProps) {
  const { data: summary } = useReportsControllerGetSummary(
    dateFrom || dateTo ? { dateFrom, dateTo } : undefined
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="text-muted-foreground size-3.5" />
            <CardDescription className="flex items-center gap-2">
              Saldo
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {summary?.balance && Number(summary?.balance) > 0 ? (
              <ChevronsUp className="text-success" />
            ) : summary?.balance && Number(summary?.balance) < 0 ? (
              <ChevronsDown className="text-destructive" />
            ) : null}
            <span className="text-2xl font-bold">
              {formatCurrency(summary?.balance ?? 0)}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-success size-3.5" />
            <CardDescription className="flex items-center gap-2">
              Receitas
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <span className="text-success text-2xl font-bold">
            + {formatCurrency(summary?.totalIncome)}
          </span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingDown className="text-destructive size-3.5" />
            <CardDescription className="flex items-center gap-2">
              Despesas
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <span className="text-destructive text-2xl font-bold">
            - {formatCurrency(summary?.totalExpense)}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
