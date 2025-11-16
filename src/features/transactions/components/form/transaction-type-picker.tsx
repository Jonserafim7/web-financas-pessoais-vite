import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { TransactionResponseDtoType } from "@/lib/generated/models";

interface TransactionTypePickerProps {
  value: TransactionResponseDtoType;
  onChange: (value: TransactionResponseDtoType) => void;
  disabled?: boolean;
}

export function TransactionTypePicker({
  value,
  onChange,
  disabled,
}: TransactionTypePickerProps) {
  return (
    <div className="flex gap-2">
      <Toggle
        pressed={value === TransactionResponseDtoType.INCOME}
        onPressedChange={(pressed) => {
          if (pressed) {
            onChange(TransactionResponseDtoType.INCOME);
          }
        }}
        disabled={disabled}
        variant="outline"
        className="data-[state=on]:border-success data-[state=on]:bg-success/10 data-[state=on]:text-success flex-1"
        aria-label="Receita"
      >
        <TrendingUpIcon />
        Receita
      </Toggle>
      <Toggle
        pressed={value === TransactionResponseDtoType.EXPENSE}
        onPressedChange={(pressed) => {
          if (pressed) {
            onChange(TransactionResponseDtoType.EXPENSE);
          }
        }}
        disabled={disabled}
        variant="outline"
        className="data-[state=on]:border-destructive data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive flex-1"
        aria-label="Despesa"
      >
        <TrendingDownIcon />
        Despesa
      </Toggle>
    </div>
  );
}
