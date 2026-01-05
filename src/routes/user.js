import { Router } from "express";
import { registerUser } from "../controllers/user";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(login);

export default userRouter;
