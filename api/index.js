// Vercel serverless function for TaalimFlow API
const fs = require('fs');
const path = require('path');

// Simple in-memory storage for serverless environment
let data = { submissions: [], settings: {} };

// Load data if file exists
const dataPath = path.join(process.cwd(), 'data.json');
if (fs.existsSync(dataPath)) {
  try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Save data function
function saveData() {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Telegram notification function
async function sendTelegramNotification(submission) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!token || !chatId) return;
  
  const message = `🆕 Nouvelle soumission TaalimFlow\n\n` +
    `📧 Email: ${submission.email}\n` +
    `📱 Téléphone: ${submission.phone}\n` +
    `🏢 Type: ${submission.businessType}\n` +
    `📅 ${new Date().toLocaleString('fr-FR')}`;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });
  } catch (error) {
    console.error('Telegram notification failed:', error);
  }
}

// Main handler
async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, url } = req;
  const pathname = url.split('?')[0];

  try {
    // Health check
    if (method === 'GET' && pathname === '/api/health') {
      return res.json({ status: 'OK', message: 'TaalimFlow API is running' });
    }

    // Get submissions
    if (method === 'GET' && pathname === '/api/submissions') {
      return res.json(data.submissions || []);
    }

    // Submit contact form
    if (method === 'POST' && pathname === '/api/contact') {
      const submission = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
        status: 'new',
        source: 'contact_form'
      };

      if (!data.submissions) data.submissions = [];
      data.submissions.push(submission);
      saveData();

      // Send Telegram notification
      await sendTelegramNotification(submission);

      return res.json({
        success: true,
        message: 'Contact form submitted successfully',
        id: submission.id
      });
    }

    // Update submission status
    if (method === 'PUT' && pathname.startsWith('/api/submissions/')) {
      const id = parseInt(pathname.split('/').pop());
      const { status } = req.body;

      if (!data.submissions) data.submissions = [];
      const submission = data.submissions.find(s => s.id === id);
      
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      submission.status = status;
      saveData();

      return res.json({ success: true, submission });
    }

    // Get settings
    if (method === 'GET' && pathname === '/api/settings') {
      return res.json(data.settings || {
        companyName: "TaalimFlow",
        companyEmail: "contact@taalimflow.com", 
        companyPhone: "+213123456789",
        pricing: {
          basic: "9,999 DZD",
          premium: "19,999 DZD",
          enterprise: "Sur mesure"
        }
      });
    }

    // Update settings
    if (method === 'PUT' && pathname === '/api/settings') {
      data.settings = { ...data.settings, ...req.body };
      saveData();
      return res.json({ success: true, settings: data.settings });
    }

    // 404 for other routes
    return res.status(404).json({ error: 'Route not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = handler;