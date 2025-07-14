import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8000,
    proxy: {
      "/send-email": "http://localhost:3000",
      "/verify-email": "http://localhost:3000",
      "/generate-email-content": "http://localhost:3000",
      "/email-templates": "http://localhost:3000",
      "/email-options": "http://localhost:3000",
      "/api/message": "http://localhost:3000"
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
