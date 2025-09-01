import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Email configuration with nodemailer
let transporter = null;
const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) : [];

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('✅ Email transporter configured');
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);
  }
}

// Create data directory and files if they don't exist
const dataDir = path.join(process.cwd(), 'data');
const leadsFile = path.join(dataDir, 'leads.json');
const linksFile = path.join(dataDir, 'download-links.json');
const pricingFile = path.join(dataDir, 'pricing.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Created data directory');
}

if (!fs.existsSync(leadsFile)) {
  fs.writeFileSync(leadsFile, JSON.stringify([], null, 2));
  console.log('📄 Created leads.json file');
}

if (!fs.existsSync(linksFile)) {
  const defaultLinks = {
    mobile: {
      ios: { url: "", enabled: false, comingSoon: true },
      android: { url: "", enabled: false, comingSoon: true }
    },
    desktop: {
      windows: { url: "", enabled: false, comingSoon: true },
      mac: { url: "", enabled: false, comingSoon: true },
      linux: { url: "", enabled: false, comingSoon: true }
    },
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(linksFile, JSON.stringify(defaultLinks, null, 2));
  console.log('📄 Created download-links.json file');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get all leads
app.get('/api/leads', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf-8'));
    res.json(leads);
  } catch (error) {
    console.error('Error reading leads:', error);
    res.status(500).json({ error: 'Failed to read leads' });
  }
});

// Save new lead and send Telegram notification
app.post('/api/leads', async (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf-8'));
    const currentTimestamp = new Date().toISOString();

    const newLead = {
      id: Date.now().toString(),
      ...req.body,
      status: req.body.status || 'new',
      timestamp: currentTimestamp,
      created_at: currentTimestamp,
    };

    leads.push(newLead);
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    console.log('✅ Lead saved:', newLead.id);

    // Send Email notification if configured
    if (transporter && adminEmails.length > 0) {
      try {
        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: adminEmails,
          subject: '🎓 New School Contact Form Submission - Taalim Flow',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                🎓 New School Contact Form Submission
              </h2>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>👤 Name:</strong> ${newLead.name}</p>
                <p><strong>📧 Email:</strong> ${newLead.email}</p>
                <p><strong>📱 Phone:</strong> ${newLead.phone || 'Not provided'}</p>
                <p><strong>🏫 School Name:</strong> ${newLead.schoolName}</p>
                <p><strong>💬 Message:</strong></p>
                <div style="background: white; padding: 15px; border-left: 4px solid #2563eb; margin-top: 10px;">
                  ${newLead.message}
                </div>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                ⏰ <strong>Submitted:</strong> ${new Date(newLead.timestamp).toLocaleString()}
              </p>
              
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; text-align: center;">
                Taalim Flow - School Management Platform
              </p>
            </div>
          `,
          text: `
🎓 New School Contact Form Submission

👤 Name: ${newLead.name}
📧 Email: ${newLead.email}
📱 Phone: ${newLead.phone || 'Not provided'}
🏫 School: ${newLead.schoolName}

💬 Message: ${newLead.message}

⏰ Submitted: ${new Date(newLead.timestamp).toLocaleString()}
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('📧 Email notification sent to:', adminEmails.join(', '));
      } catch (emailError) {
        console.error('❌ Failed to send email notification:', emailError);
      }
    }

    // Send Telegram notification if configured
    const chatIds = process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID;
    if (process.env.TELEGRAM_BOT_TOKEN && chatIds) {
      const chatIdList = chatIds.split(',').map(id => id.trim());
      
      for (const chatId of chatIdList) {
        try {
          const message = `🎓 *New School Contact Form*

👤 **Name:** ${newLead.name}
📧 **Email:** ${newLead.email}
📱 **Phone:** ${newLead.phone || 'Not provided'}
🏫 **School:** ${newLead.schoolName}
💬 **Message:** ${newLead.message}

⏰ **Submitted:** ${new Date(newLead.timestamp).toLocaleString()}`;

          const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'Markdown'
            })
          });

          if (response.ok) {
            console.log(`📱 Telegram notification sent to ${chatId}`);
          } else {
            const errorText = await response.text();
            console.error(`❌ Failed to send Telegram notification to ${chatId}:`, errorText);
          }
        } catch (telegramError) {
          console.error(`❌ Telegram notification error for ${chatId}:`, telegramError);
        }
      }
    }

    res.status(201).json(newLead);
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

// Update lead status
app.put('/api/leads/:id', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf-8'));
    const leadIndex = leads.findIndex(lead => lead.id === req.params.id);

    if (leadIndex === -1) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    leads[leadIndex] = {
      ...leads[leadIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    res.json(leads[leadIndex]);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Get download links
app.get('/api/download-links', (req, res) => {
  try {
    const links = JSON.parse(fs.readFileSync(linksFile, 'utf-8'));
    res.json(links);
  } catch (error) {
    console.error('Error reading download links:', error);
    res.status(500).json({ error: 'Failed to read download links' });
  }
});

// Update download links
app.put('/api/download-links', (req, res) => {
  try {
    const updatedLinks = {
      ...req.body,
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(linksFile, JSON.stringify(updatedLinks, null, 2));
    console.log('📄 Download links updated successfully');
    res.json(updatedLinks);
  } catch (error) {
    console.error('Error updating download links:', error);
    res.status(500).json({ error: 'Failed to update download links' });
  }
});

// Get pricing data
app.get('/api/pricing', (req, res) => {
  try {
    const pricing = JSON.parse(fs.readFileSync(pricingFile, 'utf-8'));
    res.json(pricing);
  } catch (error) {
    console.error('Error reading pricing data:', error);
    res.status(500).json({ error: 'Failed to read pricing data' });
  }
});

// Update pricing data
app.put('/api/pricing', (req, res) => {
  try {
    const updatedPricing = {
      ...req.body,
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(pricingFile, JSON.stringify(updatedPricing, null, 2));
    console.log('💰 Pricing data updated successfully');
    res.json(updatedPricing);
  } catch (error) {
    console.error('Error updating pricing data:', error);
    res.status(500).json({ error: 'Failed to update pricing data' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Leads API: http://localhost:${PORT}/api/leads`);
  console.log(`🔗 Download Links API: http://localhost:${PORT}/api/download-links`);
  console.log(`🏗️  Environment: ${process.env.NODE_ENV || 'development'}`);
  
  const chatIds = process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID;
  if (process.env.TELEGRAM_BOT_TOKEN && chatIds) {
    const chatCount = chatIds.split(',').length;
    console.log(`📱 Telegram notifications: ✅ Enabled (${chatCount} chat${chatCount > 1 ? 's' : ''})`);
  } else {
    console.log('📱 Telegram notifications: ⚠️  Not configured');
  }
  
  if (transporter && adminEmails.length > 0) {
    console.log(`📧 Email notifications: ✅ Enabled (${adminEmails.length} email${adminEmails.length > 1 ? 's' : ''})`);
  } else {
    console.log('📧 Email notifications: ⚠️  Not configured');
  }
});