import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { getAllSubmissions, createSubmission } from '../models/submissions.model'
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

