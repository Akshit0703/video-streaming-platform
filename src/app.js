  import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extented: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import

import userRouter from "./routes/user.js";
import subscriptionRouter from "./routes/subscription.js";

app.use("/api/v1/users", userRouter); // passes control to the user router using middleware
app.use("/api/v1/subscription", subscriptionRouter);

export { app };
