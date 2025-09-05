import express from "express";
import cors from "cors";
import path from "path";
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

// Serve static files from the React app build
const distPath = path.join(__dirname, "../../dist");
app.use(express.static(distPath));

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

async function startServer() {
  try {
    // Register API routes
    const server = await registerRoutes(app);
    
    // Catch all handler: send back React's index.html file for any non-API routes
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🎉 TaalimFlow is running successfully!`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend & Backend available at: http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at: http://localhost:${PORT}/api`);
      console.log(`🔗 Database connected: ${process.env.DATABASE_URL ? '✅' : '❌'}`);
      console.log(`📱 Telegram configured: ${process.env.TELEGRAM_BOT_TOKEN ? '✅' : '❌'}`);
      console.log(`\n🔗 Click here to access TaalimFlow: http://localhost:${PORT}`);
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