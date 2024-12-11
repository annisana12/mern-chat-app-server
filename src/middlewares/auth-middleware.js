import jwt from "jsonwebtoken";
import userService from "../services/user.js";

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch {
        return null;
    }
}

export const authMiddleware = async (req, res, next) => {
    const token = req.signedCookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await userService.findUserByEmail(decoded.email);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = {
        id: user._id,
        email: user.email,
        name: user.name,
        profileSetup: user.profileSetup
    };

    next();
}