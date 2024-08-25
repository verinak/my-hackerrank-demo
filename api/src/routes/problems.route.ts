import { Response, Router, Request } from "express";
import { getProblems , addProblem, deleteProblem, updateProblem } from '../controllers/problems.controller'

export const problemsRouter = Router();

problemsRouter.route("/")
    .get(getProblems)
    .post(addProblem);

problemsRouter.route("/topics/:topic")
    .get(getProblems);

problemsRouter.route("/:id")
    .get(getProblems)
    .delete(deleteProblem)
    .put(updateProblem);