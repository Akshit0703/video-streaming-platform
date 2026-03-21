import { UserSchema } from "../models/user.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const User = UserSchema.findById(userId);
    const accessToken = User.generateAccessToken();
    const refreshToken = User.generateRefreshToken();

    User.refreshToken = refreshToken;
    await User.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong when trying to generate access and refresh token"
    );
  }
};

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

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "Username or Email does not exist");
  }

  const User = UserSchema.findOne({
    $or: [{ username }, { email }],
  });

  if (!User) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await User.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(User._id);

  const loggedInUser = await User.findById(User._id).select(
    "-password -refreshToken"
  );

  const options = {
    // options is configuration for cookies
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    // options is configuration for cookies
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User Logged Out"));
});

export { registerUser, loginUser, logoutUser };
