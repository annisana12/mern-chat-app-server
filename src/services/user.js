import { createFileSignUrl, uploadFile } from "../helper/supabase-storage.js";
import User from "../models/user.js";
import sharp from 'sharp';

const findUserByEmail = async (email) => {
    const user = await User.findOne({ email }).lean();
    return user;
}

const findUserById = async (id) => {
    const user = await User.findById(id).lean();
    return user;
}

const saveProfileImage = async (fileBuffer, userId) => {
    const resizedImage = await sharp(fileBuffer)
        .resize(300, 300)
        .toFormat('jpg')
        .jpeg({ mozjpeg: true })
        .toBuffer();

    const path = `${userId}.jpg`;

    const options = {
        cacheControl: '3600',
        contentType: 'image/jpeg',
        upsert: true
    };

    const uploadedImage = await uploadFile('avatars', path, resizedImage, options);

    return uploadedImage.path;
}

const updateProfile = async (data) => {
    const { name, bgColor, file, userId } = data;
    let imagePath;

    if (file) {
        imagePath = await saveProfileImage(file.buffer, userId);
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            name,
            bgColor,
            profileImage: imagePath || null,
            profileSetup: true
        },
        { new: true }
    ).lean();

    return {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        name: user.name,
        bgColor: user.bgColor,
        profileImage: user.profileImage
    };
}

const getProfileImageUrl = async (userId) => {
    const user = await findUserById(userId);
    let imageUrl = null;

    if (user.profileImage) {
        const expiresIn = 7 * 24 * 60 * 60; // 7 days

        const { signedUrl } = await createFileSignUrl(
            'avatars',
            user.profileImage,
            expiresIn
        );

        // TODO: implement caching signedUrl in redis

        imageUrl = signedUrl;
    }

    return imageUrl;
}

export default {
    findUserByEmail,
    findUserById,
    saveProfileImage,
    updateProfile,
    getProfileImageUrl
}