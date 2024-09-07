import { IUser } from "../interfaces/users.interface";
import { ObjectId, Collection } from 'mongodb';
import { getDb } from '../helpers/database.helper';

const getUsersCollection = (): Collection<IUser> => {
    const db = getDb();
    return db.collection<IUser>('users');
};

// get all users
export const getAllUsers = async (): Promise<IUser[]> => {
    const usersCollection = getUsersCollection();
    const result = await usersCollection.find().toArray();
    return result;
}

// get user by _id
export const getUserById = async (id: string): Promise<IUser | null> => {
    const usersCollection = getUsersCollection();
    const result = await usersCollection.findOne({  _id: new ObjectId(id) });
    return result;
}

// get user by email
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    const usersCollection = getUsersCollection();
    const result = await usersCollection.findOne({ email: email });
    return result;
}

// create new user
export const createUser = async (user: IUser): Promise<ObjectId> => {
    const usersCollection = getUsersCollection();
    const result = await usersCollection.insertOne(user);
    // https://mongodb.github.io/node-mongodb-native/6.8/interfaces/InsertOneResult.html

    if (result.acknowledged) {
        return result.insertedId;
    }
    else {
        throw new Error('Insert operation was not acknowledged');
    }
}

// get user by email
export const updateUserPassword = async (userId: string, newPassword: string): Promise<number | null> => {
    const usersCollection = getUsersCollection();
    const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: newPassword} }
    );

    console.log(result);
    
    if (result.acknowledged && result.modifiedCount != 0) {
        return result.modifiedCount;
    }
    else {
        throw new Error('Update operation was not acknowledged');
    }
}


