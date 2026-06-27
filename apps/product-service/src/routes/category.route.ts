import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategorys,
  updateCategory,
} from "../controllers/category.controller";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", shouldBeAdmin, createCategory);

router.get("/", getCategorys);
router.get("/:id", getCategory);

router.put("/:id", shouldBeAdmin, updateCategory);

router.delete("/:id", shouldBeAdmin, deleteCategory);

export default router;
