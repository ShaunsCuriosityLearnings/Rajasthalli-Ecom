"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function SeoSections() {
  // FAQ accordion toggles
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What makes Rajasthalii traditional Indian wear authentic?",
      answer: "Rajasthalii specializes in authentic, artisan-direct traditional wear for women. Every piece—from our hand-dyed Bandhani sarees from Jodhpur to our intricate Rajputi Poshaks—is crafted by master artisans in Rajasthan and finished in our Mumbai boutique, keeping heritage techniques alive."
    },
    {
      question: "Do you offer custom tailoring and bridal services?",
      answer: "Yes, we offer bespoke tailoring and custom sizing, particularly for Rajputi Poshaks and bridal Ghagra Cholis. You can visit our boutique in Andheri East, Mumbai, or raise a customization query through our Customer Support page to consult with our designers."
    },
    {
      question: "Where is the Rajasthalii showroom located in Mumbai?",
      answer: "Our retail showroom is located at Shop No. 3, Building 3, Sardar Vallabhai Patel Rd, Ram Nagar, Takshila Colony, Indira Nagar, Andheri East, Mumbai, Maharashtra 400093. Customers are welcome to visit to inspect fabrics, request custom sizing, or pick up orders."
    },
    {
      question: "What is your shipping, delivery, and return policy?",
      answer: "We ship all across India directly from our Mumbai location. Standard delivery takes 3 to 5 business days, and shipping is free for all orders. We offer a hassle-free 7-day return and exchange policy on all standard sizing orders, excluding customized tailor-made poshaks."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Structured JSON-LD Schema for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="mt-20 space-y-24 font-[family-name:var(--font-body)] text-[#2b2b2b]">
      {/* 3. FAQ Accordion Section */}
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Dynamic Schema Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <div className="text-center">
          <div className="inline-flex p-2 bg-[#18320b]/5 rounded-full text-[#18320b] mb-3">
            <HelpCircle size={22} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-500 text-xs mt-2">
            Have questions about orders, sizing, or our Mumbai boutique location? Find quick answers here.
          </p>
        </div>

        <div className="space-y-4 mt-6">
          {faqs.map((faq, index) => {
            const isFaqOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-neutral-200/60 rounded-2xl bg-white overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center px-6 py-4.5 text-left text-sm md:text-base font-semibold text-neutral-800 hover:bg-[#faf7f2]/30 transition select-none cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  {isFaqOpen ? (
                    <ChevronUp size={16} className="text-[#7d1f1f] shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-neutral-400 shrink-0" />
                  )}
                </button>
                {isFaqOpen && (
                  <div className="px-6 pb-5 text-xs md:text-sm text-neutral-600 leading-relaxed font-light border-t border-neutral-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
