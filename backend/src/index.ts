
import { taskRoutes } from "./routes/task";
import { app } from "./utils/server";
import { Request, Response } from 'express'


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

app.use("/", taskRoutes)