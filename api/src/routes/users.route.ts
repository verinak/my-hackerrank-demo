import { Response, Router, Request } from "express";
import { getAll, createNewUser, getRegisteredUser, updatePassword, getUserData, getUserSubmissions } from '../controllers/users.controller'
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware";
import { unsupportedMethod } from "../middlewares/error-handler.middleware";

export const usersRouter = Router();

usersRouter.route("/")
    .get(verifyToken, verifyAdmin, getAll) // get all users (admin only)
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

usersRouter.route("/new")
    .post(createNewUser, getRegisteredUser) // sign up
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

usersRouter.route("/registered")
    .post(getRegisteredUser) // log in
    .get(verifyToken, getUserData) // get logged in user data
    .patch(verifyToken, updatePassword) // change password
    .all(unsupportedMethod); // send 405 method not allowed error for any other method

usersRouter.route("/registered/submissions")
    .get(verifyToken, getUserSubmissions) // get logged in user submissions
    .all(unsupportedMethod); // handle unsupported methods

// TODO : add admin routes to get user data by id, get user submissions by id