import { defineConfig } from "orval";

/**
 * Orval configuration for generating TypeScript types and React Query hooks
 * from the NestJS API OpenAPI specification
 */
export default defineConfig({
  "api-financas-pessoais": {
    input: {
      target: "http://localhost:3000/api-json",
      validation: false,
    },
    output: {
      mode: "tags-split",
      target: "src/lib/generated/api",
      schemas: "src/lib/generated/models",
      client: "react-query",
      httpClient: "axios",
      mock: false,
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: "./src/lib/api-client.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useInfinite: false,
          signal: true,
          version: 5,
        },
      },
    },
  },
});
