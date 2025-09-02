import { kv } from '@vercel/kv';
import {
  type ContactSubmission,
  type DemoRequest,
  type InsertContactSubmission,
  type InsertDemoRequest,
} from "../shared/schema";
import type { IStorage } from "./storage";

export class VercelKVStorage implements IStorage {
  private async getNextId(type: 'contact' | 'demo'): Promise<number> {
    const key = `next_${type}_id`;
    const currentId = await kv.get<number>(key) || 1;
    await kv.set(key, currentId + 1);
    return currentId;
  }

  // Contact submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = await this.getNextId('contact');
    const newSubmission: ContactSubmission = {
      id,
      ...submission,
      submittedAt: new Date().toISOString(),
      isRead: "false",
      status: "new",
    };
    
    await kv.set(`contact_submission:${id}`, newSubmission);
    
    // Add to list of all submissions
    const allIds = await kv.get<number[]>('contact_submission_ids') || [];
    allIds.push(id);
    await kv.set('contact_submission_ids', allIds);
    
    return newSubmission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    const allIds = await kv.get<number[]>('contact_submission_ids') || [];
    const submissions: ContactSubmission[] = [];
    
    for (const id of allIds) {
      const submission = await kv.get<ContactSubmission>(`contact_submission:${id}`);
      if (submission) {
        submissions.push(submission);
      }
    }
    
    return submissions.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async markContactSubmissionAsRead(id: number): Promise<void> {
    const submission = await kv.get<ContactSubmission>(`contact_submission:${id}`);
    if (submission) {
      submission.isRead = "true";
      await kv.set(`contact_submission:${id}`, submission);
    }
  }

  async updateContactSubmissionStatus(id: number, status: string): Promise<void> {
    const submission = await kv.get<ContactSubmission>(`contact_submission:${id}`);
    if (submission) {
      submission.status = status;
      await kv.set(`contact_submission:${id}`, submission);
    }
  }

  // Demo requests
  async createDemoRequest(request: InsertDemoRequest): Promise<DemoRequest> {
    const id = await this.getNextId('demo');
    const newRequest: DemoRequest = {
      id,
      ...request,
      submittedAt: new Date().toISOString(),
      isRead: "false",
      status: "new",
    };
    
    await kv.set(`demo_request:${id}`, newRequest);
    
    // Add to list of all requests
    const allIds = await kv.get<number[]>('demo_request_ids') || [];
    allIds.push(id);
    await kv.set('demo_request_ids', allIds);
    
    return newRequest;
  }

  async getAllDemoRequests(): Promise<DemoRequest[]> {
    const allIds = await kv.get<number[]>('demo_request_ids') || [];
    const requests: DemoRequest[] = [];
    
    for (const id of allIds) {
      const request = await kv.get<DemoRequest>(`demo_request:${id}`);
      if (request) {
        requests.push(request);
      }
    }
    
    return requests.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async markDemoRequestAsRead(id: number): Promise<void> {
    const request = await kv.get<DemoRequest>(`demo_request:${id}`);
    if (request) {
      request.isRead = "true";
      await kv.set(`demo_request:${id}`, request);
    }
  }

  async updateDemoRequestStatus(id: number, status: string): Promise<void> {
    const request = await kv.get<DemoRequest>(`demo_request:${id}`);
    if (request) {
      request.status = status;
      await kv.set(`demo_request:${id}`, request);
    }
  }
}

// Use Vercel KV in production, fallback to file storage in development
export const getStorage = (): IStorage => {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return new VercelKVStorage();
  }
  
  // Fallback to file storage for local development
  const { FileStorage } = require('./storage');
  return new FileStorage();
};
