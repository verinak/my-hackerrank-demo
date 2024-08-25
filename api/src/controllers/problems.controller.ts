import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { getAllProblems, getProblemsByTopic, getProblemById, createProblem, deleteProblemById, updateProblemById } from '../models/problems.model'
import { IProblem } from '../interfaces/problems.interface';
import { ITestCase } from '../interfaces/test-case.interface';
import { IApiResponse } from '../interfaces/api-response.interface';
import { ResponseHelper } from '../helpers/api-response.helper';

// get problems
export const getProblems = async (req: Request, res: Response<IApiResponse<IProblem[] | IProblem | null>, {}>) => {

    if(req.params.topic) {
        // get problems by topic
        let topic = req.params.topic;
        topic = (req.params.topic).charAt(0).toUpperCase() + topic.slice(1); // capitalize first letter

        const problems: IProblem[] = await getProblemsByTopic(topic);
        if(problems.length !== 0) {
            res.status(200).json(ResponseHelper.ok<IProblem[]>(problems));
        }
        else {
            res.status(404).json(ResponseHelper.notFound());
        }
    }
    else if (req.params.id) {
        // get problem by id
        const problem: IProblem | null = await getProblemById(req.params.id);
        if(problem) {
            res.status(200).json(ResponseHelper.ok<IProblem>(problem));
        }
        else {
            res.status(404).json(ResponseHelper.notFound());
        }
    }
    else {
        // get all problems
        const problems: IProblem[] = await getAllProblems();
        if(problems.length !== 0) {
            res.status(200).json(ResponseHelper.ok<IProblem[]>(problems));
        }
        else {
            res.status(404).json(ResponseHelper.notFound());
        }
    }

}
export const addProblem = async (req: Request<{}, {}, IProblem, {}>, res: Response<IApiResponse<ObjectId | null>, {}>): Promise<void> => {
    try {
        const newProblem: IProblem = req.body;
        const result: ObjectId = await createProblem(newProblem);

        res.status(201).json(ResponseHelper.created<ObjectId>(result));
    }
    catch(error) {
        res.status(400).json(ResponseHelper.badRequest("bad request. unable to create problem."));
    }
}

export const deleteProblem = async (req: Request<{id: string}, {}, {}, {}>, res: Response<IApiResponse<number | null>, {}>): Promise<void> => {
    try {
        const result: number = await deleteProblemById(req.params.id);
        res.status(200).json(ResponseHelper.ok<number>(result));
    }
    catch(error) {
        res.status(400).json(ResponseHelper.badRequest("bad request. unable to delete problem."));
    }
}

export const updateProblem = async (req: Request<{id: string}, {}, IProblem, {}>, res: Response<IApiResponse<number | null>, {}>): Promise<void> => {
    try {
        const result: number = await updateProblemById(req.params.id, req.body);
        res.status(200).json(ResponseHelper.ok<number>(result));
    }
    catch(error) {
        res.status(400).json(ResponseHelper.badRequest("bad request. unable to delete problem."));
    }
}