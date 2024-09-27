import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
  await redisClient.connect();
};

export const getTasksFromRedis = async (): Promise<string[]> => {
  const tasks = await redisClient.get(`FULLSTACK_TASK_RIYAZ`);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasksToRedis = async (tasks: string[]) => {
  await redisClient.set(`FULLSTACK_TASK_RIYAZ`, JSON.stringify(tasks));
};

export const clearTasksFromRedis = async () => {
  await redisClient.del(`FULLSTACK_TASK_RIYAZ`);
};
