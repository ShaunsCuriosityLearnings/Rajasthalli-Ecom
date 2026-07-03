import { Router } from "express";
import { sendOrderConfirmation, sendOrderStatusUpdate } from "../controllers/email.controller.js";

const router: Router = Router();

router.post("/order-confirmation", sendOrderConfirmation);
router.post("/order-status-update", sendOrderStatusUpdate);

export default router;
