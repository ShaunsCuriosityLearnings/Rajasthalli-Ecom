import Fastify from "fastify";
import cors from "@fastify/cors";
import { clerkPlugin } from "@clerk/fastify";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { connectOrderDB } from "@repo/orderdb";
import { orderRoute } from "./routes/order.js";
const fastify = Fastify();

fastify.register(cors, {
  origin: ["http://localhost:3002", "http://localhost:3003", "https://beta.rajasthalii.com", "https://admin.rajasthalii.com"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

fastify.register(clerkPlugin);

fastify.get("/healthcheck", (request, reply) => {
  return reply.status(200).send({
    status: "Ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

fastify.get("/test", { preHandler: shouldBeUser }, (request, reply) => {
  return reply.status(200).send({
    success: true,
    message: "Authenticated",
    userId: request.userId,
  });
});

fastify.register(orderRoute);

const start = async () => {
  try {
    // Start Fastify server immediately so it doesn't block on Kafka/MongoDB startup
    const address = await fastify.listen({
      port: 8001,
      host: "0.0.0.0",
    });
    console.log("Server listening at:", address);

    // Connect to MongoDB in the background
    connectOrderDB().catch((dbErr) => {
      console.error("Failed to connect to MongoDB on startup:", dbErr.message || dbErr);
    });

  } catch (err) {
    console.error("Error starting Fastify server:", err);
    process.exit(1);
  }
};

start(); // Trigger dev server reload
