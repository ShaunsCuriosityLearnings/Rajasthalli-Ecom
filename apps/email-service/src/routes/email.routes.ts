import { Router } from "express";
import { sendOrderConfirmation, sendOrderStatusUpdate, sendCustomEmail } from "../controllers/email.controller.js";

const router: Router = Router();

router.post("/order-confirmation", sendOrderConfirmation);
router.post("/order-status-update", sendOrderStatusUpdate);
router.post("/send", sendCustomEmail);

export default router;
