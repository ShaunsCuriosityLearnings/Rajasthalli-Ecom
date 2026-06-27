"use client";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";

import Image from "next/image";
import { ArrowRight, Trash2, Loader2, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { ShippingFormInputs, ProductType } from "@repo/types";
import useCartStore from "../../stores/cartStore";

const steps = [
  {
    id: 1,
    title: "Shopping Cart",
    description: "Review your selected items",
  },
  {
    id: 2,
    title: "Shipping",
    description: "Enter shipping details",
  },
  {
    id: 3,
    title: "Payment",
    description: "Choose payment method",
  },
];

const CartPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [shippingForm, setShippingForm] = useState<ShippingFormInputs | null>(
    null,
  );
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState<ProductType[]>([]);
  const [recLoading, setRecLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeStep = parseInt(searchParams.get("step") || "1");

  const { cart, addToCart, removeFromCart } = useCartStore();

  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );

  const shipping = 99;
  const total = subtotal + shipping;

  const handleStepChange = (step: number) => {
    router.push(`/cart?step=${step}`, {
      scroll: false,
    });
  };

  // Fetch recommendations in Step 1
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/products?limit=8`);
        if (res.ok) {
          const data = await res.json();
          // Filter out items already in cart
          const filtered = data.filter(
            (p: ProductType) => !cart.some((c) => c.id === p.id)
          );
          setRecommendations(filtered.slice(0, 4));
        }
      } catch (e) {
        console.error("Error fetching cart recommendations:", e);
      } finally {
        setRecLoading(false);
      }
    };
    
    if (activeStep === 1) {
      fetchRecs();
    }
  }, [activeStep, cart]);

  const handleAddRecToCart = (p: ProductType) => {
    const size = selectedSizes[p.id] || p.sizes[0] || "Free Size";
    addToCart({
      ...p,
      quantity: 1,
      selectedSize: size,
    });
    toast.success(`${p.name} added to cart!`);
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 text-primary-green animate-spin" />
        <p className="text-sm font-medium text-gray-500 mt-4">Loading your checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-heading font-bold text-primary-green">Checkout</h1>
        <p className="text-gray-500 mt-2 font-light">Complete your Rajasthalii order</p>
        <div className="w-16 h-0.5 bg-accent-gold mx-auto mt-4" />
      </div>

      {/* STEPS */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16 mb-12">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => handleStepChange(step.id)}
            className={`flex items-center gap-3 border-b-2 pb-4 cursor-pointer transition-all ${
              step.id === activeStep ? "border-primary-green" : "border-gray-200"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white transition-all ${
                step.id === activeStep ? "bg-primary-green ring-4 ring-primary-green/10" : "bg-gray-300"
              }`}
            >
              {step.id}
            </div>

            <div>
              <p
                className={`font-semibold text-sm transition-colors ${
                  step.id === activeStep ? "text-primary-green" : "text-gray-400"
                }`}
              >
                {step.title}
              </p>
              <p className="text-[11px] text-gray-400 font-light">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT SECTION */}
        <div className="w-full lg:w-7/12 shadow-lg border border-gray-100 rounded-3xl p-8 bg-white transition-all">
          {activeStep === 1 ? (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold font-heading text-primary-green pb-4 border-b border-gray-100">
                Shopping Cart
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-light">Your cart is currently empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex items-center justify-between border-b border-gray-50 pb-6"
                  >
                    <div className="flex gap-6">
                      {/* IMAGE */}
                      <div className="relative w-24 h-30 rounded-2xl overflow-hidden bg-gray-50 border border-accent-gold/10">
                        <Image
                          src={item.images.frontView}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-light">
                            {item.shortDescription}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="bg-bg-cream border border-accent-gold/10 px-2 py-0.5 rounded-md font-medium text-[10px] text-accent-brown uppercase">
                              Size: {item.selectedSize}
                            </span>
                            <span className="bg-primary-green/5 border border-primary-green/10 px-2 py-0.5 rounded-md font-medium text-[10px] text-primary-green">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>

                        <p className="font-bold text-base text-heritage-maroon">
                          ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => removeFromCart(item)}
                      className="w-10 h-10 rounded-full bg-heritage-maroon/5 hover:bg-heritage-maroon/10 transition-all duration-300 flex items-center justify-center text-heritage-maroon cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : activeStep === 2 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 3 ? (
            shippingForm ? (
              <PaymentForm shippingDetails={shippingForm} />
            ) : (
              <p className="text-center text-gray-500 py-8">
                Please fill the shipping form first.
              </p>
            )
          ) : null}
        </div>

        {/* RIGHT SECTION (ORDER SUMMARY) */}
        <div className="w-full lg:w-5/12">
          <div className="sticky top-24 shadow-lg border border-accent-gold/20 rounded-3xl p-8 bg-white flex flex-col gap-6">
            <h2 className="text-xl font-bold font-heading text-primary-green pb-4 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-light">Subtotal</span>
                <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 font-light">Shipping</span>
                <span className="font-semibold text-gray-800">₹{shipping.toLocaleString("en-IN")}</span>
              </div>

              <hr className="border-gray-100" />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-primary-green">Total</span>
                <span className="text-heritage-maroon">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              {activeStep > 1 && (
                <button
                  onClick={() => handleStepChange(activeStep - 1)}
                  className="flex-1 border border-accent-brown hover:bg-accent-brown hover:text-white text-accent-brown py-3 rounded-xl font-semibold transition text-xs md:text-sm tracking-wider uppercase cursor-pointer"
                >
                  Back
                </button>
              )}

              {activeStep < 3 ? (
                <button
                  onClick={() => handleStepChange(activeStep + 1)}
                  disabled={cart.length === 0}
                  className="flex-1 bg-primary-green hover:bg-primary-green-hover disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer text-xs md:text-sm tracking-wider uppercase shadow-xs hover:shadow"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 text-accent-gold" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS (ONLY VISIBLE IN STEP 1) */}
      {activeStep === 1 && recommendations.length > 0 && (
        <div className="mt-16 pt-10 border-t border-accent-gold/20">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-8 bg-accent-gold/40" />
            <h3 className="text-xl md:text-2xl font-bold tracking-wider text-primary-green font-[family-name:var(--font-heading)] uppercase">
              Complete Your Look
            </h3>
            <Sparkles className="w-5 h-5 text-accent-gold animate-pulse" />
            <span className="h-px w-8 bg-accent-gold/40" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((p) => {
              const currentSize = selectedSizes[p.id] || p.sizes[0] || "";
              return (
                <div key={p.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                    <Image
                      src={p.images.frontView}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#7d1f1f] text-[#faf7f2] text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full shadow-xs">
                      Artisan Hand
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-primary-green transition-colors duration-200">{p.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed font-light">{p.shortDescription}</p>
                    </div>
                    
                    <div className="mt-4">
                      {p.sizes.length > 0 && (
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Size</span>
                          <select
                            value={currentSize}
                            onChange={(e) => setSelectedSizes(prev => ({ ...prev, [p.id]: e.target.value }))}
                            className="text-[10px] border border-gray-200 rounded px-1.5 py-0.5 outline-none focus:border-accent-gold bg-bg-cream/40"
                          >
                            {p.sizes.map((s) => (
                              <option key={s} value={s}>{s.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="font-bold text-sm text-heritage-maroon">₹{Number(p.price).toLocaleString("en-IN")}</span>
                        <button
                          onClick={() => handleAddRecToCart(p)}
                          className="px-3 py-1.5 bg-primary-green hover:bg-primary-green-hover text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-xs hover:shadow cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPageContent;
