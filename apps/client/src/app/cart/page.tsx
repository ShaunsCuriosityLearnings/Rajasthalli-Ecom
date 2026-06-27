import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CartPageContent from "./CartPageContent";

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-[#c89b3c] animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading checkout page...</p>
        </div>
      }
    >
      <CartPageContent />
    </Suspense>
  );
}
