import { Response, Router, Request } from "express";
import { getSubmissions , getUserSubmissions, addSubmission} from '../controllers/submissions.controller'
import { verifyToken } from "../middlewares/auth.middleware";
import { unsupportedMethod } from "../middlewares/error-handler.middleware";

export const submissionsRouter = Router();

submissionsRouter.use(verifyToken);

submissionsRouter.route("/")
    // .get(getSubmissions) 
    .get(getUserSubmissions)
    .post(addSubmission)
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

// submissionsRouter.route("/create/")
//     .post(addSubmission);