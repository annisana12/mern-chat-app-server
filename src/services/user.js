import validation from "../validation/index.js";
import userValidation from "../validation/user.js";
import User from "../models/user.js";
import { ResponseError } from "../helper/response-error.js";

const register = async (data) => {
    const validationSchema = userValidation.authSchema();
    const validInput = validation.validate(validationSchema, data);

    const existingUser = await User.findOne({ email: validInput.email }).exec();

    if (existingUser) {
        throw new ResponseError(400, "Email already used", null);
    }

    const user = await User.create(validInput);
    return user;
}

export default {
    register
}