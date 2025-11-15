import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import {
  type TransactionResponseDto,
  TransactionResponseDtoType,
} from "@/lib/generated/models";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TransactionTypePicker } from "./transaction-type-picker";
import { TransactionCategoryPicker } from "./transaction-category-picker";
import { TransactionDatePicker } from "./transaction-date-picker";

const formSchema = z.object({
  type: z.enum([
    TransactionResponseDtoType.INCOME,
    TransactionResponseDtoType.EXPENSE,
  ]),
  categoryId: z.string().min(1, { message: "Selecione uma categoria" }),
  amount: z
    .number({ message: "Valor inválido" })
    .min(0.01, { message: "Valor deve ser maior que zero" })
    .max(999999.99, { message: "Valor máximo é 999.999,99" })
    .refine(
      (val) => {
        const decimals = val.toString().split(".")[1];
        return !decimals || decimals.length <= 2;
      },
      { message: "Máximo de 2 casas decimais" },
    ),
  description: z.string().optional(),
  date: z.date({ message: "Data inválida" }),
});

export type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  transaction?: TransactionResponseDto;
  onSubmit: (data: TransactionFormValues) => void;
  isPending?: boolean;
}

export function TransactionForm({
  transaction,
  onSubmit,
  isPending,
}: TransactionFormProps) {
  const form = useForm({
    defaultValues: {
      type: transaction?.type ?? TransactionResponseDtoType.EXPENSE,
      categoryId: transaction?.categoryId ?? "",
      amount: transaction?.amount ? Number(transaction.amount) : 0,
      description: transaction?.description ?? undefined,
      date: transaction?.date ? new Date(transaction.date) : new Date(),
    },
    validators: {
      onBlur: formSchema.parse,
    },
    onSubmit: async (values) => {
      onSubmit(values.value);
    },
  });

  return (
    <form
      id="transaction-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="type"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                <TransactionTypePicker
                  value={field.state.value}
                  onChange={(value) => {
                    field.handleChange(value);
                    // Reset category when type changes
                    form.setFieldValue("categoryId", "");
                  }}
                  disabled={isPending}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="categoryId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Categoria</FieldLabel>
                <TransactionCategoryPicker
                  value={field.state.value}
                  onChange={field.handleChange}
                  type={form.state.values.type}
                  disabled={isPending}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="amount"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Valor</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.handleChange(value === "" ? 0 : Number(value));
                  }}
                  aria-invalid={isInvalid}
                  placeholder="0,00"
                  disabled={isPending}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Descrição (opcional)</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Adicione uma descrição..."
                  rows={3}
                  disabled={isPending}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="date"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Data</FieldLabel>
                <TransactionDatePicker
                  value={field.state.value}
                  onChange={field.handleChange}
                  disabled={isPending}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
    </form>
  );
}
