import { BugIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";

export function ErrorButton() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="destructive"
          onClick={() => {
            throw new Error("This is your first error!");
          }}
        >
          <BugIcon />
          Testar erro
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm">
          Este botão dispara um erro de teste que será enviado ao Sentry para
          verificar se a observabilidade do projeto está configurada corretamente.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}