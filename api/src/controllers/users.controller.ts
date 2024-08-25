import { Request, Response } from 'express';
// import { v4 as uuidv4 } from "uuid";
import { ObjectId } from 'mongodb';

import { getAllUsers, getUserById, getUserByCredentials, createUser } from '../models/users.model'
import { IUser } from '../interfaces/users.interface';
import { IApiResponse } from '../interfaces/api-response.interface';
import { ResponseHelper } from '../helpers/api-response.helper';


// get all
export const getAll = async (req: Request, res: Response<IApiResponse<IUser[] | null>, {}>) => {
    const users: IUser[] = await getAllUsers();
    if(users.length !== 0) {
        res.status(200).json(ResponseHelper.ok<IUser[]>(users));
    }
    else {
        res.status(404).json(ResponseHelper.notFound());
    }
}

// sign up
export const createNewUser = async (req: Request<{}, {}, IUser, {}>, res: Response<IApiResponse<IUser | null>, {}>): Promise<void> => {
    try {
        // insert user
        const newUser: IUser = req.body;
        const result: ObjectId = await createUser(newUser);

        // get user data
        const user: IUser | null = await getUserById(result.toString());
        if(user) {
            res.status(201).json(ResponseHelper.created<IUser>(user));
        }
        else {
            res.status(400).json(ResponseHelper.badRequest("an error occured while fetching user data."));
        }
    }
    catch(error) {
        res.status(400).json(ResponseHelper.badRequest("bad request. unable to create user."));
    }
}

// login
export const getRegisteredUser = async (req: Request<{}, {}, {email: string, password: string}, {}>, res: Response<IApiResponse<IUser | null>, {}>): Promise<void> => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user: IUser | null = await getUserByCredentials(email, password);
    if(user) {
        res.status(200).json(ResponseHelper.ok<IUser>(user));
    }
    else {
        res.status(404).json(ResponseHelper.notFound());
    }

}



