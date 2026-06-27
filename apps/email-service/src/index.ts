import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectOrderDB, Order } from "@repo/orderdb";
import { consumer, producer, statusConsumer, kafkaclient } from "./utils/kafka.js";
import emailRouter from "./routes/email.routes.js";
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from "./services/email.service.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
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
  // Start Express server
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

  // Ensure topics exist before connecting consumers to prevent UNKNOWN_TOPIC_OR_PARTITION errors
  try {
    const admin = kafkaclient.admin();
    await admin.connect();
    await admin.createTopics({
      topics: [
        { topic: "payment.processed" },
        { topic: "order.status.updated" }
      ]
    });
    await admin.disconnect();
    console.log("Kafka topics verified/created successfully");
  } catch (topicError) {
    console.warn("Failed to pre-create Kafka topics (broker might auto-create them):", topicError);
  }

  // Connect to Kafka & subscribe
  try {
    await Promise.all([
      producer.connect(),
      consumer.connect(),
      statusConsumer.connect()
    ]);
    console.log("Connected to Kafka successfully");

    // Primary payment.processed listener
    await consumer.subscribe({
      topic: "payment.processed",
      eachMessage: async (message: any) => {
        const { orderId, status } = message;
        console.log(`[Email Service] Received payment.processed event: orderId=${orderId}, status=${status}`);
        
        if (status === "success") {
          try {
            // Retrieve full order details from MongoDB
            const order = await Order.findById(orderId);
            if (!order) {
              console.error(`[Email Service] Order not found for ID: ${orderId}`);
              return;
            }
            
            console.log(`[Email Service] Sending confirmation email to: ${order.email}`);
            await sendOrderConfirmationEmail(order);
          } catch (err: any) {
            console.error(`[Email Service] Failed to process email for order ${orderId}:`, err.message || err);
          }
        } else {
          console.log(`[Email Service] Skipping email sending since payment status is: ${status}`);
        }
      }
    });

    // Secondary order status update listener
    await statusConsumer.subscribe({
      topic: "order.status.updated",
      eachMessage: async (message: any) => {
        const { orderId, status } = message;
        console.log(`[Email Service] Received order.status.updated event: orderId=${orderId}, status=${status}`);
        
        try {
          // Retrieve full order details from MongoDB
          const order = await Order.findById(orderId);
          if (!order) {
            console.error(`[Email Service] Order not found for ID: ${orderId}`);
            return;
          }
          
          console.log(`[Email Service] Sending status update (${status}) email to: ${order.email}`);
          await sendOrderStatusUpdateEmail(order, status);
        } catch (err: any) {
          console.error(`[Email Service] Failed to process status update email for order ${orderId}:`, err.message || err);
        }
      }
    });
  } catch (kafkaError) {
    console.error("Error connecting/subscribing to Kafka:", kafkaError);
  }
};

startServer();
