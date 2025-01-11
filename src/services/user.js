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

const updateProfile = async (data) => {
    const { name, bgColor, file, userId } = data;
    let imagePath;

    if (file) {
        const resizedImage = await sharp(file.buffer)
            .resize(512, 512)
            .toFormat('jpg')
            .jpeg({ mozjpeg: true })
            .toBuffer();

        const path = `${userId}.jpg`;

        const options = {
            contentType: 'image/jpeg',
            upsert: true
        };

        const uploadedImage = await uploadFile('profile_picture', path, resizedImage, options);

        imagePath = uploadedImage.path;
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
        const { signedUrl } = await createFileSignUrl(
            'profile_picture',
            user.profileImage,
            3600,
            {
                transform: {
                    width: 96,
                    height: 96
                }
            }
        );
        
        imageUrl = signedUrl;
    }


    return imageUrl;
}

export default {
    findUserByEmail,
    findUserById,
    updateProfile,
    getProfileImageUrl
}