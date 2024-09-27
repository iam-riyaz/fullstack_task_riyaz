import { Task } from "./../models/model";
import express from "express";
import { getTasksFromRedis } from "../services/redis";

export const taskRoutes = express.Router();

taskRoutes.get("/fetchAllTasks", async (req, res) => {
  try {
    const mongoTasks = await Task.find();
    res.status(200).send({
      status: true,
      redisTasks: mongoTasks,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      error: err,
    });
  }
});
