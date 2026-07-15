import type { Metadata } from "next";
import Link from "next/link";
import { Scale, FileText, ShoppingBag, Truck, CreditCard, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the Terms and Conditions of service, purchasing, shipping, and usage for Rajasthalii.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto font-[family-name:var(--font-body)] text-[#2b2b2b]">
      {/* Page Header Banner */}
      <div className="relative border border-[#c89b3c]/30 rounded-[30px] p-8 md:p-12 bg-[#faf7f2]/50 backdrop-blur-xs shadow-xs text-center mb-12">
        <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c89b3c]/40 rounded-tl-xs" />
        <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#c89b3c]/40 rounded-tr-xs" />
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#c89b3c]/40 rounded-bl-xs" />
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c89b3c]/40 rounded-br-xs" />

        <div className="inline-flex p-3 bg-[#7d1f1f]/5 rounded-full text-[#7d1f1f] mb-4">
          <Scale size={28} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
          Terms & Conditions
        </h1>
        <p className="mt-3 text-sm text-neutral-500 max-w-lg mx-auto">
          Last updated: June 26, 2026. Welcome to Rajasthalii. Please read these terms carefully before accessing or using our services.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10 bg-white border border-neutral-100 rounded-3xl p-6 md:p-12 shadow-xs">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#18320b] font-[family-name:var(--font-heading)] text-xl font-bold">
            <ShoppingBag size={18} className="text-[#c89b3c]" />
            <h2>1. User Accounts and Orders</h2>
          </div>
          <p className="text-neutral-600 leading-relaxed text-sm">
            By placing an order on Rajasthalii, you certify that the billing information provided is complete and accurate. We reserve the right to limit or cancel quantities purchased per person, per household, or per order at our sole discretion.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#18320b] font-[family-name:var(--font-heading)] text-xl font-bold">
            <CreditCard size={18} className="text-[#c89b3c]" />
            <h2>2. Payments and Pricing</h2>
          </div>
          <p className="text-neutral-600 leading-relaxed text-sm">
            All prices are quoted in Indian Rupees (INR) and are inclusive of applicable GST unless specified otherwise. We process online payments securely using Cashfree. Any payment discrepancies or failed transactions are subject to review by our support team.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#18320b] font-[family-name:var(--font-heading)] text-xl font-bold">
            <Truck size={18} className="text-[#c89b3c]" />
            <h2>3. Shipping and Deliveries</h2>
          </div>
          <p className="text-neutral-600 leading-relaxed text-sm">
            Rajasthalii coordinates shipments from our physical shop in Mumbai. Shipping rates and delivery timelines vary depending on your location. Standard delivery in metro cities ranges from 3-5 business days. Please refer to our Shipping Policy for specific rates and exclusions.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#18320b] font-[family-name:var(--font-heading)] text-xl font-bold">
            <FileText size={18} className="text-[#c89b3c]" />
            <h2>4. Intellectual Property</h2>
          </div>
          <p className="text-neutral-600 leading-relaxed text-sm">
            All content on this website, including designs, images, product photos, graphics, logos, and written text, is the exclusive intellectual property of Rajasthalii and protected under Indian copyright laws.
          </p>
        </section>

        {/* Store Location & Contact Card */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl bg-[#faf7f2] border border-[#c89b3c]/35 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#7d1f1f] font-semibold text-sm uppercase tracking-wider">
              <MapPin size={16} />
              <span>Shop Headquarters</span>
            </div>
            <h3 className="text-lg font-bold text-[#18320b] font-[family-name:var(--font-heading)]">
              Rajasthalii Mumbai Shop
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
              Shopno3, Dheeraj Garden, CHS,<br />
              Poonam Nagar, Andheri East,<br />
              Mumbai-93
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#18320b] hover:bg-[#234712] text-white text-center rounded-xl text-xs font-semibold tracking-wider uppercase transition duration-300 shadow-xs hover:shadow-md"
            >
              Contact Support
            </Link>
            <a
              href="https://share.google/Gn2nVYB7feehDXQ0L"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#c89b3c]/50 text-[#18320b] hover:bg-[#c89b3c]/8 text-center rounded-xl text-xs font-semibold tracking-wider uppercase transition duration-300"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
