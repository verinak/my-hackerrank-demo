import { IProblem } from "../interfaces/problems.interface";
import { ObjectId, Collection } from 'mongodb';
import { getDb } from '../helpers/database.helper';

const getProblemsCollection = (): Collection<IProblem> => {
    const db = getDb();
    return db.collection<IProblem>('problems');
};

// get all problems
export const getAllProblems = async (): Promise<IProblem[]> => {
    const problemsCollection = getProblemsCollection();
    const result = await problemsCollection.find().toArray();
    return result;
}

// get problems by topic
export const getProblemsByTopic = async (topic: string): Promise<IProblem[]> => {
    const problemsCollection = getProblemsCollection();
    const result = await problemsCollection.find({ topic: topic }).toArray();
    return result;
}

// get problem by id
export const getProblemById = async (id: string): Promise<IProblem | null> => {
    const problemsCollection = getProblemsCollection();
    const result = await problemsCollection.findOne({ _id: new ObjectId(id) });
    return result;
}

// create problem
export const createProblem = async (problem: IProblem): Promise<ObjectId> => {
    const problemsCollection = getProblemsCollection();
    const result = await problemsCollection.insertOne(problem);

    if (result.acknowledged) {
        return result.insertedId;
    }
    else {
        throw new Error('Insert operation was not acknowledged');
    }
}

// delete problem
export const deleteProblemById = async (id: string): Promise<number> => {
    const problemsCollection = getProblemsCollection();
    const result = await problemsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.acknowledged) {
        return result.deletedCount;
    }
    else {
        throw new Error('Delete operation was not acknowledged');
    }
}

// update problem
export const updateProblemById = async (id: string, problem: IProblem): Promise<number> => {
    const problemsCollection = getProblemsCollection();
    const result = await problemsCollection.replaceOne({ _id: new ObjectId(id) }, problem);
    if (result.acknowledged) {
        return result.modifiedCount;
    }
    else {
        throw new Error('Replace operation was not acknowledged');
    }
}
