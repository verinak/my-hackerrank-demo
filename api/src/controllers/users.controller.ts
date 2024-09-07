import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { getAllUsers, getUserById, getUserByEmail, createUser, updateUserPassword } from '../models/users.model'
import { IUser } from '../interfaces/users.interface';
import { IApiResponse } from '../interfaces/api-response.interface';
import { ResponseHelper } from '../helpers/api-response.helper';
import { generateToken, decodeToken } from '../helpers/jwt-auth.helper';

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

// sign up
export const createNewUser = async (req: Request<{}, {}, IUser, {}>, res: Response<IApiResponse<{token: string} | null>, {}>): Promise<void> => {
    try {
        const newUser: IUser = req.body;

        // if a user is registered with this email, return 400 bad request
        const oldUser: IUser | null = await getUserByEmail(newUser.email);
        if (oldUser) {
            res.status(400).json(ResponseHelper.badRequest("Email is already registered."));
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
        newUser.password = hashedPassword;
        
        // insert user in database
        const result: ObjectId = await createUser(newUser);

        // generate token
        const token = generateToken({id: result.toString(), role: "user"});
        res.status(201).json(ResponseHelper.created<{token: string}>({token: token}));

    }
    catch(err) {
        res.status(500).json(ResponseHelper.internalServerError(`An error occured: ${err}`));
    }
}

// login
export const getRegisteredUser = async (req: Request<{}, {}, {email: string, password: string}, {}>, res: Response<IApiResponse<{ token: string } | null>, {}>): Promise<void> => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    // get user by email
    const user: IUser | null = await getUserByEmail(email);

    // no user found with this email, return 404 Not Found
    if (!user) {
        res.status(404).json(ResponseHelper.notFound());
        return;
    }

    // user found, compare hashed passwords
    try {
        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        // incorrect password, return 401 unauthorized
        if (!isMatch) {
            res.status(401).json(ResponseHelper.unauthorized("Invalid password."));
            return;
        }
        
        // generate token
        let role = "user";
        // for testing purposes, until admin feature are implemented
        if(user.email == "verinamichelk@gmail.com") {
            role = "admin";
        }
        const token = generateToken({id: user._id!.toString(), role: role});
        res.status(200).json(ResponseHelper.ok<{token: string}>({token: token}));
    }
    catch (err) {
        res.status(500).json(ResponseHelper.internalServerError(`An error occured: ${err}`));
    }

}

// get all
export const getAll = async (req: Request, res: Response<IApiResponse<IUser[] | null>, {}>): Promise<void> => {
    const users: IUser[] = await getAllUsers();
    if(users.length !== 0) {
        res.status(200).json(ResponseHelper.ok<IUser[]>(users));
    }
    else {
        res.status(404).json(ResponseHelper.notFound());
    }
}

// get user data
export const getUserData = async (req: Request, res: Response<IApiResponse<{username: string, email: string} | null>, {}>): Promise<void> => {
    const decodedToken = decodeToken(req);
    if(!decodedToken) {
        res.status(401).json(ResponseHelper.unauthorized("Access denied. No token provided."));
        return;
    }

    const user = await getUserById(decodedToken.id);
    if(!user) {
        res.status(404).json(ResponseHelper.notFound());
        return;
    }

    const {username, email} = user;
    res.status(200).json(ResponseHelper.ok<{username: string, email: string}>({username, email}));

}



// change user password
export const updatePassword = async (req: Request<{}, {}, {_id: string, password: string}, {}>, res: Response): Promise<void> => {
    // decode token
    const decodedToken = decodeToken(req);
    if(!decodedToken) {
        res.status(401).json(ResponseHelper.unauthorized("Access denied. No token provided."));
        return;
    }
    
    const userId: string = decodedToken!.id;
    const password: string = req.body.password;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result: number | null = await updateUserPassword(userId, hashedPassword);

        res.status(200).json(ResponseHelper.ok<Object>({updatedCount: result}));
    }
    catch (err) {
        res.status(500).json(ResponseHelper.internalServerError(`An error occured: ${err}`));
    }

}



