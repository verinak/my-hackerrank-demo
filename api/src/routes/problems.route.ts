import { Response, Router, Request } from "express";
import { getAll, getProblems, getProblemDetails , addProblem, deleteProblem, updateProblem } from '../controllers/problems.controller'
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware";
import { unsupportedMethod } from "../middlewares/error-handler.middleware";

export const problemsRouter = Router();

// user must be logged in to view problems
problemsRouter.use(verifyToken);

problemsRouter.route("/")
    .get(getAll) // 7asa eni 3yza a4il el get all problems di..
    .post(verifyAdmin, addProblem)
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

problemsRouter.route("/topic/:topic")
    .get(getProblems)
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

problemsRouter.route("/:id/")
    .get(getProblemDetails)
    .delete(verifyAdmin, deleteProblem)
    .put(verifyAdmin, updateProblem)
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

