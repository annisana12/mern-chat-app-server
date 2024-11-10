import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/helper/database.js";
import errorMiddleware from "./src/middlewares/error.js";
import userRouter from "./src/routes/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: [process.env.CLIENT_URL],
        methods: ["GET", "POST"],
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

app.use("/user", userRouter);

app.use(errorMiddleware);

await connectDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});