import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new ApiError(400, "unauthorized access");
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(401, "unauthorized access");
  }
  req.user = user;
  next();
});

export {verifyJWT};