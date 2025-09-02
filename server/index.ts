import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

async function startServer() {
  try {
    // Register routes
    const server = await registerRoutes(app);
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`🔗 Database connected: ${process.env.DATABASE_URL ? '✅' : '❌'}`);
      console.log(`📱 Telegram configured: ${process.env.TELEGRAM_BOT_TOKEN ? '✅' : '❌'}`);
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