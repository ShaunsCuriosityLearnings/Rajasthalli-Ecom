"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingBag, CheckCircle, Loader2, PackageOpen } from "lucide-react";
import { OrderType } from "@repo/types";

export default function PaidOrdersToPack() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8001";
      const res = await fetch(`${baseUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.statusText}`);
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      // Filter for paid orders waiting to be packed (status === "success")
      const paidOrders = list.filter((order: OrderType) => order.status === "success");
      setOrders(paidOrders);
    } catch (err: unknown) {
      console.error("Error fetching orders to pack:", err);
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleMarkAsPacked = async (orderId: string) => {
    try {
      setUpdatingId(orderId);
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8001";
      const res = await fetch(`${baseUrl}/orders/${orderId}/admin-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "packed" }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update status to packed");
      }

      // Remove from list or update status in local state
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err: unknown) {
      console.error("Error marking order as packed:", err);
      alert(err instanceof Error ? err.message : "Could not update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full max-h-[480px]">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-primary" />
          Paid Orders to Pack
        </CardTitle>
        <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
          {orders.length} Pending
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <span className="text-sm">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 text-sm">
            {error}
            <Button variant="outline" size="sm" onClick={fetchOrders} className="mt-2 block mx-auto">
              Retry
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-full text-green-500 mb-3">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">All Caught Up!</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px]">
              There are no new paid orders waiting to be packed.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 space-y-4">
            {orders.map((order) => (
              <div key={order._id} className={`pt-3 first:pt-0 flex flex-col gap-2`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs text-zinc-400 font-mono block truncate">
                      ID: {order._id}
                    </span>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 block truncate">
                      {order.shippingAddress?.name || order.email}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(order.amount)}
                    </span>
                  </div>
                </div>

                {order.products && order.products.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-md text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                    {order.products.map((p, pIdx) => (
                      <div key={pIdx} className="flex justify-between">
                        <span>{p.name}</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">x{p.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {order.shippingAddress?.city ? `${order.shippingAddress.city}, ${order.shippingAddress.state}` : "No address"}
                  </span>
                  <Button
                    size="sm"
                    className="h-8 font-medium bg-primary text-primary-foreground hover:bg-primary/95 text-xs flex items-center gap-1.5"
                    disabled={updatingId === order._id}
                    onClick={() => handleMarkAsPacked(order._id)}
                  >
                    {updatingId === order._id ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Packing...
                      </>
                    ) : (
                      <>
                        <PackageOpen className="h-3.5 w-3.5" />
                        Mark as Packed
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
