import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/employee-management-frontend/",
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["dragobuzhda.com", "www.dragobuzhda.com", "localhost"],
    port: 5300,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
