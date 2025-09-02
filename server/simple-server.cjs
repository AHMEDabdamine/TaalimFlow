const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { default: fetch } = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple in-memory storage for demo
let contactSubmissions = [];
let demoRequests = [];
let siteSettings = {
  contactEmail: "contact@taalimflow.com",
  contactPhone: "+213 555 123 456",
  instagram: "@taalimflow",
  facebook: "TaalimFlow",
  pricing: {
    basic: "5000 DA/month",
    premium: "10000 DA/month",
    enterprise: "Contact us"
  }
};

// Telegram notification function
async function sendTelegramNotification(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.log('Telegram not configured. Message would be:', message);
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (response.ok) {
      console.log('✅ Telegram notification sent successfully');
    } else {
      console.error('❌ Telegram API error:', response.status);
    }
  } catch (error) {
    console.error('❌ Failed to send Telegram notification:', error.message);
  }
}

function formatContactSubmission(submission) {
  return `
🆕 <b>Nouvelle soumission de contact / New Contact Submission</b>

👤 <b>Nom/Name:</b> ${submission.name}
📧 <b>Email:</b> ${submission.email}
📱 <b>Téléphone/Phone:</b> ${submission.phone || "Non fourni/Not provided"}
🏫 <b>École/School:</b> ${submission.schoolName || "Non fourni/Not provided"}
💬 <b>Message:</b> ${submission.message || "Aucun message/No message"}
🕐 <b>Soumis le/Submitted at:</b> ${new Date().toLocaleString("fr-FR")}
  `.trim();
}

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, schoolName, message } = req.body;
    
    // Basic validation
    if (!name || !email || !schoolName) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    const submission = {
      id: contactSubmissions.length + 1,
      name,
      email,
      phone: phone || '',
      schoolName,
      message: message || '',
      submittedAt: new Date().toISOString(),
      isRead: 'false',
      status: 'new'
    };

    contactSubmissions.push(submission);
    
    // Send Telegram notification
    try {
      const telegramMessage = formatContactSubmission(submission);
      await sendTelegramNotification(telegramMessage);
    } catch (telegramError) {
      console.error('Telegram notification failed:', telegramError);
    }

    console.log('✅ Contact form submitted:', submission);

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      id: submission.id,
    });
  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Demo request submission endpoint  
app.post('/api/demo-request', async (req, res) => {
  try {
    const { name, email, phone, schoolName, schoolType, numberOfStudents } = req.body;
    
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    const request = {
      id: demoRequests.length + 1,
      name,
      email,
      phone: phone || '',
      schoolName: schoolName || '',
      schoolType: schoolType || '',
      numberOfStudents: numberOfStudents || '',
      submittedAt: new Date().toISOString(),
      isRead: 'false',
      status: 'new'
    };

    demoRequests.push(request);
    
    // Send Telegram notification
    try {
      const telegramMessage = `
🎯 <b>Nouvelle demande de démonstration / New Demo Request</b>

👤 <b>Nom/Name:</b> ${request.name}
📧 <b>Email:</b> ${request.email}
📱 <b>Téléphone/Phone:</b> ${request.phone || "Non fourni/Not provided"}
🏫 <b>École/School:</b> ${request.schoolName || "Non fourni/Not provided"}
🏷️ <b>Type d'école/School Type:</b> ${request.schoolType || "Non fourni/Not provided"}
👥 <b>Nombre d'étudiants/Students:</b> ${request.numberOfStudents || "Non fourni/Not provided"}
🕐 <b>Soumis le/Submitted at:</b> ${new Date().toLocaleString("fr-FR")}
      `.trim();
      await sendTelegramNotification(telegramMessage);
    } catch (telegramError) {
      console.error('Telegram notification failed:', telegramError);
    }

    console.log('✅ Demo request submitted:', request);

    res.status(201).json({
      success: true,
      message: 'Demo request submitted successfully',
      id: request.id,
    });
  } catch (error) {
    console.error('❌ Error processing demo request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Admin endpoints
app.get('/api/admin/contact-submissions', (req, res) => {
  try {
    res.json(contactSubmissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submissions',
    });
  }
});

app.get('/api/admin/demo-requests', (req, res) => {
  try {
    res.json(demoRequests);
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch demo requests',
    });
  }
});

// Mark submissions as read
app.patch('/api/admin/contact-submissions/:id/read', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const submission = contactSubmissions.find(s => s.id === id);
    if (submission) {
      submission.isRead = 'true';
      res.json({ success: true, message: 'Marked as read' });
    } else {
      res.status(404).json({ success: false, message: 'Submission not found' });
    }
  } catch (error) {
    console.error('Error marking submission as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark as read',
    });
  }
});

app.patch('/api/admin/demo-requests/:id/read', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const request = demoRequests.find(r => r.id === id);
    if (request) {
      request.isRead = 'true';
      res.json({ success: true, message: 'Marked as read' });
    } else {
      res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (error) {
    console.error('Error marking request as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark as read',
    });
  }
});

// Update status
app.patch('/api/admin/contact-submissions/:id/status', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const submission = contactSubmissions.find(s => s.id === id);
    if (submission) {
      submission.status = status;
      res.json({ success: true, message: 'Status updated' });
    } else {
      res.status(404).json({ success: false, message: 'Submission not found' });
    }
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
    });
  }
});

app.patch('/api/admin/demo-requests/:id/status', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const request = demoRequests.find(r => r.id === id);
    if (request) {
      request.status = status;
      res.json({ success: true, message: 'Status updated' });
    } else {
      res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
    });
  }
});

// Settings endpoints
app.get('/api/admin/settings', (req, res) => {
  try {
    res.json(siteSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
    });
  }
});

app.post('/api/admin/settings', (req, res) => {
  try {
    const { contactEmail, contactPhone, instagram, facebook, pricing } = req.body;
    
    // Update settings
    siteSettings = {
      contactEmail: contactEmail || siteSettings.contactEmail,
      contactPhone: contactPhone || siteSettings.contactPhone,
      instagram: instagram || siteSettings.instagram,
      facebook: facebook || siteSettings.facebook,
      pricing: pricing || siteSettings.pricing
    };
    
    console.log('✅ Settings updated:', siteSettings);
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: siteSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
    });
  }
});

// Public settings endpoint (for frontend to get current settings)
app.get('/api/settings', (req, res) => {
  try {
    res.json(siteSettings);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`📱 Telegram configured: ${process.env.TELEGRAM_BOT_TOKEN ? '✅' : '❌'}`);
  console.log('💾 Using in-memory storage (data will reset on restart)');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});