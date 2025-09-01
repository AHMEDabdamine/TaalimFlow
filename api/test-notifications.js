// Test endpoint for notifications
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Check configuration
    const config = {
      email: {
        configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ADMIN_EMAILS),
        host: process.env.SMTP_HOST ? 'Set' : 'Missing',
        user: process.env.SMTP_USER ? 'Set' : 'Missing',
        pass: process.env.SMTP_PASS ? 'Set' : 'Missing',
        admins: process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').length + ' emails' : 'Missing'
      },
      telegram: {
        configured: !!(process.env.TELEGRAM_BOT_TOKEN && (process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID)),
        token: process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Missing',
        chatIds: (process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID) ? 
          (process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID).split(',').length + ' chats' : 'Missing'
      }
    };

    return res.status(200).json({
      message: 'Notification service status',
      config
    });
  }

  if (req.method === 'POST') {
    // Test sending notifications
    const testLead = {
      id: 'test-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      phone: '0555123456',
      schoolName: 'Test School',
      message: 'This is a test notification from the OnSchool platform.',
      timestamp: new Date().toISOString()
    };

    const results = {
      email: { sent: false, error: null },
      telegram: { sent: false, error: null }
    };

    // Test email
    try {
      await sendTestEmail(testLead);
      results.email.sent = true;
    } catch (error) {
      results.email.error = error.message;
    }

    // Test Telegram
    try {
      await sendTestTelegram(testLead);
      results.telegram.sent = true;
    } catch (error) {
      results.telegram.error = error.message;
    }

    return res.status(200).json({
      message: 'Test notifications sent',
      results
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function sendTestEmail(lead) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const adminEmails = process.env.ADMIN_EMAILS;

  if (!smtpHost || !smtpUser || !smtpPass || !adminEmails) {
    throw new Error('Email configuration missing');
  }

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

  const mailOptions = {
    from: process.env.SMTP_FROM || smtpUser,
    to: emailList,
    subject: '🧪 TEST - OnSchool Notification System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">✅ Test Notification Successful</h2>
        <p>Your email notifications are working correctly!</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Name: ${lead.name}</li>
            <li>Email: ${lead.email}</li>
            <li>Time: ${new Date().toLocaleString()}</li>
          </ul>
        </div>
      </div>
    `,
    text: `TEST - OnSchool Notification System\n\nYour email notifications are working correctly!\n\nTest sent at: ${new Date().toLocaleString()}`
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Test email sent:', info.messageId);
  return info;
}

async function sendTestTelegram(lead) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatIds) {
    throw new Error('Telegram configuration missing');
  }

  const chatIdList = chatIds.split(',').map(id => id.trim()).filter(Boolean);
  
  const message = `✅ *TEST NOTIFICATION*\n\nYour Telegram notifications are working correctly!\n\n📅 Time: ${new Date().toLocaleString()}\n💻 System: OnSchool Platform`;

  const results = [];
  for (const chatId of chatIdList) {
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
    
    results.push({ chatId, success: true });
  }

  return results;
}