import { verifyToken } from "../helper/index.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid access token' });
    }

    const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded || !decoded.email) {
        return res.status(401).json({ message: 'Invalid access token' });
    }

    req.user = decoded;
    next();
}