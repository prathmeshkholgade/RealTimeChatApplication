import jwt from "jsonwebtoken";
import ExpressError from "../utils/ExpressError.js";
import User from "../models/userModel.js";

export const verifyUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.split(" ")[1];
    console.log("this is middleware token bro ", token);
    if (!token) {
      return next(new ExpressError(401, "Invalid Credientials"));
    }
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const user = await User.findOne({ email: decoded.email });
    req.user = user;
    console.log("this is decoded data", user);
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return next(new ExpressError(401, "Authentication Failed"));
  }
};
