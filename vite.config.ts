import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: "::",
    port: 5173,
    allowedHosts: ["0.0.0.0", "localhost"],
    proxy: {
      "/api": {
        target: "http://localhost:3001/api",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
