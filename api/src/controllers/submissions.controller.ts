import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { getAllSubmissions, getAllUserSubmissions, createSubmission } from '../models/submissions.model'
import { ISubmission } from '../interfaces/submissions.interface';
import { IApiResponse } from '../interfaces/api-response.interface';
import { ResponseHelper } from '../helpers/api-response.helper';

// get all submissions
export const getSubmissions = async (req: Request, res: Response<IApiResponse<ISubmission[] | null>, {}>) => {
    const submissions: ISubmission[] = await getAllSubmissions();
    if(submissions.length !== 0) {
        res.status(200).json(ResponseHelper.ok<ISubmission[]>(submissions));
    }
    else {
        res.status(404).json(ResponseHelper.notFound());
    }
}
// get all user submissions
export const getUserSubmissions = async (req: Request<{}, IApiResponse<ISubmission[] | null>, {id: string}, {}>, res: Response<IApiResponse<ISubmission[] | null>, {}>) => {
    const submissions: ISubmission[] = await getAllUserSubmissions(req.body.id);
    if(submissions.length !== 0) {
        res.status(200).json(ResponseHelper.ok<ISubmission[]>(submissions));
    }
    else {
        res.status(404).json(ResponseHelper.notFound());
    }
}

// add new submission
export const addSubmission = async (req: Request<{}, {}, ISubmission, {}>, res: Response<IApiResponse<ObjectId | null>, {}>): Promise<void> => {
    try {
        const newSubmission: ISubmission = req.body;
        newSubmission.problem_id = new ObjectId(newSubmission.problem_id);
        newSubmission.user_id = new ObjectId(newSubmission.user_id);
        console.log(newSubmission);
        const result: ObjectId = await createSubmission(newSubmission);

        res.status(201).json(ResponseHelper.created<ObjectId>(result));
    }
    catch(error) {
        res.status(400).json(ResponseHelper.badRequest("bad request. unable to create submission." + error));
    }
}