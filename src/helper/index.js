import jwt from "jsonwebtoken";

export const createToken = (email, secret, expiresIn) => {
    return jwt.sign({ email }, secret, { expiresIn });
}

export const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch {
        return null;
    }
}