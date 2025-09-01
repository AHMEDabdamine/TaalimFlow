import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from dist folder (frontend)
app.use(express.static(path.join(__dirname, "..", "dist")));
// In-memory storage for leads
let leads = [];
// Email configuration
let emailTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
}
// Notification functions
async function sendEmailNotification(lead) {
    if (!emailTransporter || !process.env.ADMIN_EMAILS) {
        console.log("📧 Email not configured");
        return false;
    }
    try {
        const adminEmails = process.env.ADMIN_EMAILS.split(",").map((email) => email.trim());
        const info = await emailTransporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: adminEmails,
            subject: "🎓 New School Contact - OnSchool",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            🎓 New School Contact Form Submission
          </h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Name:</strong> ${lead.name}</p>
            <p><strong>📧 Email:</strong> ${lead.email}</p>
            <p><strong>📱 Phone:</strong> ${lead.phone || "Not provided"}</p>
            <p><strong>🏫 School Name:</strong> ${lead.schoolName}</p>
            <p><strong>💬 Message:</strong></p>
            <div style="background: white; padding: 15px; border-left: 4px solid #2563eb; margin-top: 10px;">
              ${lead.message}
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            ⏰ <strong>Submitted:</strong> ${new Date(lead.timestamp).toLocaleString()}
          </p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            OnSchool - School Management Platform
          </p>
        </div>
      `,
            text: `
🎓 New School Contact Form

👤 Name: ${lead.name}
📧 Email: ${lead.email}
📱 Phone: ${lead.phone || "Not provided"}
🏫 School: ${lead.schoolName}
💬 Message: ${lead.message}
⏰ Time: ${new Date(lead.timestamp).toLocaleString()}
      `,
        });
        console.log("📧 Email sent to:", adminEmails.join(", "));
        return true;
    }
    catch (error) {
        console.error("📧 Email failed:", error.message);
        return false;
    }
}
async function sendTelegramNotification(lead) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatIds = process.env.TELEGRAM_CHAT_IDS;
    if (!botToken || !chatIds) {
        console.log("💬 Telegram not configured");
        return false;
    }
    try {
        const chatList = chatIds.split(",").map((id) => id.trim());
        const message = `🎓 *New School Contact*

👤 *Name:* ${escapeMarkdown(lead.name)}
📧 *Email:* ${escapeMarkdown(lead.email)}
📱 *Phone:* ${escapeMarkdown(lead.phone || "Not provided")}
🏫 *School:* ${escapeMarkdown(lead.schoolName)}
💬 *Message:* ${escapeMarkdown(lead.message)}

⏰ *Time:* ${new Date(lead.timestamp).toLocaleString()}`;
        let successCount = 0;
        for (const chatId of chatList) {
            try {
                const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: "Markdown",
                    }),
                });
                if (response.ok) {
                    console.log(`💬 Telegram sent to: ${chatId}`);
                    successCount++;
                }
                else {
                    console.log(`💬 Telegram failed for: ${chatId}`);
                }
            }
            catch (error) {
                console.error(`💬 Telegram error for ${chatId}:`, error.message);
            }
        }
        return successCount > 0;
    }
    catch (error) {
        console.error("💬 Telegram failed:", error.message);
        return false;
    }
}
function escapeMarkdown(text) {
    if (!text)
        return "";
    return text.replace(/[*_`\[\]()~>#+=|{}.!-]/g, "\\$&");
}
// API Routes
// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        email: !!emailTransporter,
        telegram: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_IDS),
        environment: process.env.NODE_ENV || "development",
    });
});
// Leads API
app.get("/api/leads", (req, res) => {
    res.json(leads);
});
app.post("/api/leads", async (req, res) => {
    try {
        const currentTimestamp = new Date().toISOString();
        const newLead = {
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            schoolName: req.body.schoolName,
            message: req.body.message,
            status: req.body.status || "new",
            timestamp: currentTimestamp,
            created_at: currentTimestamp,
            source: "contact_form",
        };
        leads.push(newLead);
        console.log("\n📝 New lead received:", newLead.name);
        // Send notifications
        const [emailResult, telegramResult] = await Promise.allSettled([
            sendEmailNotification(newLead),
            sendTelegramNotification(newLead),
        ]);
        const emailSuccess = emailResult.status === "fulfilled" && emailResult.value;
        const telegramSuccess = telegramResult.status === "fulfilled" && telegramResult.value;
        console.log("📊 Notifications sent:", {
            email: emailSuccess,
            telegram: telegramSuccess,
        });
        res.status(201).json({
            success: true,
            lead: newLead,
            notifications: {
                email: emailSuccess,
                telegram: telegramSuccess,
            },
        });
    }
    catch (error) {
        console.error("❌ Error saving lead:", error.message);
        res.status(500).json({ error: "Failed to save lead" });
    }
});
app.put("/api/leads/:id", async (req, res) => {
    try {
        const leadIndex = leads.findIndex((lead) => lead.id === req.params.id);
        if (leadIndex === -1) {
            return res.status(404).json({ error: "Lead not found" });
        }
        leads[leadIndex] = {
            ...leads[leadIndex],
            ...req.body,
            updated_at: new Date().toISOString(),
        };
        res.json(leads[leadIndex]);
    }
    catch (error) {
        console.error("Error updating lead:", error.message);
        res.status(500).json({ error: "Failed to update lead" });
    }
});
// Serve frontend for all other routes (SPA routing)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});
// Start server
app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`\n🚀 OnSchool Production Server`);
    console.log(`   Frontend + Backend running on: http://localhost:${PORT}`);
    console.log(`\n📋 What's Running:`);
    console.log(`   🌐 Frontend: Serving from /dist folder`);
    console.log(`   🔧 Backend: API endpoints at /api/*`);
    console.log(`\n🔧 Notifications:`);
    console.log(`   📧 Email: ${emailTransporter ? "✅ Ready" : "❌ Not configured"}`);
    console.log(`   💬 Telegram: ${process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_IDS
        ? "✅ Ready"
        : "❌ Not configured"}`);
    console.log(`\n✅ Full production app ready!`);
});
