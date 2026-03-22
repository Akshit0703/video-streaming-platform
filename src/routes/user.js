import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
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

export default userRouter;
