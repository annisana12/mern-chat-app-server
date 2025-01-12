import User from "../src/models/user.js";
import userService from "../src/services/user.js";
import path from 'path';
import fs from "fs";

export const removeUser = async (email) => {
    await User.deleteMany({ email });
}

export const addUser = async (data) => {
    await User.create(data);
}

export const updateUserProfileImage = async (userId) => {
    const filePath = path.join(__dirname, './assets/avatar.jpg');
    const fileBuffer = fs.readFileSync(filePath);

    const imagePath = await userService.saveProfileImage(fileBuffer, userId);

    await User.updateOne({ _id: userId }, { profileImage: imagePath });
}