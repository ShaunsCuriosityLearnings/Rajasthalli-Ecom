import Fastify from "fastify";
import cors from "@fastify/cors";
import { clerkPlugin, getAuth } from "@clerk/fastify";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { connectOrderDB, Order } from "@repo/orderdb";
import { orderRoute } from "./routes/order.js";
import { consumer, producer } from "./utils/kafka.js";
const fastify = Fastify();

fastify.register(cors, {
  origin: ["http://localhost:3002", "http://localhost:3003"],
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

    // Connect to Kafka in the background
    try {
      await Promise.all([
        producer.connect(),
        consumer.connect()
      ]);

      await consumer.subscribe({
        topic: "payment.processed",
        eachMessage: async (message: any) => {
          const { orderId, status } = message;
          console.log(`[Order Service] Received payment status update for ${orderId}: ${status}`);
          try {
            const updatedOrder = await Order.findByIdAndUpdate(
              orderId,
              { status },
              { new: true }
            );
            console.log(`[Order Service] Successfully updated order status in DB:`, updatedOrder);
          } catch (error) {
            console.error(`[Order Service] Failed to update order status for ${orderId}:`, error);
          }
        }
      });
      console.log("Connected to Kafka successfully");
    } catch (kafkaError) {
      console.error("Error connecting to Kafka:", kafkaError);
    }

  } catch (err) {
    console.error("Error starting Fastify server:", err);
    process.exit(1);
  }
};

start(); // Trigger dev server reload
