import { UserSchema } from "../models/user.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("req");
  const { fullname, email, username, password } = req.body;

  if (
    [fullname, email, username, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await UserSchema.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path; // this is possible due to using multer in the middleware
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage && req.files.coverImage.length > 0)
  ) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath); //returns cloudinary url
  const coverImage = await uploadOnCloudinary(coverImageLocalPath); //return cloudinary url

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const User = await UserSchema.create({
    fullname,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "", // edge case if no coverimage is given since it is not required in the db
    email: email,
    password: password,
    username: username.toLowerCase(), // for consistency
  });

  const createdUser = await UserSchema.findOne(User._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
