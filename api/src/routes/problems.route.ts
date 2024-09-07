import { Response, Router, Request } from "express";
import { getProblems, getProblemDetails , addProblem, deleteProblem, updateProblem } from '../controllers/problems.controller'
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware";

export const problemsRouter = Router();

// user must be logged in to view problems
problemsRouter.use(verifyToken);

problemsRouter.route("/")
    .get(getProblems) // 7asa eni 3yza a4il el get all problems di..
    .post(verifyAdmin, addProblem);

problemsRouter.route("/topic/:topic")
    .get(getProblems);

problemsRouter.route("/:id/")
    .get(getProblemDetails)
    .delete(verifyAdmin, deleteProblem)
    .put(verifyAdmin, updateProblem);

