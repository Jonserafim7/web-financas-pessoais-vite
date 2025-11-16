import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TransactionsControllerFindAllType } from "@/lib/generated/models";

interface TransactionTypeFilterProps {
  value: "all" | TransactionsControllerFindAllType;
  onChange: (value: "all" | TransactionsControllerFindAllType) => void;
}

export function TransactionTypeFilter({
  value,
  onChange,
}: TransactionTypeFilterProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(value) => {
        const typedValue = value as "all" | TransactionsControllerFindAllType;
        onChange(typedValue);
      }}
      className="space-y-0"
    >
      <TabsList>
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="INCOME">
          <TrendingUpIcon className="text-success" /> Receitas
        </TabsTrigger>
        <TabsTrigger value="EXPENSE">
          <TrendingDownIcon className="text-destructive" /> Despesas
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

