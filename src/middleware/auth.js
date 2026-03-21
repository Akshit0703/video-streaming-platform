import { ApiError } from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import { Jwt } from "jsonwebtoken";
import { UserSchema } from "../models/user";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await UserSchema.findById(decodedToken?._id).select(
      "-password -refreshToken"
    ); // _id because it was used when creating the encoded token

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
