import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const id = parseInt(req.query.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }

    await storage.markDemoRequestAsRead(id);
    res.json({ success: true, message: "Marked as read" });
  } catch (error) {
    console.error("Error marking request as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark as read",
    });
  }
}
