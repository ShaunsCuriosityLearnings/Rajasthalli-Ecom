"use client";

import React from "react";
import { RotateCcw, Sparkles, Truck, Home } from "lucide-react";

export default function WhyShopWithUs() {
  const pillars = [
    {
      icon: <RotateCcw className="w-8 h-8 text-[#7d1f1f] group-hover:rotate-[-15deg] transition-transform duration-300" />,
      title: "Hassle-Free Returns",
      description: "Shop with absolute confidence thanks to our stress-free 7-day return and exchange policy on all standard sizing orders."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-[#c89b3c] group-hover:scale-110 transition-transform duration-300" />,
      title: "Curated Quality",
      description: "From our traditional apparel to our hand-dyed bedsheets, every single item is carefully selected and finished in Mumbai to ensure the highest standard of quality."
    },
    {
      icon: <Truck className="w-8 h-8 text-[#18320b] group-hover:translate-x-1 transition-transform duration-300" />,
      title: "Fair & Transparent Shipping",
      description: "No hidden fees—shipping charges are calculated transparently based on your location and order total, ensuring you always get a fair rate."
    },
    {
      icon: <Home className="w-8 h-8 text-[#7d1f1f] group-hover:scale-105 transition-transform duration-300" />,
      title: "Home & Wardrobe Elegance",
      description: "We are your one-stop shop for both personal style and home aesthetics, seamlessly bringing the warmth of Rajasthani culture into your daily life."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#faf7f2]/30 border-y border-[#c89b3c]/15 relative overflow-hidden font-[family-name:var(--font-body)]">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-[#c89b3c]/3 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#7d1f1f]/3 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] md:text-xs text-[#7d1f1f] uppercase tracking-widest font-bold font-[family-name:var(--font-body)]">
            Our Promise
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] mt-2 tracking-wide">
            Why Shop With Us
          </h2>
          <div className="h-0.5 w-16 bg-[#c89b3c]/60 mx-auto mt-3" />
          <p className="text-neutral-500 text-xs sm:text-sm mt-3 leading-relaxed">
            Discover what makes shopping with Rajasthalii a truly unique and premium experience.
          </p>
        </div>

        {/* Grid of Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="group border border-neutral-200/50 rounded-2xl bg-white p-6 hover:border-[#c89b3c]/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative Corner Flourish */}
              <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-transparent group-hover:border-[#c89b3c]/40 transition-colors duration-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-transparent group-hover:border-[#c89b3c]/40 transition-colors duration-300" />
              <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-transparent group-hover:border-[#c89b3c]/40 transition-colors duration-300" />
              <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-transparent group-hover:border-[#c89b3c]/40 transition-colors duration-300" />

              <div className="p-3 bg-[#faf7f2] rounded-xl inline-block mb-5">
                {pillar.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide group-hover:text-[#7d1f1f] transition-colors duration-200">
                {pillar.title}
              </h3>
              <p className="text-neutral-500 text-xs sm:text-sm mt-2 leading-relaxed font-light">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
