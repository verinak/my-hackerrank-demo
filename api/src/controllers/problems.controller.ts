import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { getAllProblems, getProblemsByTopic, getProblemById, createProblem, deleteProblemById, updateProblemById } from '../models/problems.model'
import { IProblem } from '../interfaces/problems.interface';
import { IApiResponse } from '../interfaces/api-response.interface';
import { ResponseHelper } from '../helpers/api-response.helper';
import { decodeToken } from '../helpers/jwt-auth.helper';

// get all problems
export const getAll = async (req: Request, res: Response<IApiResponse<IProblem[] | null>, {}>) => {
    // get all problems
    const problems: IProblem[] = await getAllProblems();
    if(problems.length === 0) {
        // if array is empty, return 404 not found
        return res.status(404).json(ResponseHelper.notFound());
    }
    // array is not empty, return found problems
    return res.status(200).json(ResponseHelper.ok<IProblem[]>(problems));

}

// get problems by topic
export const getProblems = async (req: Request, res: Response<IApiResponse<IProblem[] | null>, {}>) => {
    let topic = req.params.topic; // get topic from path parameters
    topic = (req.params.topic).charAt(0).toUpperCase() + topic.slice(1); // capitalize first letter
    
    const decodedToken = decodeToken(req); // decode token

    // get problems by topic
    const problems: IProblem[] = await getProblemsByTopic(topic, decodedToken.id);
    if(problems.length === 0) {
        // if array is empty, return 404 not found
        return res.status(404).json(ResponseHelper.notFound());
    }
    // array is not empty, return found problems
    return res.status(200).json(ResponseHelper.ok<IProblem[]>(problems));

}

// get problem details
export const getProblemDetails = async (req: Request, res: Response<IApiResponse<IProblem | null>, {}>) => {
    const decodedToken = decodeToken(req); // decode token

    // get problem by problem id
    const problem: IProblem | null = await getProblemById(req.params.id, decodedToken.id);
    if(!problem) {
        // if problem is null, return 404 not found
        return res.status(404).json(ResponseHelper.notFound());
    }
    // problem is not null, return found problem
    return res.status(200).json(ResponseHelper.ok<IProblem>(problem));

}

// create problem by id
export const addProblem = async (req: Request<{}, {}, IProblem, {}>, res: Response<IApiResponse<ObjectId | null>, {}>) => {
    const newProblem: IProblem = req.body; // get problem data from request body
    // check that problem is not empty
    if (!newProblem) {
        return res.status(400).json(ResponseHelper.badRequest("Invalid problem data."));
    }

    try {
        // add problem to database
        const result: ObjectId = await createProblem(newProblem);
        return res.status(201).json(ResponseHelper.created<ObjectId>(result));
    }
    catch(error) {
        return res.status(500).json(ResponseHelper.internalServerError("An error occured. Unable to create problem."));
    }
}

// delete problem by id
export const deleteProblem = async (req: Request<{id: string}, {}, {}, {}>, res: Response<IApiResponse<number | null>, {}>) => {
    try {
        const result: number = await deleteProblemById(req.params.id);
        return res.status(200).json(ResponseHelper.ok<number>(result));
    }
    catch(error) {
        return res.status(500).json(ResponseHelper.internalServerError("An error occured. Unable to delete problem."));
    }
}

// update problem by id
export const updateProblem = async (req: Request<{id: string}, {}, IProblem, {}>, res: Response<IApiResponse<number | null>, {}>) => {
    const newProblem: IProblem = req.body; // get problem data from request body
    // check that problem is not empty
    if (!newProblem) {
        return res.status(400).json(ResponseHelper.badRequest("Invalid problem data."));
    }
    try {
        // update problem in database
        const result: number = await updateProblemById(req.params.id, newProblem);
        return res.status(200).json(ResponseHelper.ok<number>(result));
    }
    catch(error) {
        return res.status(500).json(ResponseHelper.internalServerError("An error occured. Unable to delete problem."));
    }
}