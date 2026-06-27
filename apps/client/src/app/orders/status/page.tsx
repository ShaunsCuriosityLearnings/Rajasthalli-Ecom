import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import OrderStatusPageContent from "./OrderStatusPageContent";

export default function OrderStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-12 h-12 text-lime-600 animate-spin" />
            <h1 className="text-xl font-semibold text-gray-900">Loading Order Verification</h1>
          </div>
        </div>
      }
    >
      <OrderStatusPageContent />
    </Suspense>
  );
}
