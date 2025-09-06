import express from "express";
import cors from "cors";
import path from "path";
import { registerRoutes } from "./routes";
import { visitorTracker } from "./visitor-tracker";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build
const distPath = path.join(__dirname, "../../dist");
app.use(express.static(distPath));

// Visitor tracking middleware (before logging)
app.use(visitorTracker.middleware);

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

async function startServer() {
  try {
    // Register API routes
    const server = await registerRoutes(app);

    // Health check endpoint for Docker/Dockploy
    app.get("/api/health", (req, res) => {
      res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      });
    });

    // Catch all handler: send back React's index.html file for any non-API routes
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });

    // Start server
    server.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🎉 TaalimFlow is running successfully!`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend & Backend available at: http://0.0.0.0:${PORT}`);
      console.log(`📡 API endpoints available at: http://0.0.0.0:${PORT}/api`);
      console.log(
        `🔗 Database connected: ${process.env.DATABASE_URL ? "✅" : "❌"}`
      );
      console.log(
        `📱 Telegram configured: ${
          process.env.TELEGRAM_BOT_TOKEN ? "✅" : "❌"
        }`
      );
      console.log(`💚 Health check: http://0.0.0.0:${PORT}/api/health`);
      console.log(`📦 Deployed with Nixpacks`);
      console.log(`\n🔗 Access TaalimFlow at: http://0.0.0.0:${PORT}`);
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down server...");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
