import User from "../models/user.js";

const findUserByEmail = async (email) => {
    const user = await User.findOne({ email }).lean();
    return user;
}

export default {
    findUserByEmail
}