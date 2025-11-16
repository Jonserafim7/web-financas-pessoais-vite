import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { CircleDollarSign, LogOutIcon } from "lucide-react";

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const { mutate: signOut } = useSignOut();

  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="text-primary size-7" />
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => {
              signOut();
            }}
          >
            <LogOutIcon />
          </Button>
        </div>
      </div>
    </header>
  );
}
