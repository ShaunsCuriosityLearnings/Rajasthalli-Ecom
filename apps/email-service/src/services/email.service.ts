import nodemailer from "nodemailer";

let etherealAccount: any = null;

const createTransporter = async () => {
  // 1. If EMAIL_PASS is present, use standard SMTP with password (ideal for App Passwords)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log("[Email Service] Using standard SMTP with password auth.");
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // 2. If OAuth2 credentials are fully defined, use OAuth2
  if (
    process.env.EMAIL_USER &&
    process.env.EMAIL_CLIENT_ID &&
    process.env.EMAIL_CLIENT_SECRET &&
    process.env.EMAIL_REFRESH_TOKEN
  ) {
    console.log("[Email Service] Using OAuth2 auth.");
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      },
    });
  }

  // 3. Fallback: Ethereal test account (so the service never breaks and can be visually verified)
  console.log("[Email Service] Credentials missing. Falling back to Ethereal Email test account...");
  if (!etherealAccount) {
    etherealAccount = await nodemailer.createTestAccount();
  }
  
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: etherealAccount.user,
      pass: etherealAccount.pass,
    },
  });
};

export const sendMail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  const transporter = await createTransporter();
  const isEthereal = (transporter.options as any).host === "smtp.ethereal.email";
  const fromAddress = isEthereal && etherealAccount
    ? etherealAccount.user
    : process.env.EMAIL_USER || "test@rajasthalii.com";

  const mailOptions = {
    from: `"Rajasthalii Support" <${fromAddress}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Email sent successfully: ${info.messageId}`);
    
    // If it's Ethereal, log the preview URL
    if (isEthereal && etherealAccount) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[Email Service] ✉️ View test email preview at: ${previewUrl}`);
      return { ...info, previewUrl };
    }
    
    return info;
  } catch (error) {
    console.error("[Email Service] Transporter failed. Trying Ethereal fallback...", error);
    
    if (!etherealAccount) {
      etherealAccount = await nodemailer.createTestAccount();
    }
    const fallbackTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: etherealAccount.user,
        pass: etherealAccount.pass,
      },
    });
    
    const fallbackInfo = await fallbackTransporter.sendMail({
      from: `"Rajasthalii Support Fallback" <${etherealAccount.user}>`,
      to,
      subject,
      text,
      html,
    });
    
    const previewUrl = nodemailer.getTestMessageUrl(fallbackInfo);
    console.log(`[Email Service] Fallback email sent: ${fallbackInfo.messageId}`);
    console.log(`[Email Service] ✉️ View test email preview at: ${previewUrl}`);
    return { ...fallbackInfo, previewUrl };
  }
};

export const sendOrderConfirmationEmail = async (order: any) => {
  const customerEmail = order.email;
  const orderId = order._id?.toString() || order.id;
  const amount = order.amount;
  const products = order.products || [];
  const shipping = order.shippingAddress || {};

  const itemsHtml = products
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #666; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Rajasthalii</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f7f9fc;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #eef2f6;
        }
        .header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          padding: 30px 20px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: 1px;
        }
        .content {
          padding: 30px 24px;
        }
        .greeting {
          font-size: 16px;
          line-height: 1.6;
          color: #333333;
          margin-bottom: 20px;
        }
        .order-meta {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          border: 1px solid #e2e8f0;
        }
        .order-meta-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #4a5568;
        }
        .order-meta-item:last-child {
          margin-bottom: 0;
        }
        .order-meta-label {
          font-weight: 600;
        }
        .table-container {
          margin-bottom: 24px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background-color: #f1f5f9;
          color: #475569;
          font-weight: 600;
          text-align: left;
          padding: 12px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .totals-row td {
          padding: 12px;
          font-size: 14px;
          color: #333;
        }
        .grand-total {
          font-size: 16px;
          font-weight: 700;
          color: #1e3c72;
        }
        .shipping-card {
          background-color: #fdfbf7;
          border: 1px solid #f2e7d5;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .shipping-title {
          font-size: 14px;
          font-weight: 700;
          color: #855c26;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .shipping-text {
          font-size: 14px;
          color: #4a5568;
          line-height: 1.5;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .btn {
          background-color: #1e3c72;
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-weight: 600;
          display: inline-block;
          transition: background-color 0.2s ease;
        }
        .footer {
          background-color: #f8fafc;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px solid #eef2f6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Rajasthalii</h1>
        </div>
        <div class="content">
          <div class="greeting">
            <p>Hello,</p>
            <p>Thank you for shopping with us! We are pleased to confirm that your payment has been successfully processed and your order is being prepared.</p>
          </div>
          
          <div class="order-meta">
            <div class="order-meta-item">
              <span class="order-meta-label">Order ID:</span>
              <span>#${orderId}</span>
            </div>
            <div class="order-meta-item">
              <span class="order-meta-label">Date:</span>
              <span>${new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
            </div>
            <div class="order-meta-item">
              <span class="order-meta-label">Status:</span>
              <span style="color: #2e7d32; font-weight: bold;">Paid</span>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="border-top-left-radius: 6px; border-bottom-left-radius: 6px;">Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right; border-top-right-radius: 6px; border-bottom-right-radius: 6px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="totals-row">
                  <td colspan="2" style="text-align: right; font-weight: 600; border-top: 1px solid #eee;">Subtotal:</td>
                  <td style="text-align: right; font-weight: 600; border-top: 1px solid #eee;">₹${(amount - 99).toFixed(2)}</td>
                </tr>
                <tr class="totals-row">
                  <td colspan="2" style="text-align: right; font-weight: 600;">Shipping:</td>
                  <td style="text-align: right; font-weight: 600;">₹99.00</td>
                </tr>
                <tr class="totals-row">
                  <td colspan="2" style="text-align: right; font-weight: 700; border-top: 2px solid #ddd;" class="grand-total">Grand Total:</td>
                  <td style="text-align: right; font-weight: 700; border-top: 2px solid #ddd;" class="grand-total">₹${amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="shipping-card">
            <div class="shipping-title">Delivery Details</div>
            <div class="shipping-text">
              <strong>${shipping.name || "Customer"}</strong><br>
              ${shipping.address || ""}<br>
              ${shipping.city || ""}, ${shipping.state || ""} - ${shipping.pincode || ""}<br>
              Phone: ${shipping.phone || ""}
            </div>
          </div>

          <div class="button-container">
            <a href="http://localhost:3002/orders/status?order_id=${orderId}" class="btn" style="color: #ffffff;">View Order Status</a>
          </div>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact our support at support@rajasthalii.com</p>
          <p>&copy; ${new Date().getFullYear()} Rajasthalii. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to: customerEmail,
    subject: `Order Confirmation - #${orderId}`,
    html: emailHtml,
  });
};

