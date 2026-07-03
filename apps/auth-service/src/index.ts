import "dotenv/config";

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { shouldBeAdmin } from "./middleware/authMiddleware.js";
import userRoute from "./routes/user.routes.js";

// Fail fast if required environment variables are missing
if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is missing from environment");
}
if (!process.env.CLERK_PUBLISHABLE_KEY) {
    throw new Error("CLERK_PUBLISHABLE_KEY is missing from environment");
}

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3003"],
        credentials: true,
    })
);

app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: Date.now(),
    });
});

app.use("/users", shouldBeAdmin, userRoute);

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error!",
    });
});

const PORT = process.env.PORT || 8004;

const start = async () => {
    app.listen(PORT, () => {
        console.log(`🚀 Auth service is running on port ${PORT}`);
    });
};

start();