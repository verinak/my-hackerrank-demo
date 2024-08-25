import { Response, Router, Request } from "express";
import { getAll, createNewUser, getRegisteredUser } from '../controllers/users.controller'

export const usersRouter = Router();

usersRouter.route("/")
    .get(getAll);

usersRouter.route("/new")
    .post(createNewUser);

usersRouter.route("/registered")
    .post(getRegisteredUser);

