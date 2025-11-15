import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-svh flex-col items-center justify-center relative">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <Button>Click me</Button>
      </div>
    </ThemeProvider>
  )
}

export default App