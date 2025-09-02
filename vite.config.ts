import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: "::",
    port: 5173,
    allowedHosts: ["0.0.0.0"],
    proxy: {
      "/api": {
        target: "https://taalimflow-production.up.railway.app",
        changeOrigin: true,
        secure: true, // Changed to true since you're using HTTPS
        rewrite: (path) => path, // Optional: explicitly define path rewriting
        configure: (proxy, options) => {
          // Optional: Add logging for debugging
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Proxying request:", req.method, req.url);
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
