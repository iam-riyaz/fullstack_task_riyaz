import mongoose from "mongoose";

export const connectDB = async () => {
    
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}` || ""
    );
    console.log(`MongoDB Connected... port:` + conn.connection.host);
  } catch(err) {
    console.log("mongoose connection error: ", err);
  }
}; 
