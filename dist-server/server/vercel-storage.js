"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorage = exports.VercelKVStorage = void 0;
const kv_1 = require("@vercel/kv");
class VercelKVStorage {
    async getNextId(type) {
        const key = `next_${type}_id`;
        const currentId = await kv_1.kv.get(key) || 1;
        await kv_1.kv.set(key, currentId + 1);
        return currentId;
    }
    // Contact submissions
    async createContactSubmission(submission) {
        const id = await this.getNextId('contact');
        const newSubmission = {
            id,
            ...submission,
            submittedAt: new Date().toISOString(),
            isRead: "false",
            status: "new",
        };
        await kv_1.kv.set(`contact_submission:${id}`, newSubmission);
        // Add to list of all submissions
        const allIds = await kv_1.kv.get('contact_submission_ids') || [];
        allIds.push(id);
        await kv_1.kv.set('contact_submission_ids', allIds);
        return newSubmission;
    }
    async getAllContactSubmissions() {
        const allIds = await kv_1.kv.get('contact_submission_ids') || [];
        const submissions = [];
        for (const id of allIds) {
            const submission = await kv_1.kv.get(`contact_submission:${id}`);
            if (submission) {
                submissions.push(submission);
            }
        }
        return submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }
    async markContactSubmissionAsRead(id) {
        const submission = await kv_1.kv.get(`contact_submission:${id}`);
        if (submission) {
            submission.isRead = "true";
            await kv_1.kv.set(`contact_submission:${id}`, submission);
        }
    }
    async updateContactSubmissionStatus(id, status) {
        const submission = await kv_1.kv.get(`contact_submission:${id}`);
        if (submission) {
            submission.status = status;
            await kv_1.kv.set(`contact_submission:${id}`, submission);
        }
    }
    // Demo requests
    async createDemoRequest(request) {
        const id = await this.getNextId('demo');
        const newRequest = {
            id,
            ...request,
            submittedAt: new Date().toISOString(),
            isRead: "false",
            status: "new",
        };
        await kv_1.kv.set(`demo_request:${id}`, newRequest);
        // Add to list of all requests
        const allIds = await kv_1.kv.get('demo_request_ids') || [];
        allIds.push(id);
        await kv_1.kv.set('demo_request_ids', allIds);
        return newRequest;
    }
    async getAllDemoRequests() {
        const allIds = await kv_1.kv.get('demo_request_ids') || [];
        const requests = [];
        for (const id of allIds) {
            const request = await kv_1.kv.get(`demo_request:${id}`);
            if (request) {
                requests.push(request);
            }
        }
        return requests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }
    async markDemoRequestAsRead(id) {
        const request = await kv_1.kv.get(`demo_request:${id}`);
        if (request) {
            request.isRead = "true";
            await kv_1.kv.set(`demo_request:${id}`, request);
        }
    }
    async updateDemoRequestStatus(id, status) {
        const request = await kv_1.kv.get(`demo_request:${id}`);
        if (request) {
            request.status = status;
            await kv_1.kv.set(`demo_request:${id}`, request);
        }
    }
}
exports.VercelKVStorage = VercelKVStorage;
// Use Vercel KV in production, fallback to file storage in development
const getStorage = () => {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        return new VercelKVStorage();
    }
    // Fallback to file storage for local development
    const { FileStorage } = require('./storage');
    return new FileStorage();
};
exports.getStorage = getStorage;
