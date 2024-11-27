import mongoose from "mongoose";
import { logger } from "./logging.js";

export const connectDB = async () => {
    try {
        const databaseURL = process.env.DATABASE_URL;

        await mongoose.connect(databaseURL);
    } catch (error) {
        logger.error("Can't connect to database", { stack: error.stack });
        process.exit(1);
    }
}