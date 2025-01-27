import * as ai from "../service/AiService.js";
export const getAiResultController = async (req, res, next) => {
  const { prompt } = req.query;
  const result = await ai.getAiResult(prompt);
  console.log("this is result bro of ai", result);
  res.status(200).send(result);
};
