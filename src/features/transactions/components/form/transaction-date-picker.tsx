import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TransactionDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

export function TransactionDatePicker({
  value,
  onChange,
  disabled,
}: TransactionDatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon />
          {value
            ? format(value, "dd/MM/yyyy", { locale: ptBR })
            : "Selecione a data"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            if (date) {
              onChange(date);
              setOpen(false);
            }
          }}
          captionLayout="dropdown"
          fromYear={2000}
          toYear={new Date().getFullYear() + 1}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
