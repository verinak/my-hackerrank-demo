import { Response, Router, Request } from "express";
import { getSubmissions , getUserSubmissions, addSubmission} from '../controllers/submissions.controller'

export const submissionsRouter = Router();

submissionsRouter.route("/")
    .get(getSubmissions)
    .post(getUserSubmissions);

submissionsRouter.route("/create/")
    .post(addSubmission);