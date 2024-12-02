import jwt from "jsonwebtoken";
import userService from "../services/user.js";

const maxAge = 1 * 24 * 60 * 60 * 1000; // 1 day in miliseconds

const createToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: maxAge / 1000 });
}

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userService.register({ email, password });
        const token = createToken(user.email);

        res.cookie("authToken", token, {
            maxAge,
            signed: true,
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.status(201).json({
            data: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup
            }
        });
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userService.login({ email, password });
        const token = createToken(user.email);

        res.cookie("authToken", token, {
            maxAge,
            signed: true,
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.status(200).json({
            data: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                name: user.name,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        next(error);
    }
}

export default {
    register,
    login
}