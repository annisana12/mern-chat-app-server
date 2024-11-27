import { Router } from "express";
import userController from "../controllers/user.js";

const router = Router();

router.post("/register", userController.register);

export default router;