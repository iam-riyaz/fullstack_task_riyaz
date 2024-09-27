import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    task: { type: String, required: true }
  });
  
export const Task = mongoose.model('assignment_riyaz', taskSchema);