export const sendOrderStatusUpdateEmail = async (order: any, newStatus: string) => {
  const customerEmail = order.email;
  const orderId = order._id?.toString() || order.id;
  const amount = order.amount;
  const products = order.products || [];
  const shipping = order.shippingAddress || {};

  const statusInfo = (() => {
    switch (newStatus) {
      case "pending":
        return {
          title: "Order Pending",
          message: "Your order is pending payment confirmation.",
          color: "#ca8a04",
        };
      case "success":
        return {
          title: "Order Confirmed",
          message: "Your order payment has been successfully processed and your order is being prepared.",
          color: "#15803d",
        };
      case "packed":
        return {
          title: "Order Packed",
          message: "Great news! Your order has been packed and is ready for dispatch.",
          color: "#1d4ed8",
        };
      case "out for delivery":
        return {
          title: "Out for Delivery",
          message: "Your order is out for delivery! Our delivery partner is on their way to your address.",
          color: "#4338ca",
        };
      case "delivered":
        return {
          title: "Order Delivered",
          message: "Your order has been successfully delivered! We hope you love your purchase.",
          color: "#047857",
        };
      case "failed":
        return {
          title: "Order Failed",
          message: "We regret to inform you that your order could not be processed due to a payment or system failure.",
          color: "#b91c1c",
        };
      default:
        return {
          title: "Order Status Updated",
          message: `Your order status has been updated to: ${newStatus}`,
          color: "#475569",
        };
    }
  })();

  const itemsHtml = products
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #666; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Status Update - Rajasthalii</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f7f9fc;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #eef2f6;
        }
        .header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          padding: 30px 20px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: 1px;
        }
        .content {
          padding: 30px 24px;
        }
        .greeting {
          font-size: 16px;
          line-height: 1.6;
          color: #333333;
          margin-bottom: 20px;
        }
        .order-meta {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          border: 1px solid #e2e8f0;
        }
        .order-meta-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #4a5568;
        }
        .order-meta-item:last-child {
          margin-bottom: 0;
        }
        .order-meta-label {
          font-weight: 600;
        }
        .table-container {
          margin-bottom: 24px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background-color: #f1f5f9;
          color: #475569;
          font-weight: 600;
          text-align: left;
          padding: 12px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .totals-row td {
          padding: 12px;
          font-size: 14px;
          color: #333;
        }
        .grand-total {
          font-size: 16px;
          font-weight: 700;
          color: #1e3c72;
        }
        .shipping-card {
          background-color: #fdfbf7;
          border: 1px solid #f2e7d5;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .shipping-title {
          font-size: 14px;
          font-weight: 700;
          color: #855c26;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .shipping-text {
          font-size: 14px;
          color: #4a5568;
          line-height: 1.5;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .btn {
          background-color: #1e3c72;
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-weight: 600;
          display: inline-block;
          transition: background-color 0.2s ease;
        }
        .footer {
          background-color: #f8fafc;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px solid #eef2f6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusInfo.title}</h1>
        </div>
        <div class="content">
          <div class="greeting">
            <p>Hello,</p>
            <p>${statusInfo.message}</p>
          </div>
          
          <div class="order-meta">
            <div class="order-meta-item">
              <span class="order-meta-label">Order ID:</span>
              <span>#${orderId}</span>
            </div>
            <div class="order-meta-item">
              <span class="order-meta-label">Date:</span>
              <span>${new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
            </div>
            <div class="order-meta-item">
              <span class="order-meta-label">Current Status:</span>
              <span style="color: ${statusInfo.color}; font-weight: bold; text-transform: uppercase;">${newStatus}</span>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="border-top-left-radius: 6px; border-bottom-left-radius: 6px;">Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right; border-top-right-radius: 6px; border-bottom-right-radius: 6px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="totals-row">
                  <td colspan="2" style="text-align: right; font-weight: 600; border-top: 1px solid #eee;">Subtotal:</td>
                  <td style="text-align: right; font-weight: 600; border-top: 1px solid #eee;">₹${(amount - 99).toFixed(2)}</td>
                </tr>
                <tr class="totals-row">
                  <td colspan="2" style="text-align: right; font-weight: 600;">Shipping:</td>
                  <td style="text-align: right; font-weight: 600;">₹99.00</td>
                </tr>
                <tr class="totals-row">
                  <td colspan="2" style="text-align: right; font-weight: 700; border-top: 2px solid #ddd;" class="grand-total">Grand Total:</td>
                  <td style="text-align: right; font-weight: 700; border-top: 2px solid #ddd;" class="grand-total">₹${amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="shipping-card">
            <div class="shipping-title">Delivery Details</div>
            <div class="shipping-text">
              <strong>${shipping.name || "Customer"}</strong><br>
              ${shipping.address || ""}<br>
              ${shipping.city || ""}, ${shipping.state || ""} - ${shipping.pincode || ""}<br>
              Phone: ${shipping.phone || ""}
            </div>
          </div>

          <div class="button-container">
            <a href="http://localhost:3002/orders/status?order_id=${orderId}" class="btn" style="color: #ffffff;">View Order Status</a>
          </div>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact our support at support@rajasthalii.com</p>
          <p>&copy; ${new Date().getFullYear()} Rajasthalii. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to: customerEmail,
    subject: `Order Update: #${orderId} - ${statusInfo.title}`,
    html: emailHtml,
  });
};
