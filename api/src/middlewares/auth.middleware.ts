import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserToken } from '../interfaces/auth-token.interface';
import { ResponseHelper } from '../helpers/api-response.helper';
import { decodeToken } from '../helpers/jwt-auth.helper';

// get .env variables
const secretKey = process.env.JWT_SECRET;

// middleware to verify token
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    // get token from request header
    const token = req.headers['authorization']?.split(' ')[1];

    
    // if no token is provided return 401 
    if (!token) {
        res.status(401).json(ResponseHelper.unauthorized("Access denied. No token provided."));
        return;
    }

    // verify token
    try {
        const decodedToken = <IUserToken>jwt.verify(token, secretKey!);
        // console.log(decodedToken);
        next();
    }
    catch (err) {
        // console.log(err);
        res.status(403).json(ResponseHelper.forbidden("Invalid token."));
        return;
    }
};


// middleware to verify if user has admin privilege
export const verifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const decodedToken = decodeToken(req);
    if(!decodedToken) {
        res.status(401).json(ResponseHelper.unauthorized("Access denied. No token provided."));
        return;
    }
    
    if(decodedToken!.role != "admin") {
        res.status(403).json(ResponseHelper.forbidden("Forbidden. You don't have access to this resource."));
        return;
    }

    next();

};



