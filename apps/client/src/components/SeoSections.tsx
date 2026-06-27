"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Scissors, Layers, BookOpen, HeartHandshake, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

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
      {/* 1. Artisan Heritage & Craftsmanship Section */}
      <div className="relative border border-[#c89b3c]/25 rounded-[36px] p-8 md:p-16 bg-[#faf7f2]/30 backdrop-blur-xs shadow-xs">
        {/* Decorative Heritage Corner Borders */}
        <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#c89b3c]/35 rounded-tl-sm pointer-events-none" />
        <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#c89b3c]/35 rounded-tr-sm pointer-events-none" />
        <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#c89b3c]/35 rounded-bl-sm pointer-events-none" />
        <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#c89b3c]/35 rounded-br-sm pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] md:text-xs text-[#7d1f1f] uppercase tracking-widest font-bold font-[family-name:var(--font-body)]">
            Handcrafted Heritage
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] mt-2 tracking-wide">
            Our Traditional Craftsmanship
          </h2>
          <p className="mt-4 text-sm text-neutral-500 leading-relaxed font-light">
            Rajasthalii was born from a desire to preserve and share the exquisite art forms of Rajasthan. By sourcing fabrics directly from local master artisans, we bring authentic heritage fashion to modern lifestyles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Bandhani Dyeing */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 md:p-8 hover:shadow-md transition duration-300">
            <div className="inline-flex p-3 bg-[#7d1f1f]/8 rounded-2xl text-[#7d1f1f] mb-5">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
              Bandhani Tie-Dye Art
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed mt-2 font-light">
              Crafted in Rajasthan using traditional tying threads, our Bandhani sarees represent months of patient handwork. Each tie-dye dot is individually hand-pinched and tied prior to dye immersion.
            </p>
          </div>

          {/* Card 2: Rajputi Poshaks */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 md:p-8 hover:shadow-md transition duration-300">
            <div className="inline-flex p-3 bg-[#c89b3c]/10 rounded-2xl text-[#c89b3c] mb-5">
              <Layers size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
              Royal Gota Patti & Zardozi
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed mt-2 font-light">
              Adorned with gold thread work and appliqués, our Rajputi Poshaks emulate royalty. Each set comes with a Kanchli, Kurti, Ghagra, and Odhni, featuring intricate custom craftsmanship.
            </p>
          </div>

          {/* Card 3: Block Prints */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 md:p-8 hover:shadow-md transition duration-300">
            <div className="inline-flex p-3 bg-[#18320b]/8 rounded-2xl text-[#18320b] mb-5">
              <Scissors size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
              Hand Block Prints
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed mt-2 font-light">
              Utilizing hand-carved wooden blocks and organic, plant-based dyes, our everyday summer wear represents centuries of Jaipuri textile heritage, ensuring natural comfort and breathability.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Styling Lookbook Guides */}
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] md:text-xs text-[#7d1f1f] uppercase tracking-widest font-bold">
            Fashion Guides
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] mt-2 tracking-wide">
            Rajasthalii Styling Lookbooks
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="group border border-neutral-200/50 rounded-2xl overflow-hidden bg-white hover:-translate-y-1 transition duration-300 hover:shadow-lg flex flex-col justify-between">
            <div className="p-6">
              <div className="flex items-center gap-2 text-[#c89b3c] font-semibold text-[10px] uppercase tracking-wider mb-2">
                <BookOpen size={12} />
                <span>Draping Guide</span>
              </div>
              <h3 className="text-lg font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
                How to Style a Rajputi Poshak
              </h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                Discover the traditional rules of styling poshas: from matching the color schemes of the Kurti and Odhni to accessorizing with Kundan and Meenakari jewelry.
              </p>
            </div>
            <div className="px-6 pb-6 pt-2">
              <Link href="/products" className="text-xs font-semibold text-[#7d1f1f] hover:text-[#912525] uppercase tracking-wider flex items-center gap-1">
                Read Lookbook &rarr;
              </Link>
            </div>
          </div>

          <div className="group border border-neutral-200/50 rounded-2xl overflow-hidden bg-white hover:-translate-y-1 transition duration-300 hover:shadow-lg flex flex-col justify-between">
            <div className="p-6">
              <div className="flex items-center gap-2 text-[#18320b] font-semibold text-[10px] uppercase tracking-wider mb-2">
                <HeartHandshake size={12} />
                <span>Bespoke Styling</span>
              </div>
              <h3 className="text-lg font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
                Bridal Wear & Tailoring
              </h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                Learn how we personalize bridal orders. Drop by our Mumbai showroom for personalized measurements, fabric selections, and motif designs to craft your dream wear.
              </p>
            </div>
            <div className="px-6 pb-6 pt-2">
              <Link href="/contact" className="text-xs font-semibold text-[#7d1f1f] hover:text-[#912525] uppercase tracking-wider flex items-center gap-1">
                Book Designer Consult &rarr;
              </Link>
            </div>
          </div>

          <div className="group border border-neutral-200/50 rounded-2xl overflow-hidden bg-white hover:-translate-y-1 transition duration-300 hover:shadow-lg flex flex-col justify-between">
            <div className="p-6">
              <div className="flex items-center gap-2 text-[#7d1f1f] font-semibold text-[10px] uppercase tracking-wider mb-2">
                <ShieldCheck size={12} />
                <span>Fabric Care</span>
              </div>
              <h3 className="text-lg font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
                Caring for Hand-dyed Silks
              </h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                Handcrafted garments require specific love. Read our guides on conserving organic plant dyes, storing Bandhani silk folds, and iron safety for heavy Zardozi embroidery.
              </p>
            </div>
            <div className="px-6 pb-6 pt-2">
              <Link href="/privacy-policy" className="text-xs font-semibold text-[#7d1f1f] hover:text-[#912525] uppercase tracking-wider flex items-center gap-1">
                Read Fabric Care Guidelines &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

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
