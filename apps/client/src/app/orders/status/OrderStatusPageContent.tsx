"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import useCartStore from "@/stores/cartStore";

export default function OrderStatusPageContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const { clearCart, hasHydrated } = useCartStore();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<"success" | "failed" | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!hasHydrated) return;

        if (!orderId) {
            setError("No Order ID found in URL parameters.");
            setLoading(false);
            return;
        }

        const verifyCheckout = async () => {
            try {
                // Call payment-service to verify status directly with Cashfree
                const paymentServiceUrl = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || "http://localhost:8002";
                const res = await fetch(`${paymentServiceUrl}/payments/verify/${orderId}`);
                const result = await res.json();

                if (res.ok && result.success && result.status === "success") {
                    setStatus("success");
                    clearCart(); // Securely clear cart only on successful validation
                } else {
                    setStatus("failed");
                    setError(result.message || "Payment verification failed or was cancelled.");
                }
            } catch (err: any) {
                setStatus("failed");
                setError(err.message || "An unexpected error occurred during verification.");
            } finally {
                setLoading(false);
            }
        };

        verifyCheckout();
    }, [orderId, clearCart, hasHydrated]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
                {loading ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Loader2 className="w-12 h-12 text-primary-green animate-spin" />
                        <h1 className="text-xl font-bold text-gray-900 font-heading">Verifying Payment Status</h1>
                        <p className="text-sm text-gray-500 font-light">Please do not refresh or close this tab...</p>
                    </div>
                ) : status === "success" ? (
                    <div className="flex flex-col items-center gap-6 py-6">
                        <div className="w-20 h-20 bg-primary-green/5 rounded-full flex items-center justify-center text-primary-green">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-heading">Order Placed!</h1>
                            <p className="text-sm text-gray-500 mt-2 font-light">
                                Thank you for your purchase. Your payment was verified successfully.
                            </p>
                            <div className="mt-4 bg-bg-cream rounded-xl p-3 inline-block border border-accent-gold/20">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Order Reference ID</span>
                                <span className="text-sm font-semibold text-gray-800 font-mono">{orderId}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full mt-4">
                            <Link
                                href="/orders"
                                className="w-full bg-primary-green hover:bg-primary-green-hover text-white py-3 rounded-xl font-semibold uppercase tracking-wider text-xs transition text-center shadow-xs hover:shadow"
                            >
                                View My Orders
                            </Link>
                            <Link
                                href="/"
                                className="w-full border border-accent-brown text-accent-brown hover:bg-accent-brown hover:text-white py-3 rounded-xl font-semibold uppercase tracking-wider text-xs transition text-center"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 py-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                            <XCircle className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-heading">Payment Failed</h1>
                            <p className="text-sm text-gray-500 mt-2 font-light">
                                We couldn't verify your transaction. Any debited amount will be refunded.
                            </p>
                            {error && (
                                <p className="text-xs text-red-500 mt-4 bg-red-50 border border-red-100 rounded-lg p-3">
                                    {error}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-3 w-full mt-4">
                            <Link
                                href="/cart?step=3"
                                className="w-full bg-primary-green hover:bg-primary-green-hover text-white py-3 rounded-xl font-semibold uppercase tracking-wider text-xs transition text-center shadow-xs hover:shadow"
                            >
                                Try Again
                            </Link>
                            <Link
                                href="/"
                                className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold uppercase tracking-wider text-xs hover:bg-gray-50 transition text-center"
                            >
                                Go to Homepage
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
