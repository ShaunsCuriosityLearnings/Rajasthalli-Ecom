import { Router } from "express";

import {
  createMaincategory,
  deleteMaincategory,
  getMaincategory,
  getMaincategorys,
  updateMaincategory,
} from "../controllers/maincategory.controllers";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", shouldBeAdmin, createMaincategory);

router.get("/", getMaincategorys);
router.get("/:id", getMaincategory);

router.put("/:id", shouldBeAdmin, updateMaincategory);

router.delete("/:id", shouldBeAdmin, deleteMaincategory);

export default router;
