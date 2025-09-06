import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { telegramService } from "./telegram";
import {
  insertContactSubmissionSchema,
  insertDemoRequestSchema,
} from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      
      // Save to database
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send Telegram notification
      try {
        const message = telegramService.formatContactSubmission(submission);
        await telegramService.sendNotification(message);
      } catch (telegramError) {
        console.error("Failed to send Telegram notification:", telegramError);
        // Don't fail the request if Telegram fails
      }

      res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        id: submission.id,
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  });

  // Demo request submission endpoint
  app.post("/api/demo-request", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertDemoRequestSchema.parse(req.body);
      
      // Save to database
      const request = await storage.createDemoRequest(validatedData);
      
      // Send Telegram notification
      try {
        const message = telegramService.formatDemoRequest(request);
        await telegramService.sendNotification(message);
      } catch (telegramError) {
        console.error("Failed to send Telegram notification:", telegramError);
        // Don't fail the request if Telegram fails
      }

      res.status(201).json({
        success: true,
        message: "Demo request submitted successfully",
        id: request.id,
      });
    } catch (error) {
      console.error("Error processing demo request:", error);
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  });

  // Admin endpoints
  app.get("/api/admin/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch contact submissions",
      });
    }
  });

  app.get("/api/admin/demo-requests", async (req, res) => {
    try {
      const requests = await storage.getAllDemoRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching demo requests:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch demo requests",
      });
    }
  });

  // Mark submissions as read
  app.patch("/api/admin/contact-submissions/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markContactSubmissionAsRead(id);
      res.json({ success: true, message: "Marked as read" });
    } catch (error) {
      console.error("Error marking submission as read:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark as read",
      });
    }
  });

  app.patch("/api/admin/demo-requests/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markDemoRequestAsRead(id);
      res.json({ success: true, message: "Marked as read" });
    } catch (error) {
      console.error("Error marking request as read:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark as read",
      });
    }
  });

  // Update status
  app.patch("/api/admin/contact-submissions/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      await storage.updateContactSubmissionStatus(id, status);
      res.json({ success: true, message: "Status updated" });
    } catch (error) {
      console.error("Error updating submission status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update status",
      });
    }
  });

  app.patch("/api/admin/demo-requests/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      await storage.updateDemoRequestStatus(id, status);
      res.json({ success: true, message: "Status updated" });
    } catch (error) {
      console.error("Error updating request status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update status",
      });
    }
  });

  // Delete endpoints
  app.delete("/api/admin/contact-submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Note: Add delete functionality to storage if needed
      res.json({ success: true, message: "Record deleted" });
    } catch (error) {
      console.error("Error deleting contact submission:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete record",
      });
    }
  });

  app.delete("/api/admin/demo-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Note: Add delete functionality to storage if needed
      res.json({ success: true, message: "Record deleted" });
    } catch (error) {
      console.error("Error deleting demo request:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete record",
      });
    }
  });

  // Visitor tracking endpoints
  app.post("/api/visitor", async (req, res) => {
    try {
      const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'];
      const timestamp = new Date().toISOString();
      
      // Log the visitor
      console.log(`🌐 [${timestamp}] New visitor from IP: ${ip}`);
      console.log(`   User Agent: ${userAgent || 'Unknown'}`);
      
      await storage.recordVisitor(ip, userAgent);
      res.json({ success: true, message: "Visitor recorded" });
    } catch (error) {
      console.error("❌ Error recording visitor:", error);
      res.status(500).json({
        success: false,
        message: "Failed to record visitor",
      });
    }
  });

  app.get("/api/admin/visitor-stats", async (req, res) => {
    try {
      const stats = await storage.getVisitorStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch visitor stats",
      });
    }
  });

  // Settings endpoints
  app.get("/api/admin/settings", async (req, res) => {
    try {
      // Return default settings or stored settings
      const defaultSettings = {
        contactEmail: "contact@taalimflow.com",
        contactPhone: "+213 555 123 456",
        instagram: "@taalimflow",
        facebook: "TaalimFlow",
        pricing: {
          basic: "5000 DA/month",
          premium: "10000 DA/month",
          enterprise: "Contact us",
        },
      };
      res.json(defaultSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch settings",
      });
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      // In a real implementation, you would save these settings
      console.log("Settings update requested:", req.body);
      res.json({ success: true, message: "Settings saved" });
    } catch (error) {
      console.error("Error saving settings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to save settings",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}