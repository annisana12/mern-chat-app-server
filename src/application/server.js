import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../routes/user.js";
import { errorMiddleware } from "../middlewares/error-middleware.js";

dotenv.config();

export const app = express();

app.use(
    cors({
        origin: [process.env.CLIENT_URL],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

app.use("/api/user", userRouter);

app.use(errorMiddleware);