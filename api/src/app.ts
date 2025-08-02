import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();


import { usersRouter } from "./routes/users.route";
import { problemsRouter } from "./routes/problems.route";
// import { submissionsRouter } from "./routes/submissions.route";

import { undefinedRoute, jsonError, defaultError } from "./middlewares/error-handler.middleware";
import { connectToDatabase } from "./helpers/database.helper";

// get .env variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;
const CLIENT_URI = process.env.CLIENT_URI as string;
// create app
const app = express();

// global middlewares
app.use(cors({
    origin: CLIENT_URI, 
    credentials: true    // allow cookies/credentials
}));
app.use(express.json());

// define routes
app.use("/users", usersRouter);
app.use("/problems", problemsRouter);
// app.use("/submissions", submissionsRouter);

// error handeling middlewares
app.use(undefinedRoute); // catch undefined routes and send 404 error
app.use(jsonError); // catch bad json errors
app.use(defaultError); // general error-handling middleware, send 500 internal server error

// connect to database
console.log('Connecting to database ...');
(async () => {
    try {
        await connectToDatabase(MONGO_URI);
        console.log('Connected to MongoDB');
        // start app
        app.listen(PORT, () => {
            console.log(`listening on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
})();
