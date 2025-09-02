import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: "::",
    port: 5173,
    allowedHosts: [
      "438a3801-c1eb-4e3f-8215-ae7b4deb2892-00-12eutaxppinw.picard.replit.dev",
    ],
    proxy: {
      "/api": {
        target: "https://taalim-flow.vercel.app/",
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
