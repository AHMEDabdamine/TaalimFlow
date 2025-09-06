import {
  type ContactSubmission,
  type DemoRequest,
  type InsertContactSubmission,
  type InsertDemoRequest,
} from "../shared/schema";
import fs from "fs/promises";
import path from "path";

export interface VisitorRecord {
  ip: string;
  visitedAt: string;
  userAgent?: string;
}

export interface VisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  thisWeekVisitors: number;
  thisMonthVisitors: number;
}

export interface IStorage {
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  markContactSubmissionAsRead(id: number): Promise<void>;
  updateContactSubmissionStatus(id: number, status: string): Promise<void>;
  
  // Demo requests
  createDemoRequest(request: InsertDemoRequest): Promise<DemoRequest>;
  getAllDemoRequests(): Promise<DemoRequest[]>;
  markDemoRequestAsRead(id: number): Promise<void>;
  updateDemoRequestStatus(id: number, status: string): Promise<void>;
  
  // Visitor tracking
  recordVisitor(ip: string, userAgent?: string): Promise<void>;
  getVisitorStats(): Promise<VisitorStats>;
}

interface FileData {
  contactSubmissions: ContactSubmission[];
  demoRequests: DemoRequest[];
  visitors: VisitorRecord[];
  nextContactId: number;
  nextDemoId: number;
}

export class FileStorage implements IStorage {
  private dataPath = path.join(process.cwd(), "data.json");
  
  private async readData(): Promise<FileData> {
    try {
      const data = await fs.readFile(this.dataPath, "utf-8");
      return JSON.parse(data);
    } catch {
      return {
        contactSubmissions: [],
        demoRequests: [],
        visitors: [],
        nextContactId: 1,
        nextDemoId: 1,
      };
    }
  }

  private async writeData(data: FileData): Promise<void> {
    await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
  }

  // Contact submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const data = await this.readData();
    const newSubmission: ContactSubmission = {
      id: data.nextContactId++,
      ...submission,
      submittedAt: new Date().toISOString(),
      isRead: "false",
      status: "new",
    };
    data.contactSubmissions.push(newSubmission);
    await this.writeData(data);
    return newSubmission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    const data = await this.readData();
    return data.contactSubmissions.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async markContactSubmissionAsRead(id: number): Promise<void> {
    const data = await this.readData();
    const index = data.contactSubmissions.findIndex(s => s.id === id);
    if (index !== -1) {
      data.contactSubmissions[index].isRead = "true";
      await this.writeData(data);
    }
  }

  async updateContactSubmissionStatus(id: number, status: string): Promise<void> {
    const data = await this.readData();
    const index = data.contactSubmissions.findIndex(s => s.id === id);
    if (index !== -1) {
      data.contactSubmissions[index].status = status;
      await this.writeData(data);
    }
  }

  // Demo requests
  async createDemoRequest(request: InsertDemoRequest): Promise<DemoRequest> {
    const data = await this.readData();
    const newRequest: DemoRequest = {
      id: data.nextDemoId++,
      ...request,
      submittedAt: new Date().toISOString(),
      isRead: "false",
      status: "new",
    };
    data.demoRequests.push(newRequest);
    await this.writeData(data);
    return newRequest;
  }

  async getAllDemoRequests(): Promise<DemoRequest[]> {
    const data = await this.readData();
    return data.demoRequests.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async markDemoRequestAsRead(id: number): Promise<void> {
    const data = await this.readData();
    const index = data.demoRequests.findIndex(r => r.id === id);
    if (index !== -1) {
      data.demoRequests[index].isRead = "true";
      await this.writeData(data);
    }
  }

  async updateDemoRequestStatus(id: number, status: string): Promise<void> {
    const data = await this.readData();
    const index = data.demoRequests.findIndex(r => r.id === id);
    if (index !== -1) {
      data.demoRequests[index].status = status;
      await this.writeData(data);
    }
  }

  // Visitor tracking
  async recordVisitor(ip: string, userAgent?: string): Promise<void> {
    const data = await this.readData();
    const now = new Date().toISOString();
    
    // Check if this IP has visited in the last 24 hours to avoid duplicate counting
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const existingVisitor = data.visitors.find(
      v => v.ip === ip && v.visitedAt > yesterday
    );
    
    if (!existingVisitor) {
      const newVisitor: VisitorRecord = {
        ip,
        visitedAt: now,
        userAgent,
      };
      data.visitors.push(newVisitor);
      
      // Keep only last 30 days of visitor data to prevent file from growing too large
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      data.visitors = data.visitors.filter(v => v.visitedAt > thirtyDaysAgo);
      
      await this.writeData(data);
    }
  }

  async getVisitorStats(): Promise<VisitorStats> {
    const data = await this.readData();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    return {
      totalVisitors: data.visitors.length,
      todayVisitors: data.visitors.filter(v => v.visitedAt >= today).length,
      thisWeekVisitors: data.visitors.filter(v => v.visitedAt >= thisWeek).length,
      thisMonthVisitors: data.visitors.filter(v => v.visitedAt >= thisMonth).length,
    };
  }
}

export const storage = new FileStorage();