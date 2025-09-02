"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertDemoRequestSchema = exports.insertContactSubmissionSchema = void 0;
const zod_1 = require("zod");
// Zod schemas for validation
exports.insertContactSubmissionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Valid email is required"),
    phone: zod_1.z.string().optional(),
    schoolName: zod_1.z.string().optional(),
    message: zod_1.z.string().optional(),
});
exports.insertDemoRequestSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Valid email is required"),
    phone: zod_1.z.string().optional(),
    schoolName: zod_1.z.string().optional(),
    schoolType: zod_1.z.string().optional(),
    numberOfStudents: zod_1.z.string().optional(),
});
