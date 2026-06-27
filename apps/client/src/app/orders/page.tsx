"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { 
  ShoppingBag, 
  Calendar, 
  Tag, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBagIcon,
  Package,
  Truck
} from "lucide-react";

import { ShippingFormInputs } from "@repo/types";

interface OrderProduct {
  name: string;
  quantity: number;
  price: number;
}

interface OrderType {
  _id: string;
  userId: string;
  email: string;
  amount: number;
  status: "pending" | "success" | "failed" | "packed" | "out for delivery" | "delivered";
  products: OrderProduct[];
  shippingAddress?: ShippingFormInputs;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const { isLoaded, userId, getToken } = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      
      const orderServiceUrl = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8001";
      const res = await fetch(`${orderServiceUrl}/user-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch your orders. Please try again later.");
      }

      const data = await res.json();
      // Sort orders by newest first
      const sorted = data.sort(
        (a: OrderType, b: OrderType) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    
    if (userId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isLoaded, userId]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#c89b3c] animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading your order history...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-[#7d1f1f]/5 rounded-full flex items-center justify-center text-[#7d1f1f] mb-6">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Sign In to View Orders</h1>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          Please sign in to your account to view your past purchases, track active deliveries, and manage your billing history.
        </p>
        <Link
          href="/sign-in"
          className="bg-[#7d1f1f] hover:bg-[#631818] text-white px-8 py-3 rounded-xl font-medium transition duration-200"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Something Went Wrong</h1>
        <p className="text-sm text-gray-500 max-w-sm mb-6">{error}</p>
        <button
          onClick={fetchOrders}
          className="bg-[#7d1f1f] hover:bg-[#631818] text-white px-8 py-3 rounded-xl font-medium transition duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#e3dac9] pb-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-[#7d1f1f] mb-3 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <h1 className="text-4xl font-heading font-bold text-[#7d1f1f]">My Order History</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and track all your handcrafted Rajasthalii purchases.
          </p>
        </div>
        <div className="bg-white border border-[#e3dac9] rounded-2xl p-4 flex items-center gap-4 shadow-sm self-start">
          <div className="w-10 h-10 bg-[#c89b3c]/10 rounded-xl flex items-center justify-center text-[#c89b3c]">
            <ShoppingBagIcon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-xs text-gray-500 block">Total Orders</span>
            <span className="text-lg font-bold text-gray-900">{orders.length}</span>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#e3dac9] rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#c89b3c]/10 rounded-full flex items-center justify-center text-[#c89b3c] mx-auto mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">No Orders Placed Yet</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            You haven't purchased anything yet. Head back to our collections to explore beautiful Rajasthani fabrics and wear.
          </p>
          <Link
            href="/products"
            className="bg-[#7d1f1f] hover:bg-[#631818] text-white px-8 py-3 rounded-xl font-medium transition duration-200 inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <div
                key={order._id}
                className="bg-white border border-[#e3dac9] hover:border-[#c89b3c]/50 rounded-3xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-gray-50/50 border-b border-[#e3dac9] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-xs text-gray-500 block uppercase tracking-wider">Placed On</span>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formattedDate}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block uppercase tracking-wider">Order ID</span>
                      <span className="text-sm font-mono font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {order._id}
                      </span>
                    </div>
                  </div>

                  <div>
                    {order.status === "success" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid & Confirmed
                      </span>
                    )}
                    {order.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                        <Clock className="w-3.5 h-3.5" /> Pending Payment
                      </span>
                    )}
                    {order.status === "failed" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3.5 h-3.5" /> Payment Failed
                      </span>
                    )}
                    {order.status === "packed" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <Package className="w-3.5 h-3.5" /> Packed
                      </span>
                    )}
                    {order.status === "out for delivery" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <Truck className="w-3.5 h-3.5" /> Out for Delivery
                      </span>
                    )}
                    {order.status === "delivered" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Body / Products List */}
                <div className="p-6">
                  <div className="divide-y divide-gray-100">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#faf7f2] border border-[#e3dac9] rounded-xl flex items-center justify-center text-[#7d1f1f] font-heading font-bold text-lg shadow-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm md:text-base">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800 text-sm">
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-gray-400">per item</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.shippingAddress && (
                    <div className="mt-4 pt-4 border-t border-[#e3dac9]/60 text-xs text-gray-500">
                      <p className="font-semibold text-[#7d1f1f] uppercase tracking-wider mb-1">Delivery Address</p>
                      <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                      <p className="mt-0.5">Phone: {order.shippingAddress.phone}</p>
                    </div>
                  )}
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50/30 border-t border-[#e3dac9] px-6 py-4 flex items-center justify-between gap-4">
                  <div className="text-xs text-gray-400">
                    Registered Email: <span className="font-medium text-gray-600">{order.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Total Paid:</span>
                    <span className="text-xl font-bold text-[#7d1f1f]">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
