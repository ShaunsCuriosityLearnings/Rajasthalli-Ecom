import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import process from "process";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { paymentRoute } from "./routes/payment.route.js";
import { consumer, producer } from "./utils/kafka.js";

const app = new Hono();

// Enable CORS for frontend client and admin dashboard
app.use(
  "*",
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
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



const start = async () => {
  try {
    await Promise.all([
      producer.connect(),
      consumer.connect()
    ]);
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      () => {
        console.log("Payment Service is Running Live on 8002");
      },
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Start Hono Payment Service (Trigger reload)
start(); // Trigger dev server reload
