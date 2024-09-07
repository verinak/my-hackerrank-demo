import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from "uuid";
import { ObjectId } from 'mongodb';

import { getAllUsers, getUserById, getUserByEmail, createUser, updateUserPassword } from '../models/users.model'
import { IUser } from '../interfaces/users.interface';
import { IApiResponse } from '../interfaces/api-response.interface';
import { ResponseHelper } from '../helpers/api-response.helper';

const saltRounds = process.env.SALT_ROUNDS || 10;

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
        const newUser: IUser = req.body;

        const oldUser: IUser | null = await getUserByEmail(newUser.email);

        if (oldUser) {
            res.status(400).json(ResponseHelper.badRequest("Email is already registered."));
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
        newUser.password = hashedPassword;
        
        // console.log(newUser);
        // insert user in database
        const result: ObjectId = await createUser(newUser);

        // get user data
        const user: IUser | null = await getUserById(result.toString());
        
        if(!user) {
            res.status(500).json(ResponseHelper.internalServerErorr("an error occured while fetching user data."));
            return;
        }
        
        // jwt !!
        res.status(201).json(ResponseHelper.created<IUser>(user));

    }
    catch(err) {
        res.status(500).json(ResponseHelper.internalServerErorr(`An error occured: ${err}`));
    }
}

// login
export const getRegisteredUser = async (req: Request<{}, {}, {email: string, password: string}, {}>, res: Response<IApiResponse<IUser | null>, {}>): Promise<void> => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user: IUser | null = await getUserByEmail(email);

    // no user found with this email asln, return 404 Not Found
    if (!user) {
        res.status(404).json(ResponseHelper.notFound());
        return;
    }

    // user found, compare hashed passwords
    try {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // jwt !!
            res.status(200).json(ResponseHelper.ok<IUser>(user));
        } else {
            res.status(401).json(ResponseHelper.unauthorized("Invalid password."));
        }
    }
    catch (err) {
        res.status(500).json(ResponseHelper.internalServerErorr(`An error occured: ${err}`));
    }

}

export const updatePassword = async (req: Request<{}, {}, {_id: string, password: string}, {}>, res: Response): Promise<void> => {
    // tab3an lama nzawed goz2 el jwt hangib el id mn el token
    const userId: string = req.body._id;
    const password: string = req.body.password;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result: number | null = await updateUserPassword(userId, hashedPassword);

        res.status(200).json(ResponseHelper.ok<Object>({updatedCount: result}));
    }
    catch (err) {
        res.status(500).json(ResponseHelper.internalServerErorr(`An error occured: ${err}`));
    }

}



