import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoriesControllerFindAll } from "@/lib/generated/api/categories/categories";
import type { TransactionResponseDtoType } from "@/lib/generated/models";
import { TagIcon } from "lucide-react";

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
        {(Array.isArray(categories) ? categories : []).map((category) => (
          <SelectItem
            key={category.id}
            value={category.id}
          >
            <div className="flex items-center gap-2">
              <TagIcon className="text-muted-foreground size-3" />
              <span>{category.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
