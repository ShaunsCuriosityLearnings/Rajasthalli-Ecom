import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { createPaymentSession, verifyPayment } from "../controllers/payment.controller.js";

export const paymentRoute = new Hono();

paymentRoute.post("/create-session", shouldBeUser, createPaymentSession);
paymentRoute.get("/verify/:orderId", verifyPayment);
