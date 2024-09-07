import { Response, Router, Request } from "express";
import { getAll, createNewUser, getRegisteredUser, updatePassword, getUserData} from '../controllers/users.controller'
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware";

export const usersRouter = Router();

usersRouter.route("/")
    .get(verifyToken, verifyAdmin, getAll);

usersRouter.route("/new")
    .post(createNewUser);

usersRouter.route("/registered")
    .post(getRegisteredUser)
    .get(verifyToken, getUserData)
    .patch(verifyToken, updatePassword);

