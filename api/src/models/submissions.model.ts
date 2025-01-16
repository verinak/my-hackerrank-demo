import { ISubmission } from '../interfaces/submissions.interface';
import { ObjectId, Collection } from 'mongodb';
import { getDb } from '../helpers/database.helper';

const getSubmissionsCollection = (): Collection<ISubmission> => {
    const db = getDb();
    return db.collection<ISubmission>('submissions');
};

// get all submissions
export const getAllSubmissions = async (): Promise<ISubmission[]> => {
    const submissionsCollection = getSubmissionsCollection();
    const result = await submissionsCollection.find().toArray();
    return result;
}

// get all user submissions
export const getAllUserSubmissions = async (id: string): Promise<ISubmission[]> => {
    const submissionsCollection = getSubmissionsCollection();
    const result = await submissionsCollection.find({ user_id: new ObjectId(id) }).toArray();
    return result;
}

// get all problem submissions
export const getAllProblemSubmissions = async (id: string): Promise<ISubmission[]> => {
    const submissionsCollection = getSubmissionsCollection();
    const result = await submissionsCollection.find({ problem_id: new ObjectId(id) }).toArray();
    return result;
}

// create submission
export const createSubmission = async (submission: ISubmission): Promise<ObjectId> => {
    const submissionsCollection = getSubmissionsCollection();
    const result = await submissionsCollection.insertOne(submission);

    if (result.acknowledged) {
        return result.insertedId;
    }
    else {
        throw new Error('Insert operation was not acknowledged');
    }
}

