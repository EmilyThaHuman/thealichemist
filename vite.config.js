import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "components": path.resolve(__dirname, "src/components"),
      "lib": path.resolve(__dirname, "src/lib"),
      "pages": path.resolve(__dirname, "src/pages"),
      "layouts": path.resolve(__dirname, "src/layouts"),
      "routes": path.resolve(__dirname, "src/routes")
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
