"use client";

import React, { useState } from "react";
import { Mail, MapPin, Phone, Clock, Send, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order Status & Delivery",
    orderId: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subjects = [
    "Order Status & Delivery",
    "Returns & Exchanges",
    "Product Inquiry",
    "Sizing & Customizations",
    "Payment & Invoicing",
    "Store Feedback / Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields (Name, Email, and Message).");
      return;
    }

    setIsLoading(true);

    try {
      const emailServiceUrl =
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || "http://localhost:8005";

      // 1. Compile Admin Notification Email
      const adminEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #18320b; border-bottom: 2px solid #c89b3c; padding-bottom: 8px;">New Customer Support Query</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #4b5563;">Name:</td>
              <td style="padding: 8px 0; color: #111827;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Email:</td>
              <td style="padding: 8px 0; color: #111827;"><a href="mailto:${formData.email}" style="color: #7d1f1f; text-decoration: none;">${formData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Subject:</td>
              <td style="padding: 8px 0; color: #111827;">${formData.subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Order ID:</td>
              <td style="padding: 8px 0; color: #111827;">${formData.orderId || "Not Provided"}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #faf7f2; border-left: 4px solid #7d1f1f; border-radius: 4px;">
            <h4 style="margin: 0 0 8px 0; color: #7d1f1f; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message Details:</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${formData.message}</p>
          </div>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 25px; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 15px;">
            Rajasthalii Support Automation • Mumbai Boutique Desk
          </p>
        </div>
      `;

      // 2. Compile Customer Confirmation Email
      const customerEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #18320b; margin: 0; font-size: 28px; letter-spacing: 2px;">Rajasthalii</h1>
            <p style="color: #7d1f1f; margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">Heritage • Elegance • Tradition</p>
          </div>
          <div style="border-top: 1px solid #c89b3c; padding-top: 20px;">
            <p style="font-size: 15px; color: #374151; line-height: 1.6;">Hello <strong>${formData.name}</strong>,</p>
            <p style="font-size: 15px; color: #374151; line-height: 1.6;">
              Thank you for reaching out to us! We have successfully received your customer support query regarding "<strong>${formData.subject}</strong>".
            </p>
            <p style="font-size: 15px; color: #374151; line-height: 1.6;">
              Our dedicated store assistance team in Mumbai is currently reviewing your request and will get back to you within 24 to 48 business hours.
            </p>
            ${formData.orderId ? `<p style="font-size: 14px; color: #4b5563; background-color: #f3f4f6; padding: 10px; border-radius: 6px; display: inline-block;"><strong>Associated Order ID:</strong> #${formData.orderId}</p>` : ""}
          </div>
          <div style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px; font-size: 13px; color: #6b7280; line-height: 1.5;">
            <p style="margin: 0; font-weight: bold; color: #18320b;">Rajasthalii Mumbai Boutique</p>
            <p style="margin: 4px 0 0 0;">
              Shop No. 3, Building 3, Sardar Vallabhai Patel Rd,<br />
              Ram Nagar, Takshila Colony, Indira Nagar,<br />
              Andheri East, Mumbai, Maharashtra 400093
            </p>
            <p style="margin: 10px 0 0 0; color: #7d1f1f;">Hours: 10:00 AM - 9:30 PM (Daily)</p>
          </div>
        </div>
      `;

      // 3. Fire requests concurrently to email-service
      // Send notification to Admin (store email)
      const adminPromise = fetch(`${emailServiceUrl}/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "shantanusudhirkamble.india@gmail.com",
          subject: `[Rajasthalii Support] Query: ${formData.subject} from ${formData.name}`,
          html: adminEmailHtml,
        }),
      });

      // Send confirmation copy to Customer
      const customerPromise = fetch(`${emailServiceUrl}/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formData.email,
          subject: `We've received your query - Rajasthalii`,
          html: customerEmailHtml,
        }),
      });

      const [adminRes, customerRes] = await Promise.all([adminPromise, customerPromise]);

      if (adminRes.ok && customerRes.ok) {
        setIsSubmitted(true);
        toast.success("Query submitted! We have sent a confirmation email to you.");
        setFormData({
          name: "",
          email: "",
          subject: "Order Status & Delivery",
          orderId: "",
          message: "",
        });
      } else {
        throw new Error("One or more email requests failed.");
      }
    } catch (err: any) {
      console.error("Support form submission error:", err);
      toast.error("Failed to submit support query. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-20 font-[family-name:var(--font-body)] text-[#2b2b2b]">
      {/* Title Header with Heritage Board */}
      <div className="relative border border-[#c89b3c]/30 rounded-[30px] p-8 md:p-12 bg-[#faf7f2]/50 backdrop-blur-xs shadow-xs text-center mb-16 max-w-5xl mx-auto">
        <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c89b3c]/40 rounded-tl-xs" />
        <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#c89b3c]/40 rounded-tr-xs" />
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#c89b3c]/40 rounded-bl-xs" />
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c89b3c]/40 rounded-br-xs" />

        <span className="text-[10px] md:text-xs text-[#7d1f1f] uppercase tracking-widest font-bold font-[family-name:var(--font-body)]">
          Need Assistance?
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] mt-2 tracking-wide">
          Customer Support
        </h1>
        <p className="mt-3 text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
          Have queries about shipping, exchanges, or bespoke bridal options? Reach out, and our Mumbai boutique representatives will be happy to help.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side: Store Info & Location (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-neutral-200/60 rounded-3xl p-6 md:p-8 bg-white shadow-xs">
          <div>
            <h2 className="text-2xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide border-b border-neutral-100 pb-4">
              Boutique Information
            </h2>
            <p className="text-neutral-500 text-sm mt-4 leading-relaxed">
              We sell authentic Indian wear for women—featuring hand-dyed Bandhani, royal poshas, and hand-embroidered heritage clothing. Visit our Mumbai showroom to experience the quality firsthand.
            </p>

            <div className="mt-8 space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#c89b3c]/10 rounded-xl text-[#c89b3c] shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Address</h4>
                  <p className="text-sm font-semibold text-neutral-700 mt-1 leading-relaxed">
                    Rajasthalii Mumbai Boutique<br />
                    Shop No. 3, Building 3, Sardar Vallabhai Patel Rd,<br />
                    Ram Nagar, Takshila Colony, Indira Nagar,<br />
                    Andheri East, Mumbai, Maharashtra 400093
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#18320b]/10 rounded-xl text-[#18320b] shrink-0 mt-0.5">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Hours</h4>
                  <p className="text-sm font-semibold text-neutral-700 mt-1">
                    10:00 AM - 9:30 PM (Daily)
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#7d1f1f]/10 rounded-xl text-[#7d1f1f] shrink-0 mt-0.5">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Email Address</h4>
                  <p className="text-sm font-semibold text-neutral-700 mt-1">
                    support@rajasthalii.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Link / Button */}
          <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row gap-3">
            <a
              href="https://share.google/Gn2nVYB7feehDXQ0L"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-5 py-3 border border-[#c89b3c]/50 text-[#18320b] hover:bg-[#c89b3c]/8 text-center rounded-xl text-xs font-semibold tracking-wider uppercase transition duration-300"
            >
              Get Directions
            </a>
            <a
              href="https://share.google/Gn2nVYB7feehDXQ0L"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-5 py-3 bg-[#7d1f1f] hover:bg-[#912525] text-white text-center rounded-xl text-xs font-semibold tracking-wider uppercase transition duration-300 shadow-xs"
            >
              View Google Maps
            </a>
          </div>
        </div>

        {/* Right Side: Form (7 cols) */}
        <div className="lg:col-span-7 border border-[#c89b3c]/35 rounded-3xl p-6 md:p-10 bg-[#faf7f2]/30 backdrop-blur-xs shadow-xs relative">
          {/* Decorative Corner Flourish */}
          <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#c89b3c]/30 rounded-tl-xs pointer-events-none" />
          <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#c89b3c]/30 rounded-tr-xs pointer-events-none" />
          <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#c89b3c]/30 rounded-bl-xs pointer-events-none" />
          <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#c89b3c]/30 rounded-br-xs pointer-events-none" />

          {isSubmitted ? (
            <div className="h-full flex flex-col justify-center items-center text-center py-10 space-y-4">
              <CheckCircle2 size={56} className="text-[#18320b] animate-bounce-slow" />
              <h2 className="text-2xl font-bold text-[#18320b] font-[family-name:var(--font-heading)]">
                Query Received Successfully!
              </h2>
              <p className="text-neutral-600 text-sm max-w-md leading-relaxed">
                Thank you for contacting Rajasthalii. We have dispatched a confirmation email to you, and our Mumbai customer care desk will reply shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-[#18320b] hover:bg-[#234712] text-white rounded-full text-xs font-semibold tracking-wider uppercase transition duration-300 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-2xl font-bold text-[#18320b] font-[family-name:var(--font-heading)] tracking-wide">
                Raise a Support Query
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Full Name <span className="text-[#7d1f1f]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 outline-none focus:ring-2 focus:ring-[#c89b3c] bg-white text-sm transition"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Email Address <span className="text-[#7d1f1f]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 outline-none focus:ring-2 focus:ring-[#c89b3c] bg-white text-sm transition"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Subject Dropdown */}
                <div className="space-y-1">
                  <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Inquiry Reason
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 outline-none focus:ring-2 focus:ring-[#c89b3c] bg-white text-sm transition appearance-none cursor-pointer"
                  >
                    {subjects.map((sub, idx) => (
                      <option key={idx} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Order ID */}
                <div className="space-y-1">
                  <label htmlFor="orderId" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Order ID <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="orderId"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder="e.g. #12345"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 outline-none focus:ring-2 focus:ring-[#c89b3c] bg-white text-sm transition"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Message / Details <span className="text-[#7d1f1f]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Describe your issue, query, or customizations in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 outline-none focus:ring-2 focus:ring-[#c89b3c] bg-white text-sm transition resize-y"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-[#18320b] hover:bg-[#234712] text-[#faf7f2] font-semibold text-xs tracking-wider uppercase rounded-xl transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    Sending Query...
                  </>
                ) : (
                  <>
                    <Send size={14} className="text-[#c89b3c]" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
