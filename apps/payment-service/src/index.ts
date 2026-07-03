import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { clerkMiddleware } from "@hono/clerk-auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { shouldBeUser } from "./middleware/authMiddleware.js";
import { paymentRoute } from "./routes/payment.route.js";

const app = new Hono();

// Enable CORS for frontend client, admin dashboard, and production subdomains
app.use(
  "*",
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003", "https://beta.rajasthalii.com", "https://admin.rajasthalii.com"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("*", clerkMiddleware());

app.get("/healthcheck", (c) => {
  return c.json({
    status: "Ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test", shouldBeUser, (c) => {
  return c.json({
    message: "You are logged in for payment!",
    userId: c.get("userId"),
  });
});

app.route("/payments", paymentRoute);

serve(
  {
    fetch: app.fetch,
    port: 8002,
  },
  () => {
    console.log("Payment Service is Running Live on 8002");
  },
);
