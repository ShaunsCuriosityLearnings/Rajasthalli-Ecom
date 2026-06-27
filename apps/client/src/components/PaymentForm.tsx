"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { load } from "@cashfreepayments/cashfree-js";
import { useAuth } from "@clerk/nextjs";

import { PaymentFormInputs, PaymentFormSchema, ShippingFormInputs } from "@repo/types";
import useCartStore from "../stores/cartStore";

interface PaymentFormProps {
  shippingDetails: ShippingFormInputs | null;
}

const PaymentForm = ({ shippingDetails }: PaymentFormProps) => {
  const { getToken } = useAuth();
  const { cart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormInputs>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      paymentMethod: "online",
    },
  });

  const selectedMethod = watch("paymentMethod");

  const handlePaymentForm: SubmitHandler<PaymentFormInputs> = async (data) => {
    if (!shippingDetails || cart.length === 0) {
      alert("Missing shipping details or cart items.");
      return;
    }

    setIsLoading(true);

    try {
      if (data.paymentMethod === "cod") {
        // Handle COD flow directly (e.g., call order-service to create COD order)
        alert("COD order placed successfully!");
        setIsLoading(false);
        return;
      }

      // 1. Get Clerk Authentication Token
      const token = await getToken();
      console.log("🔑 [PaymentForm] Token retrieved from Clerk:", token);
      console.log("📦 [PaymentForm] Cart items payload:", cart);

      // 2. Prepare payload (only item IDs and quantities are sent to prevent tampering)
      const payload = {
        products: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        customer_details: {
          customer_name: shippingDetails.name,
          customer_email: shippingDetails.email,
          customer_phone: shippingDetails.phone,
        },
        shipping_address: shippingDetails,
      };

      // 3. Request payment session from the Payment Service
      console.log("🌐 [PaymentForm] Sending request to payment service...");
      const paymentServiceUrl = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || "http://localhost:8002";
      const res = await fetch(`${paymentServiceUrl}/payments/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("📩 [PaymentForm] Response received from payment service:", result);

      if (!result.success || !result.payment_session_id) {
        throw new Error(result.message || "Failed to create payment session");
      }

      // 4. Initialize Cashfree Web SDK (Sandbox mode)
      const cashfree = await load({
        mode: "sandbox",
      });

      // 5. Trigger checkout modal
      await cashfree.checkout({
        paymentSessionId: result.payment_session_id,
        redirectTarget: "_self", // Redirects on payment finish to handle completion securely
      });

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong during payment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handlePaymentForm)} className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Payment Method</h2>
        <p className="text-sm text-gray-500 mt-1">
          Choose your preferred payment option.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Cashfree Online Checkout */}
        <label
          className={`border rounded-2xl p-4 cursor-pointer transition ${selectedMethod === "online" ? "border-primary-green bg-primary-green/5" : "border-gray-200"
            }`}
        >
          <div className="flex items-center gap-3">
            <input type="radio" value="online" {...register("paymentMethod")} />
            <div>
              <p className="font-semibold text-gray-900">Online Payment (Cashfree)</p>
              <p className="text-xs text-gray-500 font-light">
                Pay securely using Cards, UPI, Netbanking, or Wallets
              </p>
            </div>
          </div>
        </label>

        {/* Cash on Delivery */}
        <label
          className={`border rounded-2xl p-4 cursor-pointer transition ${selectedMethod === "cod" ? "border-primary-green bg-primary-green/5" : "border-gray-200"
            }`}
        >
          <div className="flex items-center gap-3">
            <input type="radio" value="cod" {...register("paymentMethod")} />
            <div>
              <p className="font-semibold text-gray-900">Cash On Delivery</p>
              <p className="text-xs text-gray-500 font-light">Pay when your order arrives</p>
            </div>
          </div>
        </label>
      </div>

      {errors.paymentMethod && (
        <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary-green hover:bg-primary-green-hover disabled:bg-gray-400 text-white py-3.5 rounded-xl font-semibold transition uppercase tracking-wider text-xs cursor-pointer shadow-xs hover:shadow-md mt-2"
      >
        {isLoading ? "Processing..." : "Proceed to Secure Payment"}
      </button>
    </form>
  );
};

export default PaymentForm;
