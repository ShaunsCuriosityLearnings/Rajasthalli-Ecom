import { Request, Response } from "express";
import { sendMail } from "../services/email.service.js";

export const sendCustomEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, text, html } = req.body;
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: to, subject, and either text or html",
      });
    }

    const info = await sendMail({ to, subject, text, html });
    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error("[Email Controller] Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
    });
  }
};
