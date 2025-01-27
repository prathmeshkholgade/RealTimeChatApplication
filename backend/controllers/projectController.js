import Project from "../models/projectModel.js";
import ExpressError from "../utils/ExpressError.js";
export const getAllProject = async (req, res, next) => {
  const loggedInUser = req.user._id;
  const allProject = await Project.find({ users: loggedInUser });
  res.status(200).json({ allProject });
};
export const addNewProject = async (req, res, next) => {
  const { projectName } = req.body;
  const project = new Project({ name: projectName });
  project.users = req.user?._id;
  await project.save();
  res.status(200).json({ project });
};
export const addUserToTheProject = async (req, res, next) => {
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
};
export const getProjectById = async (req, res, next) => {
  console.log(req.params);
  const { id } = req.params;
  const project = await Project.findById(id).populate("users");
  if (!project) {
    return next(new ExpressError(404, "project not found"));
  }
  res.status(200).json(project);
};
