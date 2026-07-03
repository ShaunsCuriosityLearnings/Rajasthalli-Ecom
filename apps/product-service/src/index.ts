import "./load-env.js";

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { shouldBeUser } from "./middleware/authMiddleware.js";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";
import maincategoryRouter from "./routes/maincategory.route.js";

// Fail fast if env is missing
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY is missing");
}

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003", "https://beta.rajasthalii.com", "https://admin.rajasthalii.com"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(clerkMiddleware());

// Health Check
app.get("/healthcheck", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "Ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Protected Test Route
app.get("/test", shouldBeUser, (req, res) => {
  res.status(200).json({
    message: "You are Logged In",
    userId: req.userId,
  });
});

// Routes
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/maincategory", maincategoryRouter);

// Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Product Service running on port ${PORT}`);
});