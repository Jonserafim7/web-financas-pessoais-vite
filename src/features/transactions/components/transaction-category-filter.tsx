import { TagIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryResponseDto } from "@/lib/generated/models";

interface TransactionCategoryFilterProps {
  value: string | "all";
  onChange: (value: string | "all") => void;
  categories: CategoryResponseDto[] | undefined;
  isLoading: boolean;
}

export function TransactionCategoryFilter({
  value,
  onChange,
  categories,
  isLoading,
}: TransactionCategoryFilterProps) {
  const incomeCategories = Array.isArray(categories)
    ? categories.filter((cat) => cat.type === "INCOME")
    : [];
  const expenseCategories = Array.isArray(categories)
    ? categories.filter((cat) => cat.type === "EXPENSE")
    : [];

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        onChange(value as "all" | string);
      }}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full sm:w-64">
        <SelectValue placeholder="Todas as categorias" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas as categorias</SelectItem>

        {incomeCategories.length > 0 && (
          <SelectGroup>
            <SelectLabel>Receitas</SelectLabel>
            {incomeCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <TagIcon className="size-3.5" />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        {expenseCategories.length > 0 && (
          <SelectGroup>
            <SelectLabel>Despesas</SelectLabel>
            {expenseCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <TagIcon className="size-3.5" />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}

