// validations
import { z } from "zod";
// hooks
import { useForm } from "@tanstack/react-form";
import { useSignUp } from "../hooks/use-sign-up";
// router
import { Link } from "@tanstack/react-router";
// components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
      .max(128, { message: "Nome deve ter no máximo 128 caracteres" }),
    email: z.email({ message: "Email inválido" }),
    password: z
      .string()
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
      .max(64, { message: "Senha deve ter no máximo 64 caracteres" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const { mutate: signUp, isPending, error } = useSignUp();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onBlur: formSchema,
    },
    onSubmit: (values) => {
      const { name, email, password } = values.value;
      signUp({ name, email, password });
    },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Cadastre-se para começar a usar</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="sign-up-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Seu nome"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Email"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Senha"
                      type="password"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Confirmar senha</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Confirme sua senha"
                      type="password"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
        {error && (
          <Alert
            variant="destructive"
            className="mt-4"
          >
            <AlertCircleIcon />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-6">
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="sign-up-form"
            className="w-full"
            disabled={isPending || form.state.isSubmitting}
          >
            {isPending || form.state.isSubmitting ? <Spinner /> : "Criar conta"}
          </Button>
        </Field>
        <p className="text-muted-foreground text-center text-sm">
          Já tem conta?{" "}
          <Link
            to="/sign-in"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Faça login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
