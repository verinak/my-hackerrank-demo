import express from "express";

import { usersRouter } from "./routes/users.route";
import { problemsRouter } from "./routes/problems.route";
import { submissionsRouter } from "./routes/submissions.route";

import { connectToDatabase } from "./helpers/database.helper";

const PORT = 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/HackerrankDemo"
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
