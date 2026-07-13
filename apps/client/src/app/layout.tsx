import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Rajasthalii",
    template: "%s | Rajasthalii",
  },
  description:
    "Discover handcrafted sarees, ethnic wear, and heritage fashion inspired by the timeless artistry of Rajasthan. Based in Mumbai.",
  keywords: [
    "Rajasthalii",
    "Bandhani Sarees",
    "Ethnic Wear",
    "Traditional Fashion",
    "Rajasthani Fashion",
    "Handcrafted Sarees",
    "Women's Fashion",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`
          ${cormorant.variable}
          ${jakarta.variable}
          bg-[#faf7f2]
          text-[#2b2b2b]
          antialiased
        `}
        >
          <div className="min-h-screen flex flex-col">
            {/* Decorative Heritage Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
              <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#c89b3c]/5 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#7d1f1f]/5 blur-3xl" />
            </div>

            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 w-full">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              pauseOnHover
              theme="light"
            />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
