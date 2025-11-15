import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoriesControllerFindAll } from "@/lib/generated/api/categories/categories";
import type { TransactionResponseDtoType } from "@/lib/generated/models";

interface TransactionCategoryPickerProps {
  value: string;
  onChange: (value: string) => void;
  type: TransactionResponseDtoType;
  disabled?: boolean;
}

export function TransactionCategoryPicker({
  value,
  onChange,
  type,
  disabled,
}: TransactionCategoryPickerProps) {
  const { data: categories, isLoading } = useCategoriesControllerFindAll({
    type,
  });

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione uma categoria" />
      </SelectTrigger>
      <SelectContent>
        {categories?.map((category) => (
          <SelectItem
            key={category.id}
            value={category.id}
          >
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{
                  backgroundColor: category.color ?? "hsl(var(--primary))",
                }}
              />
              <span>{category.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
