import mongoose from "mongoose";


// MongoDB Task Schema
const taskSchema = new mongoose.Schema({
    task: { type: String, required: true }
  });
  
export const Task = mongoose.model('assignment_riyaz_ahmad', taskSchema);