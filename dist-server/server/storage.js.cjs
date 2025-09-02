"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.FileStorage = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class FileStorage {
    constructor() {
        this.dataPath = path_1.default.join(process.cwd(), "data.json");
    }
    async readData() {
        try {
            const data = await promises_1.default.readFile(this.dataPath, "utf-8");
            return JSON.parse(data);
        }
        catch {
            return {
                contactSubmissions: [],
                demoRequests: [],
                nextContactId: 1,
                nextDemoId: 1,
            };
        }
    }
    async writeData(data) {
        await promises_1.default.writeFile(this.dataPath, JSON.stringify(data, null, 2));
    }
    // Contact submissions
    async createContactSubmission(submission) {
        const data = await this.readData();
        const newSubmission = {
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
    async getAllContactSubmissions() {
        const data = await this.readData();
        return data.contactSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }
    async markContactSubmissionAsRead(id) {
        const data = await this.readData();
        const index = data.contactSubmissions.findIndex(s => s.id === id);
        if (index !== -1) {
            data.contactSubmissions[index].isRead = "true";
            await this.writeData(data);
        }
    }
    async updateContactSubmissionStatus(id, status) {
        const data = await this.readData();
        const index = data.contactSubmissions.findIndex(s => s.id === id);
        if (index !== -1) {
            data.contactSubmissions[index].status = status;
            await this.writeData(data);
        }
    }
    // Demo requests
    async createDemoRequest(request) {
        const data = await this.readData();
        const newRequest = {
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
    async getAllDemoRequests() {
        const data = await this.readData();
        return data.demoRequests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }
    async markDemoRequestAsRead(id) {
        const data = await this.readData();
        const index = data.demoRequests.findIndex(r => r.id === id);
        if (index !== -1) {
            data.demoRequests[index].isRead = "true";
            await this.writeData(data);
        }
    }
    async updateDemoRequestStatus(id, status) {
        const data = await this.readData();
        const index = data.demoRequests.findIndex(r => r.id === id);
        if (index !== -1) {
            data.demoRequests[index].status = status;
            await this.writeData(data);
        }
    }
}
exports.FileStorage = FileStorage;
exports.storage = new FileStorage();
