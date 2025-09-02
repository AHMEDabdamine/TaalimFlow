import type { VercelRequest, VercelResponse } from '@vercel/node';
import { insertContactSubmissionSchema } from '../shared/schema';
import { getStorage } from '../server/vercel-storage';
import { telegramService } from '../server/telegram';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate request body
    const validatedData = insertContactSubmissionSchema.parse(req.body);
    
    // Save to database
    const storage = getStorage();
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
}
