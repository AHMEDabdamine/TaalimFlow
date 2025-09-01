// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
  } catch (error) {
    console.log('dotenv not available in production');
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

  // In-memory storage (resets on each deployment)
  // For production, use a database
  const leads = [];

  if (req.method === 'GET') {
    return res.status(200).json(leads);
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

      leads.push(newLead);

      // Send notifications asynchronously (don't wait)
      sendNotifications(newLead).catch(err => {
        console.error('Notification error:', err);
      });

      return res.status(201).json(newLead);
    } catch (error) {
      console.error('Error saving lead:', error);
      return res.status(500).json({ error: 'Failed to save lead' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function sendNotifications(lead) {
  console.log('Starting notifications for lead:', lead.id);
  
  const results = await Promise.allSettled([
    sendEmailNotification(lead),
    sendTelegramNotification(lead)
  ]);

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Notification ${index} failed:`, result.reason);
    } else {
      console.log(`Notification ${index} succeeded`);
    }
  });
}

async function sendTelegramNotification(lead) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID;
  
  console.log('Telegram config:', { hasToken: !!botToken, hasChatIds: !!chatIds });
  
  if (!botToken || !chatIds) {
    console.log('Telegram not configured');
    return;
  }

  const chatIdList = chatIds.split(',').map(id => id.trim()).filter(Boolean);
  console.log('Sending to chat IDs:', chatIdList);
  
  const message = `🎓 *New School Contact Form*

👤 *Name:* ${escapeMarkdown(lead.name)}
📧 *Email:* ${escapeMarkdown(lead.email)}
📱 *Phone:* ${escapeMarkdown(lead.phone || 'Not provided')}
🏫 *School:* ${escapeMarkdown(lead.schoolName)}
💬 *Message:* ${escapeMarkdown(lead.message)}

⏰ *Submitted:* ${new Date(lead.timestamp).toLocaleString()}`;

  const sendPromises = chatIdList.map(async (chatId) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Telegram API error: ${data.description || 'Unknown error'}`);
      }
      
      console.log(`Telegram sent to ${chatId}:`, data.ok);
      return data;
    } catch (error) {
      console.error(`Telegram error for ${chatId}:`, error.message);
      throw error;
    }
  });

  await Promise.allSettled(sendPromises);
}

async function sendEmailNotification(lead) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const adminEmails = process.env.ADMIN_EMAILS;

  console.log('Email config:', { 
    hasHost: !!smtpHost, 
    hasUser: !!smtpUser, 
    hasPass: !!smtpPass,
    hasAdmins: !!adminEmails 
  });

  if (!smtpHost || !smtpUser || !smtpPass || !adminEmails) {
    console.log('Email not configured');
    return;
  }

  try {
    // Dynamic import for nodemailer
    const nodemailer = await import('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const emailList = adminEmails.split(',').map(email => email.trim()).filter(Boolean);
    console.log('Sending email to:', emailList);

    const mailOptions = {
      from: process.env.SMTP_FROM || smtpUser,
      to: emailList,
      subject: '🎓 New School Contact Form - OnSchool',
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
            OnSchool - School Management Platform
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

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error.message);
    throw error;
  }
}

function escapeMarkdown(text) {
  if (!text) return '';
  return text.replace(/[*_`\[\]()~>#+=|{}.!-]/g, '\\$&');
}