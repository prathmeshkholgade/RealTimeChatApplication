import { Router } from "express";
import wrapAsync from "../utils/wrapAscyn.js";
import Project from "../models/projectModel.js";
import { verifyUser } from "../middleware/middleware.js";
import ExpressError from "../utils/ExpressError.js";
import * as projectController from "../controllers/projectController.js";
const router = Router();

router.post("/add", verifyUser, wrapAsync(projectController.addNewProject));
router.put(
  "/add-user",
  verifyUser,
  wrapAsync(projectController.addUserToTheProject)
);

router.get("/get-project/:id", wrapAsync(projectController.getProjectById));
router.get("/all", verifyUser, wrapAsync(projectController.getAllProject));

export default router;
