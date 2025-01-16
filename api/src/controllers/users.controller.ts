import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { getAllUsers, getUserById, getUserByEmail, createUser, updateUserPassword } from '../models/users.model'
import { getAllUserSubmissions } from '../models/submissions.model'
import { IUser } from '../interfaces/users.interface';
import { IApiResponse } from '../interfaces/api-response.interface';
import { ResponseHelper } from '../helpers/api-response.helper';
import { generateToken, decodeToken } from '../helpers/jwt-auth.helper';
import { ISubmission } from '../interfaces/submissions.interface';

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

// sign up
export const createNewUser = async (req: Request<{}, {}, IUser, {}>, res: Response , next: NextFunction) => {
    const newUser: IUser = req.body; // get user data from request body
    // check that user is not empty and contains all credentials
    if (!newUser || !newUser.email || !newUser.password || !newUser.username) {
        return res.status(400).json(ResponseHelper.badRequest("Invalid user data."));
    }

    // if a user is registered with this email, return 400 bad request
    const oldUser: IUser | null = await getUserByEmail(newUser.email);
    if (oldUser) {
        return res.status(400).json(ResponseHelper.badRequest("Email is already registered."));
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
        const newUserHashed = {...newUser};
        newUserHashed.password = hashedPassword;
        // insert user in database
        const result: ObjectId = await createUser(newUserHashed);
        next(); // login function
    }
    catch (err) {
        return res.status(500).json(ResponseHelper.internalServerError("An error occured. Unable to create user."));
    }
}

// login
export const getRegisteredUser = async (req: Request<{}, {}, { email: string, password: string }, {}>, res: Response<IApiResponse<{ token: string } | null>, {}>) => {
    // get user data from request body
    const email: string = req.body.email;
    const password: string = req.body.password;
    // check that email and password are not empty
    if (!email || !password) {
        return res.status(400).json(ResponseHelper.badRequest("Invalid user data."));
    }

    // no user found with this email, return 404 Not Found
    const user: IUser | null = await getUserByEmail(email);
    if (!user) {
        res.status(404).json(ResponseHelper.notFound());
        return;
    }

    // user found, compare hashed passwords
    try {
        const isMatch = await bcrypt.compare(password, user.password);
        // incorrect password, return 401 unauthorized
        if (!isMatch) {
            res.status(401).json(ResponseHelper.unauthorized("Invalid password."));
            return;
        }

        // for testing purposes, until admin feature is implemented in db
        let role = "user";
        if (user.email == "verinamichelk@gmail.com") {
            role = "admin";
        }
        // generate token
        const token = generateToken({ id: user._id!.toString(), role: role });
        return res.status(200).json(ResponseHelper.ok<{ token: string }>({ token: token }));
    }
    catch (err) {
        return res.status(500).json(ResponseHelper.internalServerError(`An error occured. Login failed.`));
    }

}

// get all
export const getAll = async (req: Request, res: Response<IApiResponse<IUser[] | null>, {}>) => {
    const users: IUser[] = await getAllUsers(); // get all users
    if (users.length === 0) {
        // if array is empty, return 404 not found
        return res.status(404).json(ResponseHelper.notFound());
    }
        // array is not empty, return found users
    return res.status(200).json(ResponseHelper.ok<IUser[]>(users));

}

// get user data
export const getUserData = async (req: Request, res: Response<IApiResponse<{ username: string, email: string } | null>, {}>) => {
    const decodedToken = decodeToken(req); // decode token
    
    // get user details
    const user = await getUserById(decodedToken.id);
    if (!user) {
        // if user is null, return 404 not found
        return res.status(404).json(ResponseHelper.notFound());
    }

    // user is not null, return username and email
    const { username, email } = user;
    return res.status(200).json(ResponseHelper.ok<{ username: string, email: string }>({ username, email }));

}

// change user password
export const updatePassword = async (req: Request<{}, {}, { _id: string, password: string }, {}>, res: Response) => {
    const decodedToken = decodeToken(req); // decode token
    const userId: string = decodedToken.id; // get user id from token
    const password: string = req.body.password; // get password from request body
    // check that password is not empty
    if (!password) {
        return res.status(400).json(ResponseHelper.badRequest("Invalid user data."));
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result: number | null = await updateUserPassword(userId, hashedPassword);

        return res.status(200).json(ResponseHelper.ok<Object>({ updatedCount: result }));
    }
    catch (err) {
        return res.status(500).json(ResponseHelper.internalServerError(`An error occured: ${err}`));
    }

}

// get user submissions
// get all user submissions
export const getUserSubmissions = async (req: Request<{}, IApiResponse<ISubmission[] | null>, {}, {}>, res: Response<IApiResponse<ISubmission[] | null>, {}>) => {
    const decodedToken = decodeToken(req); // decode token
    // get submissions by user id
    const submissions: ISubmission[] = await getAllUserSubmissions(decodedToken.id);
    if (submissions.length === 0) {
        // if array is empty, return 404 not found
        return res.status(404).json(ResponseHelper.notFound());
    }
    // array is not empty, return found submissions
    return res.status(200).json(ResponseHelper.ok<ISubmission[]>(submissions));

}



