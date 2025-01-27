import { Router } from "express";
import { getAiResultController } from "../controllers/aiController.js";

const router = Router();

router.get("/get-result", getAiResultController);

export default router;
