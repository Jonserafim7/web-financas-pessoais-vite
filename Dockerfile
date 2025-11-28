# ==============================================================================
# DOCKERFILE DE PRODUÇÃO - WEB FINANÇAS PESSOAIS
# Multi-stage build: Build → Serve
# ==============================================================================

# ------------------------------------------------------------------------------
# STAGE 1: BUILD
# Compila TypeScript e gera assets estáticos otimizados
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
# Copia package.json e package-lock.json

# Instalar TODAS as dependências (incluindo devDeps para build)
RUN npm ci
# npm ci: Instala dependências exatamente como em package-lock.json
# devDependencies são necessárias para TypeScript, Vite, etc.

# Copiar código fonte
COPY . .
# Copia todo o código fonte (src/, index.html, vite.config.ts, etc.)
# .dockerignore define o que será ignorado (node_modules, .git, etc.)

# Build de produção (TypeScript + Vite)
RUN npm run build
# Executa: tsc -b && vite build
# Gera arquivos otimizados em /app/dist

# ------------------------------------------------------------------------------
# STAGE 2: SERVE
# Servidor web leve para arquivos estáticos
# ------------------------------------------------------------------------------
FROM nginx:alpine AS production

# Copiar apenas os arquivos buildados (não node_modules, não src)
COPY --from=builder /app/dist /usr/share/nginx/html
# Copia APENAS /app/dist do stage anterior
# Resultado: imagem final ~30MB (vs ~500MB+ com Node.js)

# Configuração customizada do Nginx (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Sobrescreve a config padrão do Nginx
# Necessário para suportar roteamento de SPA (React Router)

# Porta padrão do Nginx
EXPOSE 80
# Documenta que o container escuta na porta 80

# Nginx roda em foreground
CMD ["nginx", "-g", "daemon off;"]
# daemon off: Mantém o Nginx em foreground (necessário para Docker)
