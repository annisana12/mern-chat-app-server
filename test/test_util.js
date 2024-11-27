import User from "../src/models/user.js";

export const removeUser = async (email) => {
    await User.deleteMany({ email });
}

export const addUser = async (data) => {
    await User.create(data);
}