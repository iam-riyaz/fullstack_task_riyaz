import { Task } from "./../models/model";
import express from "express";
import { getTasksFromRedis } from "../services/redis";

export const taskRoutes = express.Router();


taskRoutes.get("/fetchAllTasks", async (req, res) => {
  // Try fetching from Redis first
  const redisTasks = await getTasksFromRedis();
  if (redisTasks.length > 0) {
   return res.status(200).send(
        {
            status:true,
            redisTasks
        }
    )
    
  }

  // If Redis is empty, fetch from MongoDB
  const mongoTasks = await Task.find();
  res.status(200).send({
    status: true,
    redisTasks:mongoTasks,
  });
});
