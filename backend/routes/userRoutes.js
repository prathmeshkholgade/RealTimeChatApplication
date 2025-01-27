import { Router } from "express";
import wrapAsync from "../utils/wrapAscyn.js";
import { verifyUser } from "../middleware/middleware.js";
import * as userController from "../controllers/userController.js";
const router = Router();

router.post("/register", userController.registerUser);

router.post("/login", wrapAsync(userController.loginUser));

router.get("/all-user", verifyUser, userController.allUsers);

router.get("/profile", verifyUser, userController.userProfile);

router.get("/logout", userController.logoutUser);

export default router;
