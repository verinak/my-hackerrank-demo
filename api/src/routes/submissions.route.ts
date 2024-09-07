import { Response, Router, Request } from "express";
import { getSubmissions , getUserSubmissions, addSubmission} from '../controllers/submissions.controller'
import { verifyToken } from "../middlewares/auth.middleware";

export const submissionsRouter = Router();

submissionsRouter.use(verifyToken);

submissionsRouter.route("/")
    // .get(getSubmissions) 
    .get(getUserSubmissions)
    .post(addSubmission);

// submissionsRouter.route("/create/")
//     .post(addSubmission);