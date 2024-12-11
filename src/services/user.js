import validation from "../validation/index.js";
import userValidation from "../validation/user.js";
import User from "../models/user.js";
import { ResponseError } from "../helper/response-error.js";
import { compare } from "bcrypt";

const findUserByEmail = async (email) => {
    const user = await User.findOne({ email }).lean();
    return user;
}

const register = async (data) => {
    const validationSchema = userValidation.authSchema();
    const validInput = validation.validate(validationSchema, data);

    const existingUser = await findUserByEmail(validInput.email);

    if (existingUser) {
        throw new ResponseError(400, "Email already used", null);
    }

    const user = await User.create(validInput);
    return user;
}

const login = async (data) => {
    const validationSchema = userValidation.authSchema();
    const validInput = validation.validate(validationSchema, data);

    const user = await findUserByEmail(validInput.email);

    if (!user || !(await compare(validInput.password, user.password))) {
        throw new ResponseError(401, "Email or Password is incorrect", null);
    }

    return user;
}

export default {
    register,
    login,
    findUserByEmail
}