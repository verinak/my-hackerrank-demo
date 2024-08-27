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
// export const getProblemsByTopic = async (topic: string): Promise<IProblem[]> => {
//     const problemsCollection = getProblemsCollection();
//     const result = await problemsCollection.find({ topic: topic }).toArray();
//     return result;
// }

export const getProblemsByTopic = async (topic: string, userId: string): Promise<IProblem[]> => {
    const problemsCollection = getProblemsCollection();
    let id = new ObjectId(userId)

    const pipeline = [
        { $match: { topic: topic } },
        { $lookup: {
            from: "submissions",
            localField: "_id",
            foreignField: "problem_id",
            pipeline: [
                { $match: { $and: [
                    { $expr: { $eq: ["$user_id", id ] } },
                    { $expr: { $eq: ["$status", true] } }
                    ]}
                }
            ],
            as: "userSubmissions"
        } },
        { $set: { solved_count: {$size: "$userSubmissions"}, } },
        // { $unset: "userSubmissions"}
    ]

    // console.log(JSON.stringify(pipeline, null, 2));

    const result = await problemsCollection.aggregate(pipeline).toArray();    

    let problem: IProblem[];
    if(result) {
        problem = result as IProblem[];
    }
    else {
        problem = [];
    }

    return problem;
}

// get problem by id
export const getProblemById = async (id: string, userId: string): Promise<IProblem | null> => {
    const problemsCollection = getProblemsCollection();

    const pipeline = [
        { $match: { _id: new ObjectId(id) } },
        { $lookup: {
            from: "submissions",
            localField: "_id",
            foreignField: "problem_id",
            "pipeline": [
                { "$match": { $expr: { $eq: ["$user_id", new ObjectId(userId)] } } }
            ],
            as: "userSubmissions"
            }
        },
    ]

    const result = await problemsCollection.aggregate(pipeline).next();
    
    // 34an el typescript 7omar
    let problem: IProblem | null;
    if(result) {
        problem = result as IProblem;
    }
    else {
        problem = null;
    }

    return problem;
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
