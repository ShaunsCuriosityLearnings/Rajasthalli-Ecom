import "./load-env.js";

import express, { Request, Response } from "express";
import cors from "cors";
import { connectOrderDB } from "@repo/orderdb";
import emailRouter from "./routes/email.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003", "https://beta.rajasthalii.com", "https://admin.rajasthalii.com"],
    credentials: true,
  })
);

app.use(express.json());

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/email", emailRouter);

const PORT = process.env.PORT || 8005;

const startServer = async () => {
  // Start Express server immediately
  app.listen(PORT, () => {
    console.log(`🚀 Email Service running on port ${PORT}`);
  });

  // Connect to MongoDB
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL env variable is missing");
    }
    await connectOrderDB();
    console.log("Connected to MongoDB successfully");
  } catch (dbErr: any) {
    console.error("Failed to connect to MongoDB:", dbErr.message || dbErr);
  }
};

startServer();
