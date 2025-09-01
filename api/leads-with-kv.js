// Alternative leads API using Vercel KV for persistent storage
// To use this, you need to set up Vercel KV in your project
// Replace api/leads.js with this file if you want persistent storage

import { kv } from '@vercel/kv';
import nodemailer from 'nodemailer';

// Email configuration
let transporter = null;

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
  } catch (error) {
    console.error('Failed to create email transporter:', error);
  }
}

// Send Telegram notification
async function sendTelegramNotification(lead) {
  const chatIds = process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID;
  if (!process.env.TELEGRAM_BOT_TOKEN || !chatIds) return;

  const chatIdList = chatIds.split(',').map(id => id.trim());
  
  for (const chatId of chatIdList) {
    try {
      const message = `🎓 *New School Contact Form*

👤 **Name:** ${lead.name}
📧 **Email:** ${lead.email}
📱 **Phone:** ${lead.phone || 'Not provided'}
🏫 **School:** ${lead.schoolName}
💬 **Message:** ${lead.message}

⏰ **Submitted:** ${new Date(lead.timestamp).toLocaleString()}`;

      const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        console.error(`Failed to send Telegram notification to ${chatId}`);
      }
    } catch (error) {
      console.error(`Telegram notification error for ${chatId}:`, error);
    }
  }
}

// Send Email notification
async function sendEmailNotification(lead) {
  if (!transporter) return;

  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) : [];
  if (adminEmails.length === 0) return;

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
            <p><strong>👤 Name:</strong> ${lead.name}</p>
            <p><strong>📧 Email:</strong> ${lead.email}</p>
            <p><strong>📱 Phone:</strong> ${lead.phone || 'Not provided'}</p>
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
            Taalim Flow - School Management Platform
          </p>
        </div>
      `,
      text: `
🎓 New School Contact Form Submission

👤 Name: ${lead.name}
📧 Email: ${lead.email}
📱 Phone: ${lead.phone || 'Not provided'}
🏫 School: ${lead.schoolName}

💬 Message: ${lead.message}

⏰ Submitted: ${new Date(lead.timestamp).toLocaleString()}
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent');
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Get all leads from KV storage
      const leadsData = await kv.get('taalim_leads');
      const leads = leadsData || [];
      return res.status(200).json(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }
  }

  if (req.method === 'POST') {
    try {
      const currentTimestamp = new Date().toISOString();
      
      const newLead = {
        id: Date.now().toString(),
        ...req.body,
        status: req.body.status || 'new',
        timestamp: currentTimestamp,
        created_at: currentTimestamp,
        source: 'contact_form'
      };

      // Get existing leads
      const existingLeads = await kv.get('taalim_leads') || [];
      
      // Add new lead
      const updatedLeads = [...existingLeads, newLead];
      
      // Save back to KV
      await kv.set('taalim_leads', updatedLeads);

      // Send notifications
      await Promise.all([
        sendEmailNotification(newLead),
        sendTelegramNotification(newLead)
      ]);

      return res.status(201).json(newLead);
    } catch (error) {
      console.error('Error saving lead:', error);
      return res.status(500).json({ error: 'Failed to save lead' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      
      // Get existing leads
      const leads = await kv.get('taalim_leads') || [];
      const leadIndex = leads.findIndex(lead => lead.id === id);
      
      if (leadIndex === -1) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      // Update lead
      leads[leadIndex] = {
        ...leads[leadIndex],
        ...updateData,
        updated_at: new Date().toISOString()
      };

      // Save back to KV
      await kv.set('taalim_leads', leads);

      return res.status(200).json(leads[leadIndex]);
    } catch (error) {
      console.error('Error updating lead:', error);
      return res.status(500).json({ error: 'Failed to update lead' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}