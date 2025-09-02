import { z } from "zod";

// Zod schemas for validation
export const insertContactSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  schoolName: z.string().optional(),
  message: z.string().optional(),
});

export const insertDemoRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  schoolName: z.string().optional(),
  schoolType: z.string().optional(),
  numberOfStudents: z.string().optional(),
});

// Types
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  schoolName?: string;
  message?: string;
  submittedAt: string;
  isRead: string;
  status: string;
}

export interface DemoRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  schoolName?: string;
  schoolType?: string;
  numberOfStudents?: string;
  submittedAt: string;
  isRead: string;
  status: string;
}