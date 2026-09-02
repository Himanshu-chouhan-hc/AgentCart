import { Router } from "express";
import { aiProductSearch } from "../controllers/ai.controller.js";
import { aiRecommendation } from "../controllers/aiRecommendation.controller.js";
import { aiChat } from "../controllers/aiChat.controller.js";

const router = Router();

router.post("/search", aiProductSearch);
router.post("/recommend", aiRecommendation);
router.post("/chat", aiChat);

export default router;