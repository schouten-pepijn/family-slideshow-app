import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
proxy: {
  "/api": {
    target: "http://host.docker.internal:8000",
    changeOrigin: true,
  },
},

  },
});
