import { Order } from "@repo/orderdb";
import { FastifyInstance } from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware.js";
import { fireAndForget } from "../utils/httpClient.js";

const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || "http://localhost:8005";

export const orderRoute = async (fastify: FastifyInstance) => {
  // Get all orders for logged-in user
  fastify.get(
    "/user-orders",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      const orders = await Order.find({ userId: request.userId }).sort({ createdAt: -1 });
      return reply.send(orders);
    },
  );

  // Get all orders for admin
  fastify.get(
    "/orders",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { limit } = request.query as { limit?: string }
      const orders = await Order.find().sort({ createdAt: -1 }).limit(Number(limit || "100"));
      return reply.send(orders);
    },
  );

  // Get order analytics for admin
  fastify.get(
    "/orders/analytics",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      try {
        const now = new Date();

        // 1. Week Analytics (Last 7 days, including today)
        const weekData: { day: string; dateStr: string; total: number; successful: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(now.getDate() - i);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
          weekData.push({
            day: dayName,
            dateStr: d.toISOString().split('T')[0]!,
            total: 0,
            successful: 0,
          });
        }

        const startOfWeek = new Date(weekData[0]!.dateStr);
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyOrders = await Order.find({
          createdAt: { $gte: startOfWeek },
        });

        for (const order of weeklyOrders) {
          if (!order.createdAt) continue;
          const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
          const target = weekData.find((w) => w.dateStr === orderDateStr);
          if (target) {
            target.total += order.amount;
            if (order.status === "success") {
              target.successful += order.amount;
            }
          }
        }

        // 2. Month Analytics (Last 30 days, including today)
        const monthData: { date: string; dateStr: string; total: number; successful: number }[] = [];
        for (let i = 29; i >= 0; i--) {
          const d = new Date();
          d.setDate(now.getDate() - i);
          monthData.push({
            date: d.getDate().toString(),
            dateStr: d.toISOString().split('T')[0]!,
            total: 0,
            successful: 0,
          });
        }

        const startOfMonth = new Date(monthData[0]!.dateStr);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyOrders = await Order.find({
          createdAt: { $gte: startOfMonth },
        });

        for (const order of monthlyOrders) {
          if (!order.createdAt) continue;
          const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
          const target = monthData.find((m) => m.dateStr === orderDateStr);
          if (target) {
            target.total += order.amount;
            if (order.status === "success") {
              target.successful += order.amount;
            }
          }
        }

        // 3. Last 12 Months Analytics (Last 12 months, including current month)
        const last12MonthsData: { month: string; year: number; monthNum: number; total: number; successful: number }[] = [];
        for (let i = 11; i >= 0; i--) {
          const d = new Date();
          d.setMonth(now.getMonth() - i);
          const monthName = d.toLocaleDateString('en-US', { month: 'long' });
          last12MonthsData.push({
            month: monthName,
            year: d.getFullYear(),
            monthNum: d.getMonth(),
            total: 0,
            successful: 0,
          });
        }

        const startOfLast12Months = new Date(
          last12MonthsData[0]!.year,
          last12MonthsData[0]!.monthNum,
          1
        );
        startOfLast12Months.setHours(0, 0, 0, 0);

        const last12MonthsOrders = await Order.find({
          createdAt: { $gte: startOfLast12Months },
        });

        for (const order of last12MonthsOrders) {
          if (!order.createdAt) continue;
          const orderDate = new Date(order.createdAt);
          const orderYear = orderDate.getFullYear();
          const orderMonthNum = orderDate.getMonth();
          const target = last12MonthsData.find(
            (m) => m.year === orderYear && m.monthNum === orderMonthNum
          );
          if (target) {
            target.total += order.amount;
            if (order.status === "success") {
              target.successful += order.amount;
            }
          }
        }

        // 4. All Time Analytics (From earliest order to current month, min 6 months)
        let startOfAllTime = new Date();
        const earliestOrder = await Order.findOne().sort({ createdAt: 1 });
        if (earliestOrder && earliestOrder.createdAt) {
          startOfAllTime = new Date(earliestOrder.createdAt);
        } else {
          startOfAllTime.setMonth(startOfAllTime.getMonth() - 5);
        }
        startOfAllTime.setDate(1);
        startOfAllTime.setHours(0, 0, 0, 0);

        const allTimeData: { month: string; year: number; monthNum: number; total: number; successful: number }[] = [];
        const tempDate = new Date(startOfAllTime);
        const currentMonthEnd = new Date();
        currentMonthEnd.setDate(1);
        currentMonthEnd.setHours(0, 0, 0, 0);

        while (tempDate <= currentMonthEnd) {
          const monthName = tempDate.toLocaleDateString('en-US', { month: 'long' });
          allTimeData.push({
            month: monthName,
            year: tempDate.getFullYear(),
            monthNum: tempDate.getMonth(),
            total: 0,
            successful: 0,
          });
          tempDate.setMonth(tempDate.getMonth() + 1);
        }

        const allTimeOrders = await Order.find({
          createdAt: { $gte: startOfAllTime },
        });

        for (const order of allTimeOrders) {
          if (!order.createdAt) continue;
          const orderDate = new Date(order.createdAt);
          const orderYear = orderDate.getFullYear();
          const orderMonthNum = orderDate.getMonth();
          const target = allTimeData.find(
            (m) => m.year === orderYear && m.monthNum === orderMonthNum
          );
          if (target) {
            target.total += order.amount;
            if (order.status === "success") {
              target.successful += order.amount;
            }
          }
        }

        const responseData = {
          week: weekData.map(({ day, total, successful }) => ({ day, total, successful })),
          month: monthData.map(({ date, total, successful }) => ({ date, total, successful })),
          last12Months: last12MonthsData.map(({ month, total, successful }) => ({ month, total, successful })),
          allTime: allTimeData.map(({ month, total, successful }) => ({ month, total, successful })),
        };

        return reply.send(responseData);
      } catch (error: any) {
        return reply.status(500).send({
          success: false,
          message: error.message || "Failed to fetch order analytics",
        });
      }
    }
  );


  // 1. CREATE A PENDING ORDER (called during checkout)
  fastify.post(
    "/orders",
    async (request, reply) => {
      const apiKey = request.headers["x-internal-api-key"];

      if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return reply.status(403).send({
          success: false,
          message: "Unauthorized - Invalid internal API key",
        });
      }

      const { products, amount, email, userId, shippingAddress } = request.body as any;

      if (!products || !amount || !email) {
        return reply.status(400).send({
          success: false,
          message: "Missing products, amount, or email",
        });
      }

      try {
        const newOrder = await Order.create({
          userId: userId || "test_user_123",
          email,
          amount,
          status: "pending",
          products,
          shippingAddress,
        });

        return reply.status(201).send(newOrder);
      } catch (error: any) {
        return reply.status(500).send({
          success: false,
          message: error.message || "Failed to create order",
        });
      }
    }
  );

  // 2. SECURELY UPDATE ORDER STATUS (Internal only, verified by payment service)
  fastify.patch(
    "/orders/:id/status",
    async (request, reply) => {
      const apiKey = request.headers["x-internal-api-key"];

      // Basic secure verification using a shared secret env variable
      if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return reply.status(403).send({
          success: false,
          message: "Unauthorized - Invalid internal API key",
        });
      }

      const { id } = request.params as { id: string };
      const { status } = request.body as { status: "success" | "failed" };

      if (!status || !["success", "failed"].includes(status)) {
        return reply.status(400).send({
          success: false,
          message: "Invalid status value",
        });
      }

      try {
        const updatedOrder = await Order.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );

        if (!updatedOrder) {
          return reply.status(404).send({
            success: false,
            message: "Order not found",
          });
        }

        // Notify Email Service asynchronously (fire-and-forget)
        fireAndForget(`${EMAIL_SERVICE_URL}/email/order-status-update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId: id, status }),
        });

        return reply.send({ success: true, order: updatedOrder });
      } catch (error: any) {
        return reply.status(500).send({
          success: false,
          message: error.message || "Failed to update order status",
        });
      }
    }
  );

  // 3. ADMIN STATUS UPDATE (called from admin dashboard, authorized by shouldBeAdmin middleware)
  fastify.patch(
    "/orders/:id/admin-status",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: string };

      if (!status || !["pending", "success", "failed", "packed", "out for delivery", "delivered"].includes(status)) {
        return reply.status(400).send({
          success: false,
          message: "Invalid status value",
        });
      }

      try {
        const updatedOrder = await Order.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );

        if (!updatedOrder) {
          return reply.status(404).send({
            success: false,
            message: "Order not found",
          });
        }

        // Notify Email Service asynchronously (fire-and-forget)
        fireAndForget(`${EMAIL_SERVICE_URL}/email/order-status-update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId: id, status }),
        });

        return reply.send({ success: true, order: updatedOrder });
      } catch (error: any) {
        return reply.status(500).send({
          success: false,
          message: error.message || "Failed to update order status",
        });
      }
    }
  );
};
