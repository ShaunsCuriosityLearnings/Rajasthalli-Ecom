import { Request, Response } from "express";
import { Order } from "@repo/orderdb";
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from "../services/email.service.js";

export const sendOrderConfirmation = async (req: Request, res: Response) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: "orderId is required" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`[Email Service] Order not found for ID: ${orderId}`);
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    console.log(`[Email Service] Sending confirmation email to: ${order.email}`);
    await sendOrderConfirmationEmail(order);
    return res.status(200).json({ success: true, message: "Confirmation email sent" });
  } catch (error: any) {
    console.error(`[Email Service] Failed to send order confirmation email for ${orderId}:`, error.message || error);
    return res.status(500).json({ success: false, message: error.message || "Failed to send email" });
  }
};

export const sendOrderStatusUpdate = async (req: Request, res: Response) => {
  const { orderId, status } = req.body;
  if (!orderId || !status) {
    return res.status(400).json({ success: false, message: "orderId and status are required" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`[Email Service] Order not found for ID: ${orderId}`);
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    console.log(`[Email Service] Sending status update (${status}) email to: ${order.email}`);
    await sendOrderStatusUpdateEmail(order, status);
    return res.status(200).json({ success: true, message: "Status update email sent" });
  } catch (error: any) {
    console.error(`[Email Service] Failed to send status update email for ${orderId}:`, error.message || error);
    return res.status(500).json({ success: false, message: error.message || "Failed to send email" });
  }
};
