import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import {
  format,
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DateRangeValue = {
  dateFrom?: string;
  dateTo?: string;
};

type Preset = "today" | "week" | "month" | "year" | "custom";

interface DateRangePickerProps {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<Preset | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined,
  );

  // Sync internal range with external value and set default (this month) when empty
  React.useEffect(() => {
    if (value?.dateFrom && value?.dateTo) {
      setDateRange({
        from: new Date(value.dateFrom),
        to: new Date(value.dateTo),
      });
      return;
    }

    // No value provided: default to current month
    const from = startOfMonth(new Date());
    const to = endOfMonth(new Date());

    setDateRange({ from, to });
    setSelectedPreset("month");

    onChange?.({
      dateFrom: from.toISOString(),
      dateTo: to.toISOString(),
    });
  }, [value, onChange]);

  const applyPreset = (preset: Preset) => {
    let from: Date;
    let to: Date;

    switch (preset) {
      case "today":
        from = startOfToday();
        to = endOfToday();
        break;
      case "week":
        from = startOfWeek(new Date(), { weekStartsOn: 1 });
        to = endOfWeek(new Date(), { weekStartsOn: 1 });
        break;
      case "month":
        from = startOfMonth(new Date());
        to = endOfMonth(new Date());
        break;
      case "year":
        from = startOfYear(new Date());
        to = endOfYear(new Date());
        break;
      default:
        return;
    }

    const newValue: DateRangeValue = {
      dateFrom: from.toISOString(),
      dateTo: to.toISOString(),
    };

    setDateRange({ from, to });
    setSelectedPreset(preset);
    onChange?.(newValue);
    setOpen(false);
  };

  const handleCustomRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);

    if (range?.from && range?.to) {
      const newValue: DateRangeValue = {
        dateFrom: range.from.toISOString(),
        dateTo: range.to.toISOString(),
      };
      setSelectedPreset("custom");
      onChange?.(newValue);
    }
  };

  const getDisplayText = () => {
    if (!value?.dateFrom || !value?.dateTo) {
      return "Selecionar período";
    }

    if (selectedPreset === "today") {
      return "Hoje";
    }
    if (selectedPreset === "week") {
      return "Esta semana";
    }
    if (selectedPreset === "month") {
      return "Este mês";
    }
    if (selectedPreset === "year") {
      return "Este ano";
    }

    // Custom range
    const from = new Date(value.dateFrom);
    const to = new Date(value.dateTo);

    if (from.getTime() === to.getTime()) {
      return format(from, "d 'de' MMMM, yyyy", { locale: ptBR });
    }

    return `${format(from, "d 'de' MMM", { locale: ptBR })} - ${format(to, "d 'de' MMM, yyyy", { locale: ptBR })}`;
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value?.dateFrom && !value?.dateTo && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getDisplayText()}
          <ChevronDownIcon className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-min"
        align="start"
      >
        <div className="flex">
          <div className="bg-card rounded-lg p-2">
            <div className="space-y-0.5">
              <Button
                variant="ghost"
                className="h-8 w-full justify-start px-2 text-left text-sm font-normal"
                onClick={() => applyPreset("today")}
              >
                Hoje
              </Button>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start px-2 text-left text-sm font-normal"
                onClick={() => applyPreset("week")}
              >
                Esta semana
              </Button>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start px-2 text-left text-sm font-normal"
                onClick={() => applyPreset("month")}
              >
                Este mês
              </Button>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start px-2 text-left text-sm font-normal"
                onClick={() => applyPreset("year")}
              >
                Este ano
              </Button>
            </div>
          </div>
          <div className="">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleCustomRangeSelect}
              numberOfMonths={2}
              locale={ptBR}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
