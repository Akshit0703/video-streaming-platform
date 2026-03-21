import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.js";
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

export default userRouter;
