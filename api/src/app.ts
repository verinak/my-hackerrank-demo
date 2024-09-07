import express from "express";
import dotenv from "dotenv";
dotenv.config();


import { usersRouter } from "./routes/users.route";
import { problemsRouter } from "./routes/problems.route";
import { submissionsRouter } from "./routes/submissions.route";

import { connectToDatabase } from "./helpers/database.helper";

// get .env variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

// create app
const app = express();

// global middlewares
app.use(express.json());

// define routes
app.use("/users", usersRouter);
app.use("/problems", problemsRouter);
app.use("/submissions", submissionsRouter);


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
