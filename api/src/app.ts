import express from "express";
import dotenv from "dotenv";


import { usersRouter } from "./routes/users.route";
import { problemsRouter } from "./routes/problems.route";
import { submissionsRouter } from "./routes/submissions.route";

import { connectToDatabase } from "./helpers/database.helper";

// .env variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

// create app
const app = express();
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
