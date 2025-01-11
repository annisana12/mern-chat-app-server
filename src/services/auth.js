import userService from "./user.js";
import User from "../models/user.js";
import { ResponseError } from "../helper/response-error.js";
import { compare } from "bcrypt";

const register = async (data) => {
    const existingUser = await userService.findUserByEmail(data.email);

    if (existingUser) {
        throw new ResponseError(400, "Email already used", null);
    }

    const user = await User.create(data);
    return user;
}

const login = async (data) => {
    const user = await userService.findUserByEmail(data.email);

    if (!user || !(await compare(data.password, user.password))) {
        throw new ResponseError(401, "Email or Password is incorrect", null);
    }

    return user;
}

export default {
    register,
    login
}