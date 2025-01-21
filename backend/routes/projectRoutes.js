import { Router } from "express";
import wrapAsync from "../utils/wrapAscyn.js";
import Project from "../models/projectModel.js";
import { verifyUser } from "../middleware/middleware.js";
import ExpressError from "../utils/ExpressError.js";
const router = Router();

router.post(
  "/add",
  verifyUser,
  wrapAsync(async (req, res, next) => {
    const { projectName } = req.body;
    const project = new Project({ name: projectName });
    console.log("user loged in id", req.user._id);
    project.users = req.user?._id;
    await project.save();
    res.status(200).json({ project });
  })
);
router.put(
  "/add-user",
  verifyUser,
  wrapAsync(async (req, res, next) => {
    const { projectId, user } = req.body;
    console.log("this is data which you are sending", req.body);
    if (!projectId || !user) {
      return next(new ExpressError(401, "enter valid details"));
    }
    const loggedInUser = req.user._id;
    console.log("this is the logged in user", loggedInUser);
    const project = await Project.findOne({
      _id: projectId,
      users: loggedInUser,
    });
    if (!project) {
      return next(new ExpressError(404, "user not belong to this project"));
    }
    const updateProject = await Project.findByIdAndUpdate(
      { _id: projectId },
      {
        $addToSet: {
          users: user,
        },
      },
      { new: true }
    );
    res.status(200).send(updateProject);
  })
);

router.get(
  "/get-project/:id",
  wrapAsync(async (req, res, next) => {
    console.log(req.params);
    const { id } = req.params;
    const project = await Project.findById(id).populate("users");
    if (!project) {
      return next(new ExpressError(404, "project not found"));
    }
    res.status(200).json(project);
  })
);
router.get(
  "/all",
  verifyUser,
  wrapAsync(async (req, res, next) => {
    const loggedInUser = req.user._id;
    const allProject = await Project.find({ users: loggedInUser });
    res.status(200).json({ allProject });
  })
);

export default router;
