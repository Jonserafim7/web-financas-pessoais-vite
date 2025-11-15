import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import {
  type TransactionResponseDto,
  TransactionResponseDtoType,
} from "@/lib/generated/models";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.coerce.number().min(0),
  date: z.date(),
  type: z.enum([
    TransactionResponseDtoType.INCOME,
    TransactionResponseDtoType.EXPENSE,
  ]),
  categoryId: z.string().min(1),
});

type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  transaction?: TransactionResponseDto;
  onSubmit: (data: TransactionFormValues) => void;
}
export function TransactionForm({ transaction, onSubmit }: TransactionFormProps) {
  const form = useForm({
    defaultValues: {
      description: transaction?.description ?? "",
      amount: transaction?.amount ?? 0,
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      type: transaction?.type ?? TransactionResponseDtoType.INCOME,
      categoryId: transaction?.categoryId ?? "",
    },
    validators: {
      onBlur: formSchema.parse,
    },
    onSubmit: (values) => {
      onSubmit(values.value);
    },
  });
  return <div>Transaction Form</div>;
}
