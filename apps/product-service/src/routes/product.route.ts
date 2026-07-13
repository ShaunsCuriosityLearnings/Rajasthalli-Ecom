import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  logPaymentProcessed,
  bulkUploadProducts,
} from "../controllers/product.controller.js";
import { shouldBeAdmin } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/", shouldBeAdmin, createProduct);
router.post("/bulk-upload", shouldBeAdmin, bulkUploadProducts);
router.put("/:id", shouldBeAdmin, updateProduct);
router.delete("/:id", shouldBeAdmin, deleteProduct);
router.post("/payment-processed", logPaymentProcessed);
router.get("/:id", getProduct);
router.get("/", getProducts);

export default router;
