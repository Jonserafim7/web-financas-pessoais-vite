# ==============================================================================
# DOCKERFILE SIMPLIFICADO - WEB FINANÇAS PESSOAIS
# Imagem single-stage para facilitar aprendizado e debugging
# ==============================================================================

FROM node:20-alpine
# Imagem base: Node.js 20 na versão Alpine (leve, ~70MB)

WORKDIR /app
# Define /app como diretório de trabalho dentro do container

# Copiar arquivos de dependências
COPY package*.json ./
# Copia package.json e package-lock.json

# Instalar todas as dependências
RUN npm ci
# npm ci: Instala dependências exatamente como em package-lock.json
# Inclui devDependencies (necessárias para rodar o servidor Vite)

# Copiar código fonte
COPY . .
# Copia todo o código fonte (src/, index.html, vite.config.ts, etc.)
# .dockerignore define o que será ignorado (node_modules, .git, etc.)

# Expor porta do servidor Vite
EXPOSE 5173
# Documenta que o container escuta na porta 5173 (porta padrão do Vite)

# Comando padrão (pode ser sobrescrito pelo docker-compose.yml)
CMD ["npm", "run", "dev"]
# Inicia o servidor de desenvolvimento do Vite
# Hot-reload funciona automaticamente quando arquivos são alterados

