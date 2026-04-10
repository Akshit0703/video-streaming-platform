import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.js";
import { upload } from "../middleware/multer.js";
import { verifyJwt } from "../middleware/auth.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJwt, logoutUser);

userRouter.route("/refreshToken").post(refreshAccessToken);

userRouter.route("/changePassword").post(verifyJwt, changeCurrentPassword);

userRouter.route("/currentUser").get(verifyJwt, getCurrentUser);

userRouter.route("/updateAccount").patch(verifyJwt, updateAccountDetails);

userRouter
  .route("/avatar")
  .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);

userRouter
  .route("/coverImage")
  .patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage);

userRouter.route("/c/:username").get(verifyJwt, getUserChannelProfile);

userRouter.route("/history").get(verifyJwt, getWatchHistory);

export default userRouter;
