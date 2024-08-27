import { Response, Router, Request } from "express";
import { getProblems, getProblemDetails , addProblem, deleteProblem, updateProblem } from '../controllers/problems.controller'

export const problemsRouter = Router();

problemsRouter.route("/")
    .get(getProblems)
    .post(addProblem);

// tab3an el userId eli fl path da hayetzabat bs m4 dlwa2ti 🤡

problemsRouter.route("/topic/:topic/:userId")
    .get(getProblems);

problemsRouter.route("/:id/:userId")
    .get(getProblemDetails)
    .delete(deleteProblem)
    .put(updateProblem);

