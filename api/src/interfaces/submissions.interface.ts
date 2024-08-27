import { ObjectId } from 'mongodb';

export interface ISubmission {
    _id?: ObjectId,
    user_id: ObjectId,
    problem_id: ObjectId,
    code: string,
    language: {
        name: string,
        version: string
    },
    status: boolean
}
