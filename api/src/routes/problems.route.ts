import { Response, Router, Request } from "express";
import { getAll, getProblems, getProblemDetails , addProblem, deleteProblem, updateProblem, addSubmission, getProblemSubmissions} from '../controllers/problems.controller'
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware";
import { unsupportedMethod } from "../middlewares/error-handler.middleware";

export const problemsRouter = Router();

// user must be logged in to view problems
problemsRouter.use(verifyToken);

problemsRouter.route("/")
    .get(getProblems, getAll) // get problems. possible query parameters: [topic].
    .post(verifyAdmin, addProblem) // create new problem (admin only)
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

problemsRouter.route("/:id/")
    .get(getProblemDetails) // get problem details, including current user's submissions
    .delete(verifyAdmin, deleteProblem) // delete problem (admin only)
    .put(verifyAdmin, updateProblem) // update problem (admin only)
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

problemsRouter.route("/:id/submissions")
    .get(getProblemSubmissions) // get all submissions to a problem
    .post(addSubmission) // make new submission to problem
    .all(unsupportedMethod); // send 405 method not allowed error for any other method


