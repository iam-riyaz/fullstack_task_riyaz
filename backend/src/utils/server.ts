import express from 'express';
import dotenv from "dotenv"
import cors from "cors"
import { createServer } from 'http'
import { Server, Socket } from 'socket.io';
import { connectDB } from '../config/database/database.config';
import { clearTasksFromRedis, connectRedis, getTasksFromRedis, saveTasksToRedis } from '../services/redis';
import { Task } from '../models/model';
import { json } from 'body-parser';

export const app = express();
dotenv.config()
app.use(cors())

// Connect to Redis
connectRedis();


const server = createServer(app);
const io = new Server (server, { cors: { origin: "*" } });
const port = process.env.PORT|| 3000;

app.use(json());

app.get("/", async (req, res) => {
    res.send("listening on port 3000");
  });


connectDB().then(()=>{
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})

io.on('connection', (socket:Socket) => {
    console.log("user connected:", socket.id);
    socket.on('add', async (task: string) => {
      let tasks = await getTasksFromRedis();
      tasks.push(task);
      await saveTasksToRedis(tasks);
      
  
      if (tasks.length ==50) {
        await Task.insertMany(tasks.map(t => ({ task: t })));
        await clearTasksFromRedis();
      }

       io.emit('tasksUpdated', tasks);
    });
  });




