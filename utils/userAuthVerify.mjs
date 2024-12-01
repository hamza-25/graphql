import jwt from 'jsonwebtoken';

export const userAuth = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        return decoded.userId;
    } catch (error) {
        throw new Error(`invalid token`);
    }
};