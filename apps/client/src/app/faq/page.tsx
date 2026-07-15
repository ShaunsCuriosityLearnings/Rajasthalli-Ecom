"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What makes Rajasthalii different?",
      answer: (
        <p>
          Rajasthalii specializes in authentic, artisan-direct traditional Rajasthani wear for her. Every piece—from our hand-dyed Rajasthani bedsheets to our gorgeous heritage attire—is crafted by master artisans in Rajasthan and finished in our Mumbai shop, keeping heritage techniques alive.
        </p>
      )
    },
    {
      question: "Where is the Rajasthalii showroom located in Mumbai?",
      answer: (
        <p>
          Our retail showroom is located at **Shopno3, Dheeraj Garden, CHS, Poonam Nagar, Andheri East Mumbai-93**. Customers are welcome to visit to inspect fabrics, request custom sizing, or pick up orders.
        </p>
      )
    },
    {
      question: "Why Shop With Us",
      answer: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-neutral-800 text-sm sm:text-base">Hassle-Free Returns</h4>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Shop with absolute confidence thanks to our stress-free 7-day return and exchange policy on all standard sizing orders.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800 text-sm sm:text-base">Curated Quality</h4>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              From our traditional apparel to our hand-dyed bedsheets, every single item is carefully selected and finished in Mumbai to ensure the highest standard of quality.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800 text-sm sm:text-base">Fair & Transparent Shipping</h4>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              No hidden fees—shipping charges are calculated transparently based on your location and order total, ensuring you always get a fair rate.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800 text-sm sm:text-base">Home & Wardrobe Elegance</h4>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              We are your one-stop shop for both personal style and home aesthetics, seamlessly bringing the warmth of Rajasthani culture into your daily life.
            </p>
          </div>
        </div>
      )
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 font-[family-name:var(--font-body)] text-[#2b2b2b]">
      {/* Back to Home Button */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[#7d1f1f] transition duration-200">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Page Header Banner */}
      <div className="relative border border-[#c89b3c]/30 rounded-[30px] p-8 md:p-12 bg-[#faf7f2]/50 backdrop-blur-xs shadow-xs text-center mb-12">
        <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c89b3c]/40 rounded-tl-xs" />
        <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#c89b3c]/40 rounded-tr-xs" />
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#c89b3c]/40 rounded-bl-xs" />
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c89b3c]/40 rounded-br-xs" />

        <div className="inline-flex p-3 bg-[#18320b]/5 rounded-full text-[#18320b] mb-4">
          <HelpCircle size={28} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
          Find answers to frequently asked queries about our authentic traditional wear, shop policies, and custom orders.
        </p>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isFaqOpen = openFaq === index;
          return (
            <div
              key={index}
              className="border border-neutral-200/65 rounded-2xl bg-white overflow-hidden transition-all duration-300 shadow-2xs hover:shadow-xs"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center px-6 py-5 text-left text-sm md:text-base font-semibold text-neutral-800 hover:bg-[#faf7f2]/30 transition select-none cursor-pointer"
              >
                <span className="pr-4">{faq.question}</span>
                {isFaqOpen ? (
                  <ChevronUp size={18} className="text-[#7d1f1f] shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-neutral-400 shrink-0" />
                )}
              </button>
              {isFaqOpen && (
                <div className="px-6 pb-6 text-xs md:text-sm text-neutral-600 leading-relaxed font-light border-t border-neutral-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
