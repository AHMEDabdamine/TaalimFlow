import {
  type ContactSubmission,
  type DemoRequest,
  type InsertContactSubmission,
  type InsertDemoRequest,
} from "../shared/schema";
import fs from "fs/promises";
import path from "path";

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
}

interface FileData {
  contactSubmissions: ContactSubmission[];
  demoRequests: DemoRequest[];
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
}

export const storage = new FileStorage();