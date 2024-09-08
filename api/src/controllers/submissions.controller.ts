import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { getAllSubmissions, getAllUserSubmissions, createSubmission } from '../models/submissions.model'
import { ISubmission } from '../interfaces/submissions.interface';
import { IApiResponse } from '../interfaces/api-response.interface';
import { ResponseHelper } from '../helpers/api-response.helper';
import { decodeToken } from '../helpers/jwt-auth.helper';

// get all submissions
export const getSubmissions = async (req: Request, res: Response<IApiResponse<ISubmission[] | null>, {}>) => {
    // get all submissions
    const submissions: ISubmission[] = await getAllSubmissions();
    if (submissions.length === 0) {
        // if array is empty, return 404 not found
        return res.status(404).json(ResponseHelper.notFound());
    }
    // array is not empty, return found submissions
    return res.status(200).json(ResponseHelper.ok<ISubmission[]>(submissions));

}
// get all user submissions
export const getUserSubmissions = async (req: Request<{}, IApiResponse<ISubmission[] | null>, {}, {}>, res: Response<IApiResponse<ISubmission[] | null>, {}>) => {
    const decodedToken = decodeToken(req); // decode token
    // get submissions by user id
    const submissions: ISubmission[] = await getAllUserSubmissions(decodedToken.id);
    if (submissions.length === 0) {
        // if array is empty, return 404 not found
        return res.status(404).json(ResponseHelper.notFound());
    }
    // array is not empty, return found submissions
    return res.status(200).json(ResponseHelper.ok<ISubmission[]>(submissions));

}

// add new submission
export const addSubmission = async (req: Request<{}, {}, ISubmission, {}>, res: Response<IApiResponse<ObjectId | null>, {}>) => {
    const decodedToken = decodeToken(req); // decode token
    const newSubmission: ISubmission = req.body; // get submission data from request body

    // check that submission is not empty and contains a problem id
    if (!newSubmission || !newSubmission.problem_id) {
        return res.status(400).json(ResponseHelper.badRequest("Invalid submission data."));
    }
    // check that problem id is a valid object id
    if (!ObjectId.isValid(newSubmission.problem_id)) {
        return res.status(400).json(ResponseHelper.badRequest("Invalid problem_id."));
    }

    newSubmission.problem_id = new ObjectId(newSubmission.problem_id); // fix problem id
    newSubmission.user_id = new ObjectId(decodedToken.id); // add user id

    try {
        // add submission to database
        const result: ObjectId = await createSubmission(newSubmission);
        return res.status(201).json(ResponseHelper.created<ObjectId>(result));
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(ResponseHelper.internalServerError("An error occured. Unable to create submission."));
    }
}