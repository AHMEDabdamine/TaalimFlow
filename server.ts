//new server.js
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Determine if we're in production or development
const isProduction = process.env.NODE_ENV === "production";

// Set up paths based on environment
const publicDir = isProduction
  ? path.join(process.cwd(), "dist")
  : path.join(process.cwd(), "public");
const leadsDir = path.join(process.cwd(), "data");
const leadsFile = path.join(leadsDir, "leads.json");

// Load env variables
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  ADMIN_EMAILS,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_IDS,
} = process.env;

const adminEmails = ADMIN_EMAILS ? ADMIN_EMAILS.split(",") : [];
const telegramChatIds = TELEGRAM_CHAT_IDS ? TELEGRAM_CHAT_IDS.split(",") : [];

// Validate required environment variables
const requiredEnvVars = {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  ADMIN_EMAILS,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_IDS,
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.warn("⚠️  Missing environment variables:", missingEnvVars.join(", "));
  console.warn("Server will run with limited functionality");
}

// Nodemailer transporter (only if SMTP config is available)
let transporter: nodemailer.Transporter | null = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    console.log("✅ SMTP transporter configured successfully");
  } catch (error) {
    console.error("❌ Failed to create SMTP transporter:", error);
  }
}

// Ensure leads directory exists
if (!fs.existsSync(leadsDir)) {
  fs.mkdirSync(leadsDir, { recursive: true });
}

// Initialize leads file if it doesn't exist
if (!fs.existsSync(leadsFile)) {
  fs.writeFileSync(leadsFile, JSON.stringify([], null, 2));
  console.log("📁 Created leads.json file");
}

// Ensure all leads have required fields
const ensureLeadFields = (leads: any[]) => {
  return leads.map((lead) => ({
    ...lead,
    status: lead.status || "new",
    timestamp: lead.timestamp || lead.created_at || new Date().toISOString(),
    created_at: lead.created_at || lead.timestamp || new Date().toISOString(),
    source: lead.source || "contact_form",
  }));
};

// Get all leads
app.get("/api/leads", (req: Request, res: Response) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, "utf-8"));
    res.json(ensureLeadFields(leads));
  } catch (err) {
    console.error("Error reading leads:", err);
    res.status(500).json({ error: "Failed to read leads" });
  }
});

// Get a specific lead by ID
app.get("/api/leads/:id", (req: Request, res: Response) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, "utf-8"));
    const lead = leads.find((l: any) => l.id === req.params.id);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.json(lead);
  } catch (err) {
    console.error("Error reading lead:", err);
    res.status(500).json({ error: "Failed to read lead" });
  }
});

// Save a new lead
app.post("/api/leads", async (req: Request, res: Response) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, "utf-8"));
    const currentTimestamp = new Date().toISOString();

    const newLead = {
      id: Date.now().toString(),
      ...req.body,
      status: req.body.status || "new",
      timestamp: currentTimestamp,
      created_at: currentTimestamp,
    };

    leads.push(newLead);
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));

    // ------------------------------
    // 1️⃣ Send Email Notification
    // ------------------------------
    if (transporter && adminEmails.length > 0) {
      try {
        const mailOptions = {
          from: SMTP_FROM,
          to: adminEmails,
          subject: "📩 New Contact Form Submission",
          text: `
          You have a new lead submission:

          Name: ${newLead.name || "N/A"}
          Phone: ${newLead.phone || "N/A"}
          Email: ${newLead.email || "N/A"}
          Message: ${newLead.message || "N/A"}
          Submitted At: ${newLead.timestamp}
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email notification sent");
      } catch (emailError) {
        console.error("❌ Failed to send email notification:", emailError);
      }
    }

    // ------------------------------
    // 2️⃣ Send Telegram Notification
    // ------------------------------
    if (TELEGRAM_BOT_TOKEN && telegramChatIds.length > 0) {
      try {
        const telegramMessage = `
📩 *New Contact Form Submission*  
👤 Name: ${newLead.name || "N/A"}
📱 Phone: ${newLead.phone || "N/A"}
📧 Email: ${newLead.email || "N/A"}  
💬 Message: ${newLead.message || "N/A"}  
⏰ Submitted At: ${newLead.timestamp}
`;

        for (const chatId of telegramChatIds) {
          await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
                parse_mode: "Markdown",
              }),
            },
          );
        }
        console.log("✅ Telegram notification sent");
      } catch (telegramError) {
        console.error(
          "❌ Failed to send Telegram notification:",
          telegramError,
        );
      }
    }

    res.status(201).json(newLead);
  } catch (err) {
    console.error("Error saving lead:", err);
    res.status(500).json({ error: "Failed to save lead or notify admins" });
  }
});

// Update a lead
app.put("/api/leads/:id", (req: Request, res: Response) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, "utf-8"));
    const leadIndex = leads.findIndex((l: any) => l.id === req.params.id);

    if (leadIndex === -1) {
      return res.status(404).json({ error: "Lead not found" });
    }

    leads[leadIndex] = {
      ...leads[leadIndex],
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    res.json(leads[leadIndex]);
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({ error: "Failed to update lead" });
  }
});

// Delete a lead
app.delete("/api/leads/:id", (req: Request, res: Response) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, "utf-8"));
    const filteredLeads = leads.filter((l: any) => l.id !== req.params.id);

    if (filteredLeads.length === leads.length) {
      return res.status(404).json({ error: "Lead not found" });
    }

    fs.writeFileSync(leadsFile, JSON.stringify(filteredLeads, null, 2));
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error("Error deleting lead:", err);
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    publicDir,
    features: {
      email: !!transporter,
      telegram: !!(TELEGRAM_BOT_TOKEN && telegramChatIds.length > 0),
    },
  });
});

// Serve static files from the appropriate directory
app.use(express.static(publicDir));

// Serve the React app for any other routes (SPA fallback)
app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(publicDir, "index.html");

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      error: "Frontend build not found",
      publicDir,
      indexPath,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Leads API: http://localhost:${PORT}/api/leads`);
  console.log(`🏗️  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📁 Serving static files from: ${publicDir}`);
});
