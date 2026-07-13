import { Router } from "express";
import {
  getHeroSlides,
  createHeroSlide,
  deleteHeroSlide,
} from "../controllers/hero.controller.js";
import { shouldBeAdmin } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.get("/", getHeroSlides);
router.post("/", shouldBeAdmin, createHeroSlide);
router.delete("/:id", shouldBeAdmin, deleteHeroSlide);

export default router;
