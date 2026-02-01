import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 6080,
    proxy: {
      "/api/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/api/v1": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/api/notifications": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/api/reviews": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/ws": {
        target: "ws://localhost:8000",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
}));
