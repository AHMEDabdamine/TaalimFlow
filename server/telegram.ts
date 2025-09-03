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
🆕 <b>طلب تواصل جديد / Nouvelle soumission de contact / New Contact Submission</b>
👤 <b>الاسم / Nom / Name:</b> ${submission.name}
📧 <b>البريد الإلكتروني / Email:</b> ${submission.email}
📱 <b>الهاتف / Téléphone / Phone:</b> ${
      submission.phone || "غير مُقدم / Non fourni / Not provided"
    }
🏫 <b>المدرسة / École / School:</b> ${
      submission.schoolName || "غير مُقدم / Non fourni / Not provided"
    }
💬 <b>الرسالة / Message:</b> ${
      submission.message || "لا توجد رسالة / Aucun message / No message"
    }
🕐 <b>تم الإرسال في / Soumis le / Submitted at:</b> ${new Date().toLocaleString(
      "ar-SA"
    )}
    `.trim();
  }

  formatDemoRequest(request: any): string {
    return `
🎯 <b>طلب عرض توضيحي جديد</b>
👤 <b>الاسم:</b> ${request.name}
📧 <b>البريد الإلكتروني:</b> ${request.email}
📱 <b>الهاتف:</b> ${request.phone || "غير مُقدم"}
🏫 <b>المدرسة:</b> ${request.schoolName || "غير مُقدم"}
🏷️ <b>نوع المدرسة:</b> ${request.schoolType || "غير مُقدم"}
👥 <b>عدد الطلاب:</b> ${request.numberOfStudents || "غير مُقدم"}
🕐 <b>تم الإرسال في:</b> ${new Date().toLocaleString("fr-FR")}
    `.trim();
  }
}

export const telegramService = new TelegramBotService();
