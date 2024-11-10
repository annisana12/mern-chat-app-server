import { Router } from "express";
import userController from "../controllers/user.js";

const userRouter = Router();

userRouter.post("/register", userController.register);

export default userRouter;