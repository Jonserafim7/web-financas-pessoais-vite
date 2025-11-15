import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    // host: Permite que o servidor aceite conexões de qualquer IP
    // Necessário para funcionar dentro do container Docker

    port: 5173,
    // port: Porta padrão do Vite (explicitamente definida)

    proxy: {
      "/api": {
        target: "http://api:3000",
        // target: Redireciona requisições /api para o container do backend
        // "api" é o nome do serviço no docker-compose.yml

        changeOrigin: true,
        // changeOrigin: Altera o header "Origin" para o target
        // Necessário para evitar problemas de CORS
      },
    },
  },
})