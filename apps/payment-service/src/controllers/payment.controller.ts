import { Context } from "hono";
import { prisma } from "@repo/productdb";
import { cashfree } from "../services/cashfree.service.js";
import { fetchWithRetry, fireAndForget } from "../utils/httpClient.js";

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:8001";
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || "http://localhost:8005";
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:8000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "my_secure_secret_key_123";

// Create Checkout Order & Session
export const createPaymentSession = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const { products, customer_details, shipping_address } = await c.req.json();

    if (!products || products.length === 0 || !customer_details) {
      return c.json({ success: false, message: "Missing required checkout parameters" }, 400);
    }

    // 1. SECURE PRICE CALCULATION: Fetch current database prices
    const productIds = products.map((p: any) => p.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotal = 0;
    const orderItems = [];

    for (const item of products) {
      const dbProduct = dbProducts.find((p) => p.id === item.id);
      if (!dbProduct) {
        return c.json({ success: false, message: `Product ID ${item.id} not found in catalog` }, 400);
      }
      subtotal += Number(dbProduct.price) * item.quantity;

      orderItems.push({
        name: dbProduct.name,
        quantity: item.quantity,
        price: Number(dbProduct.price),
      });
    }

    const shippingFee = 99; // Flat shipping fee configured on backend
    const secureTotalAmount = subtotal + shippingFee;

    // 2. CREATE PENDING ORDER: Call order-service internally
    const orderRes = await fetch(`${ORDER_SERVICE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": INTERNAL_API_KEY,
      },
      body: JSON.stringify({
        userId,
        email: customer_details.customer_email,
        amount: secureTotalAmount,
        products: orderItems,
        shippingAddress: shipping_address,
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData._id) {
      throw new Error(orderData.message || "Failed to register order in database");
    }

    const orderId = orderData._id;

    // 3. CASHFREE PAYLOAD: Prepare order requests
    const cashfreeRequest = {
      order_amount: secureTotalAmount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: userId,
        customer_name: customer_details.customer_name,
        customer_email: customer_details.customer_email,
        customer_phone: customer_details.customer_phone,
      },
      order_meta: {
        // Callback redirect URL to verify checkout
        return_url: `http://localhost:3002/orders/status?order_id=${orderId}`,
      },
    };

    // 4. GENERATE SESSION: Request session from Cashfree API
    const cashfreeResponse = await cashfree.PGCreateOrder(cashfreeRequest);

    return c.json({
      success: true,
      payment_session_id: cashfreeResponse.data.payment_session_id,
      order_id: orderId,
    });

  } catch (error: any) {
    console.error("Payment Session creation error:", error.response?.data || error.message);
    return c.json({
      success: false,
      message: error.message || "Internal payment checkout error",
    }, 500);
  }
};

// Verify Payment Status on callback / status page
export const verifyPayment = async (c: Context) => {
  const orderId = c.req.param("orderId");

  if (!orderId) {
    return c.json({ success: false, message: "Order ID is required" }, 400);
  }

  try {
    // 1. Fetch official order status from Cashfree
    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);

    const cfOrderStatus = cashfreeResponse.data.order_status;

    let finalStatus: "success" | "failed" = "failed";
    if (cfOrderStatus === "PAID") {
      finalStatus = "success";
    }

    // 2. Update order status in order-service synchronously
    await fetchWithRetry(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": INTERNAL_API_KEY,
      },
      body: JSON.stringify({ status: finalStatus }),
    });

    // 3. Send email confirmation asynchronously (fire-and-forget)
    if (finalStatus === "success") {
      fireAndForget(`${EMAIL_SERVICE_URL}/email/order-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });
    }

    // 4. Send payment processed event to product service asynchronously (fire-and-forget)
    fireAndForget(`${PRODUCT_SERVICE_URL}/products/payment-processed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        status: finalStatus,
        amount: cashfreeResponse.data.order_amount,
      }),
    });

    return c.json({
      success: true,
      status: finalStatus,
    });

  } catch (error: any) {
    console.error("Payment verification error:", error.message);
    return c.json({
      success: false,
      message: error.message || "Failed to verify payment status",
    }, 500);
  }
};
