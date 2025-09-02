"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const storage_1 = require("./storage.js.cjs");
const telegram_1 = require("./telegram.js.cjs");
const schema_1 = require("../shared/schema.js.cjs");
async function registerRoutes(app) {
    // Health check endpoint
    app.get("/api/health", (req, res) => {
        res.json({ status: "OK", timestamp: new Date().toISOString() });
    });
    // Contact form submission endpoint
    app.post("/api/contact", async (req, res) => {
        try {
            // Validate request body
            const validatedData = schema_1.insertContactSubmissionSchema.parse(req.body);
            // Save to database
            const submission = await storage_1.storage.createContactSubmission(validatedData);
            // Send Telegram notification
            try {
                const message = telegram_1.telegramService.formatContactSubmission(submission);
                await telegram_1.telegramService.sendNotification(message);
            }
            catch (telegramError) {
                console.error("Failed to send Telegram notification:", telegramError);
                // Don't fail the request if Telegram fails
            }
            res.status(201).json({
                success: true,
                message: "Contact form submitted successfully",
                id: submission.id,
            });
        }
        catch (error) {
            console.error("Error processing contact form:", error);
            if (error instanceof Error && error.name === "ZodError") {
                res.status(400).json({
                    success: false,
                    message: "Invalid form data",
                    errors: error,
                });
            }
            else {
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
            const validatedData = schema_1.insertDemoRequestSchema.parse(req.body);
            // Save to database
            const request = await storage_1.storage.createDemoRequest(validatedData);
            // Send Telegram notification
            try {
                const message = telegram_1.telegramService.formatDemoRequest(request);
                await telegram_1.telegramService.sendNotification(message);
            }
            catch (telegramError) {
                console.error("Failed to send Telegram notification:", telegramError);
                // Don't fail the request if Telegram fails
            }
            res.status(201).json({
                success: true,
                message: "Demo request submitted successfully",
                id: request.id,
            });
        }
        catch (error) {
            console.error("Error processing demo request:", error);
            if (error instanceof Error && error.name === "ZodError") {
                res.status(400).json({
                    success: false,
                    message: "Invalid form data",
                    errors: error,
                });
            }
            else {
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
            const submissions = await storage_1.storage.getAllContactSubmissions();
            res.json(submissions);
        }
        catch (error) {
            console.error("Error fetching contact submissions:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch contact submissions",
            });
        }
    });
    app.get("/api/admin/demo-requests", async (req, res) => {
        try {
            const requests = await storage_1.storage.getAllDemoRequests();
            res.json(requests);
        }
        catch (error) {
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
            await storage_1.storage.markContactSubmissionAsRead(id);
            res.json({ success: true, message: "Marked as read" });
        }
        catch (error) {
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
            await storage_1.storage.markDemoRequestAsRead(id);
            res.json({ success: true, message: "Marked as read" });
        }
        catch (error) {
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
            await storage_1.storage.updateContactSubmissionStatus(id, status);
            res.json({ success: true, message: "Status updated" });
        }
        catch (error) {
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
            await storage_1.storage.updateDemoRequestStatus(id, status);
            res.json({ success: true, message: "Status updated" });
        }
        catch (error) {
            console.error("Error updating request status:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update status",
            });
        }
    });
    const httpServer = (0, http_1.createServer)(app);
    return httpServer;
}
