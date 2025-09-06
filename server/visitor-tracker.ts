import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";

interface VisitorData {
  uniqueVisitors: Set<string>;
  totalVisits: number;
  dailyVisits: { [date: string]: number };
  lastUpdated: string;
}

export class VisitorTracker {
  private dataPath = path.join(process.cwd(), "visitor-data.json");
  private visitorData: VisitorData = {
    uniqueVisitors: new Set(),
    totalVisits: 0,
    dailyVisits: {},
    lastUpdated: new Date().toISOString()
  };

  constructor() {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const data = await fs.readFile(this.dataPath, "utf-8");
      const parsed = JSON.parse(data);
      this.visitorData = {
        uniqueVisitors: new Set(parsed.uniqueVisitors || []),
        totalVisits: parsed.totalVisits || 0,
        dailyVisits: parsed.dailyVisits || {},
        lastUpdated: parsed.lastUpdated || new Date().toISOString()
      };
    } catch (error) {
      // File doesn't exist or is corrupted, use default values
      console.log("Visitor data file not found, starting with fresh data");
    }
  }

  private async saveData(): Promise<void> {
    try {
      const dataToSave = {
        uniqueVisitors: Array.from(this.visitorData.uniqueVisitors),
        totalVisits: this.visitorData.totalVisits,
        dailyVisits: this.visitorData.dailyVisits,
        lastUpdated: this.visitorData.lastUpdated
      };
      await fs.writeFile(this.dataPath, JSON.stringify(dataToSave, null, 2));
    } catch (error) {
      console.error("Failed to save visitor data:", error);
    }
  }

  private getClientIP(req: Request): string {
    // Get the real IP address, considering proxies
    const forwarded = req.headers['x-forwarded-for'] as string;
    const realIP = req.headers['x-real-ip'] as string;
    const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    if (realIP) {
      return realIP;
    }
    return remoteAddress || 'unknown';
  }

  public middleware = (req: Request, res: Response, next: NextFunction): void => {
    // Only track visits to the main site, not API calls
    if (req.path.startsWith('/api/')) {
      return next();
    }

    const clientIP = this.getClientIP(req);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Track unique visitors
    const wasNewVisitor = !this.visitorData.uniqueVisitors.has(clientIP);
    if (wasNewVisitor) {
      this.visitorData.uniqueVisitors.add(clientIP);
    }

    // Track total visits
    this.visitorData.totalVisits++;

    // Track daily visits
    if (!this.visitorData.dailyVisits[today]) {
      this.visitorData.dailyVisits[today] = 0;
    }
    this.visitorData.dailyVisits[today]++;

    // Update last updated timestamp
    this.visitorData.lastUpdated = new Date().toISOString();

    // Save data asynchronously (don't block the request)
    this.saveData().catch(error => {
      console.error("Failed to save visitor data:", error);
    });

    next();
  };

  public getStats(): {
    uniqueVisitors: number;
    totalVisits: number;
    todayVisits: number;
    weeklyVisits: number;
    monthlyVisits: number;
    lastUpdated: string;
  } {
    const today = new Date().toISOString().split('T')[0];
    const todayVisits = this.visitorData.dailyVisits[today] || 0;

    // Calculate weekly visits (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    let weeklyVisits = 0;
    
    for (const [date, visits] of Object.entries(this.visitorData.dailyVisits)) {
      if (new Date(date) >= weekAgo) {
        weeklyVisits += visits;
      }
    }

    // Calculate monthly visits (last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    let monthlyVisits = 0;
    
    for (const [date, visits] of Object.entries(this.visitorData.dailyVisits)) {
      if (new Date(date) >= monthAgo) {
        monthlyVisits += visits;
      }
    }

    return {
      uniqueVisitors: this.visitorData.uniqueVisitors.size,
      totalVisits: this.visitorData.totalVisits,
      todayVisits,
      weeklyVisits,
      monthlyVisits,
      lastUpdated: this.visitorData.lastUpdated
    };
  }

  public getDailyVisits(days: number = 30): { [date: string]: number } {
    const result: { [date: string]: number } = {};
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (const [date, visits] of Object.entries(this.visitorData.dailyVisits)) {
      if (new Date(date) >= startDate) {
        result[date] = visits;
      }
    }

    return result;
  }
}

export const visitorTracker = new VisitorTracker();
