import { Router } from "express";
import * as ai from "../service/AiService.js";
const router = Router();

router.get("/get-result", async (req, res, next) => {
  const { prompt } = req.query;
  const result = await ai.getAiResult(prompt);
  res.status(200).json(result);
});

export default router;
