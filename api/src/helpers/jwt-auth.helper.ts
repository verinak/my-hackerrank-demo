import jwt from 'jsonwebtoken';

import { Request } from "express";
import { IUserToken } from '../interfaces/auth-token.interface';

export const generateToken = (user: IUserToken): string => {
    // get .env variables
    const secretKey = process.env.JWT_SECRET!;
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN,
    }

    const token = jwt.sign(user, secretKey, options);
    return token;
};

export const decodeToken = (req: Request): IUserToken => {
    // assuming that verifyToken middleware was used first
    const token = req.header("authorization")?.split(" ")[1];
    
    const decodedToken = <IUserToken>jwt.decode(token!);
    return decodedToken;
};



