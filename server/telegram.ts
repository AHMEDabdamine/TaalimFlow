import fetch from "node-fetch";

export interface TelegramService {
  sendNotification(message: string): Promise<void>;
}

export class TelegramBotService implements TelegramService {
  private botToken: string;
  private chatIds: string[];

  constructor(botToken?: string, chatIds?: string | string[]) {
    this.botToken = botToken || process.env.TELEGRAM_BOT_TOKEN || "";

    // Support both single chat ID and multiple chat IDs
    if (Array.isArray(chatIds)) {
      this.chatIds = chatIds;
    } else if (chatIds) {
      this.chatIds = [chatIds];
    } else {
      // Check for multiple chat IDs in environment (comma-separated)
      const envChatIds =
        process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID || "";
      this.chatIds = envChatIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }
  }

  async sendNotification(message: string): Promise<void> {
    if (!this.botToken || this.chatIds.length === 0) {
      console.log("Telegram not configured. Message would be:", message);
      return;
    }

    const sendPromises = this.chatIds.map(async (chatId) => {
      try {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Telegram API error for chat ${chatId}:`, errorText);
          throw new Error(`Telegram API error: ${response.status}`);
        }

        console.log(
          `Telegram notification sent successfully to chat ${chatId}`
        );
      } catch (error) {
        console.error(
          `Failed to send Telegram notification to chat ${chatId}:`,
          error
        );
        throw error;
      }
    });

    try {
      // Send to all chat IDs in parallel
      await Promise.all(sendPromises);
      console.log(
        `Telegram notifications sent successfully to ${this.chatIds.length} recipient(s)`
      );
    } catch (error) {
      // If any fail, we still want to know about partial success
      console.error("Some Telegram notifications failed:", error);
      throw error;
    }
  }

  formatContactSubmission(submission: any): string {
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

  formatDemoRequest(request: any): string {
    return `
🎯 <b>Nouvelle demande de démonstration / New Demo Request</b>

👤 <b>Nom/Name:</b> ${request.name}
📧 <b>Email:</b> ${request.email}
📱 <b>Téléphone/Phone:</b> ${request.phone || "Non fourni/Not provided"}
🏫 <b>École/School:</b> ${request.schoolName || "Non fourni/Not provided"}
🏷️ <b>Type d'école/School Type:</b> ${
      request.schoolType || "Non fourni/Not provided"
    }
👥 <b>Nombre d'étudiants/Students:</b> ${
      request.numberOfStudents || "Non fourni/Not provided"
    }
🕐 <b>Soumis le/Submitted at:</b> ${new Date().toLocaleString("fr-FR")}
    `.trim();
  }
}

export const telegramService = new TelegramBotService();
