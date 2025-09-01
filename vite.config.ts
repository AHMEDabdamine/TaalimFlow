import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: "::",
    port: 5173,
    allowedHosts: [
      "cb075521-5844-460d-83fb-e3d5456a4378-00-2apqp0r4l2jya.kirk.replit.dev",
    ],
    proxy: {
      "/api": {
        target: "http://localhost:3001",
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
