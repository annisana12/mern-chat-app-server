import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { ResponseError } from "./response-error.js";

dotenv.config(); // Re-import here to enable reading environment variable

const supabaseURL = process.env.SUPABASE_PROJECT_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseURL, supabaseServiceRoleKey);

export const uploadFile = async (bucket, path, file, options = { cacheControl: '3600' }) => {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(
            path,
            file,
            options
        )

    if (error) {
        throw new ResponseError(400, error.message, error.details);
    }

    return data;
}

export const createFileSignUrl = async (bucket, path, expiresIn = 3600, options = {}) => {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .createSignedUrl(
            path,
            expiresIn,
            options
        )

    if (error) {
        throw new ResponseError(400, error.message, error.details);
    }

    return data;
}

export const deleteFile = async (bucket, paths) => {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .remove(paths)

    if (error) {
        throw new ResponseError(400, error.message, error.details);
    }

    return data;
}