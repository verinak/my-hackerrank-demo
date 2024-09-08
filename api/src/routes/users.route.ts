import { Response, Router, Request } from "express";
import { getAll, createNewUser, getRegisteredUser, updatePassword, getUserData} from '../controllers/users.controller'
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware";
import { unsupportedMethod } from "../middlewares/error-handler.middleware";

export const usersRouter = Router();

usersRouter.route("/")
    .get(verifyToken, verifyAdmin, getAll)
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

usersRouter.route("/new")
    .post(createNewUser, getRegisteredUser)
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

usersRouter.route("/registered")
    .post(getRegisteredUser)
    .get(verifyToken, getUserData)
    .patch(verifyToken, updatePassword)
    .all(unsupportedMethod); // send 405 method not allowed error for any other method
