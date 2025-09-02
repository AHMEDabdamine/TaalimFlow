"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegramService = exports.TelegramBotService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class TelegramBotService {
    constructor(botToken, chatId) {
        this.botToken = botToken || process.env.TELEGRAM_BOT_TOKEN || "";
        this.chatId = chatId || process.env.TELEGRAM_CHAT_ID || "";
    }
    async sendNotification(message) {
        if (!this.botToken || !this.chatId) {
            console.log("Telegram not configured. Message would be:", message);
            return;
        }
        try {
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            const response = await (0, node_fetch_1.default)(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: message,
                    parse_mode: "HTML",
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Telegram API error:", errorText);
                throw new Error(`Telegram API error: ${response.status}`);
            }
            console.log("Telegram notification sent successfully");
        }
        catch (error) {
            console.error("Failed to send Telegram notification:", error);
            throw error;
        }
    }
    formatContactSubmission(submission) {
        return `
🆕 <b>Nouvelle soumission de contact / New Contact Submission</b>

👤 <b>Nom/Name:</b> ${submission.name}
📧 <b>Email:</b> ${submission.email}
📱 <b>Téléphone/Phone:</b> ${submission.phone || "Non fourni/Not provided"}
🏫 <b>École/School:</b> ${submission.schoolName || "Non fourni/Not provided"}
💬 <b>Message:</b> ${submission.message || "Aucun message/No message"}
🕐 <b>Soumis le/Submitted at:</b> ${new Date().toLocaleString("fr-FR")}
    `.trim();
    }
    formatDemoRequest(request) {
        return `
🎯 <b>Nouvelle demande de démonstration / New Demo Request</b>

👤 <b>Nom/Name:</b> ${request.name}
📧 <b>Email:</b> ${request.email}
📱 <b>Téléphone/Phone:</b> ${request.phone || "Non fourni/Not provided"}
🏫 <b>École/School:</b> ${request.schoolName || "Non fourni/Not provided"}
🏷️ <b>Type d'école/School Type:</b> ${request.schoolType || "Non fourni/Not provided"}
👥 <b>Nombre d'étudiants/Students:</b> ${request.numberOfStudents || "Non fourni/Not provided"}
🕐 <b>Soumis le/Submitted at:</b> ${new Date().toLocaleString("fr-FR")}
    `.trim();
    }
}
exports.TelegramBotService = TelegramBotService;
exports.telegramService = new TelegramBotService();
