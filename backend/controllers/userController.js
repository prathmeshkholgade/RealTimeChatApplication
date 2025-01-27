import User from "../models/userModel.js";
import ExpressError from "../utils/ExpressError.js";

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ExpressError(400, "please enter both email and password"));
  }
  const ifUser = await User.findOne({ email });
  if (ifUser) {
    return next(new ExpressError(400, "this email aready exist"));
  }
  const hasedPassword = await User.hashPassword(password);
  const newUser = new User({ email, password: hasedPassword });
  await newUser.save();
  const token = await newUser.generateToken();
  delete newUser._doc.password;
  res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
  res.status(200).json({ user: newUser, token });
};
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ExpressError(400, "please enter both email and password"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ExpressError(400, "email or password is incorrect"));
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ExpressError(400, "email or password is incorrect"));
  }
  const token = await user.generateToken();
  delete user._doc.password;
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 3600000,
    secure: true, // Required for HTTPS
    sameSite: "None",
  });
  res.status(200).json({ user, token });
};

export const allUsers = async (req, res) => {
  const loggedInUser = req.user._id;
  const allUsers = await User.find({ _id: { $ne: loggedInUser } });
  res.status(200).json(allUsers);
  // .select("-password");
};

export const userProfile = (req, res) => {
  const user = req.user;
  res.status(200).json({ user });
};
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  req.user = "";
  res.status(200).json({ message: "logout successfully" });
};
