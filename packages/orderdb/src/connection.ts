import mongoose from "mongoose";
import dns from "dns";

let isConnected = false;

export const connectOrderDB = async () => {
  if (isConnected) return;

  console.log("Connecting to MongoDB...");

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined in env file");
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);

    isConnected = true;

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
