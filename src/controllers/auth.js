import authService from "../services/auth.js";
import userService from "../services/user.js";
import { createToken, verifyToken } from "../helper/index.js";
import { ResponseError } from "../helper/response-error.js";

const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 day in miliseconds

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await authService.register({ email, password });

        const accessToken = createToken(user.email, process.env.ACCESS_TOKEN_SECRET, '1h');
        const refreshToken = createToken(user.email, process.env.REFRESH_TOKEN_SECRET, '7d');

        res.cookie("refreshToken", refreshToken, {
            maxAge,
            signed: true,
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.status(201).json({
            accessToken,
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

        const user = await authService.login({ email, password });

        const accessToken = createToken(user.email, process.env.ACCESS_TOKEN_SECRET, '1h');
        const refreshToken = createToken(user.email, process.env.REFRESH_TOKEN_SECRET, '7d');

        res.cookie("refreshToken", refreshToken, {
            maxAge,
            signed: true,
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.status(200).json({
            accessToken,
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

const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.signedCookies.refreshToken;

        if (!refreshToken) {
            throw new ResponseError(401, "Invalid refresh token", null);
        }

        const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!decoded || !decoded.email) {
            throw new ResponseError(401, "Invalid refresh token", null);
        }

        const user = await userService.findUserByEmail(decoded.email);

        if (!user) {
            throw new ResponseError(401, "User not found", null);
        }

        const newAccessToken = createToken(decoded.email, process.env.ACCESS_TOKEN_SECRET, '1h');

        res.json({
            accessToken: newAccessToken,
            data:  {
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
    login,
    refreshAccessToken
}