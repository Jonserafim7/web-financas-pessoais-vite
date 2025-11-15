import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/transacoes")({
  component: Transasctions,
});

function Transasctions() {
  return <div className="p-2">Hello from Transasctions!</div>;
}
