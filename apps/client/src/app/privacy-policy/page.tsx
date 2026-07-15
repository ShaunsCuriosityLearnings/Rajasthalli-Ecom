import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Eye, Lock, FileText, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Rajasthalii protects, manages, and respects the privacy of your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto font-[family-name:var(--font-body)] text-[#2b2b2b]">
      {/* Page Header Banner */}
      <div className="relative border border-[#c89b3c]/30 rounded-[30px] p-8 md:p-12 bg-[#faf7f2]/50 backdrop-blur-xs shadow-xs text-center mb-12">
        <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c89b3c]/40 rounded-tl-xs" />
        <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#c89b3c]/40 rounded-tr-xs" />
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#c89b3c]/40 rounded-bl-xs" />
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c89b3c]/40 rounded-br-xs" />

        <div className="inline-flex p-3 bg-[#7d1f1f]/5 rounded-full text-[#7d1f1f] mb-4">
          <Shield size={28} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-neutral-500 max-w-lg mx-auto">
          Last updated: June 26, 2026. At Rajasthalii, your privacy is our top priority. Learn how we handle your personal data.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10 bg-white border border-neutral-100 rounded-3xl p-6 md:p-12 shadow-xs">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#18320b] font-[family-name:var(--font-heading)] text-xl font-bold">
            <Eye size={18} className="text-[#c89b3c]" />
            <h2>1. Information We Collect</h2>
          </div>
          <p className="text-neutral-600 leading-relaxed text-sm">
            We collect information you provide directly to us when creating an account, making a purchase, subscribing to our newsletter, or contacting our customer support team. This information may include:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-neutral-600 text-sm pl-2">
            <li>Name, email address, billing address, shipping address, and phone number.</li>
            <li>Payment details (processed securely via Cashfree; we do not store raw card credentials).</li>
            <li>Order history, preferred categories, and communications with our customer care.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#18320b] font-[family-name:var(--font-heading)] text-xl font-bold">
            <Lock size={18} className="text-[#c89b3c]" />
            <h2>2. How We Secure Your Data</h2>
          </div>
          <p className="text-neutral-600 leading-relaxed text-sm">
            We employ industry-standard encryption protocol (SSL) and secure backend services to safeguard your sensitive information. Access to your personal data is restricted to authorized personnel who require it to complete your orders or address support queries.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#18320b] font-[family-name:var(--font-heading)] text-xl font-bold">
            <FileText size={18} className="text-[#c89b3c]" />
            <h2>3. Usage of Personal Data</h2>
          </div>
          <p className="text-neutral-600 leading-relaxed text-sm">
            Your data enables us to process transactions swiftly, manage shipping logistically, send order confirmations, and dispatch promotional offers (only if you opt-in). We do not rent, sell, or trade your personal information with third-party advertisers.
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
