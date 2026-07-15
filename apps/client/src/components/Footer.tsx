import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary-green text-bg-cream/90 border-t border-accent-gold/30 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-semibold tracking-wide text-accent-gold font-[family-name:var(--font-heading)]">
              Rajasthalii
            </h2>

            <div className="mt-4 text-bg-cream/80 leading-relaxed font-[family-name:var(--font-body)] text-sm space-y-3">
              <p>
                At Rajasthalii, we bring the vibrant soul and rich heritage of India right to your doorstep. We are an online destination specializing in authentic Indian wear for her and exquisite Rajasthani bedsheets, blending time-honored artistry with modern elegance.
              </p>
              <p>
                Based in Mumbai, our curated collections celebrate the beauty of traditional designs and meticulous craftsmanship. Every piece we offer is a tribute to heritage techniques, thoughtfully selected to bring warmth, color, and grace into your wardrobe and your home.
              </p>
              <p>
                Whether you are dressing up for a special occasion or transforming your living space, Rajasthalii connects you with timeless Indian traditions, reimagined for contemporary life.
              </p>
            </div>

            <div className="mt-6 text-sm text-bg-cream/70 font-[family-name:var(--font-body)] leading-relaxed">
              <p className="font-semibold text-accent-gold uppercase tracking-wider text-xs">Mumbai Shop Location</p>
              <p className="mt-1.5">
                Shopno3, Dheeraj Garden, CHS,<br />
                Poonam Nagar, Andheri East,<br />
                Mumbai-93
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            <div>
              <h3 className="font-semibold text-bg-cream mb-4 uppercase tracking-wider text-xs text-accent-gold">Shop</h3>
              <ul className="space-y-3 text-bg-cream/70">
                <li>
                  <Link href="/products" className="hover:text-accent-gold transition-colors duration-200">All Products</Link>
                </li>
                <li>
                  <Link href="/collections" className="hover:text-accent-gold transition-colors duration-200">Collections</Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="hover:text-accent-gold transition-colors duration-200">New Arrivals</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-bg-cream mb-4 uppercase tracking-wider text-xs text-accent-gold">Company</h3>
              <ul className="space-y-3 text-bg-cream/70">
                <li>
                  <Link href="/about" className="hover:text-accent-gold transition-colors duration-200">About</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-accent-gold transition-colors duration-200">Contact</Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-accent-gold transition-colors duration-200">FAQs</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-bg-cream mb-4 uppercase tracking-wider text-xs text-accent-gold">Legal</h3>
              <ul className="space-y-3 text-bg-cream/70">
                <li>
                  <Link href="/privacy-policy" className="hover:text-accent-gold transition-colors duration-200">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-accent-gold transition-colors duration-200">Terms</Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:text-accent-gold transition-colors duration-200">Shipping</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 rounded-3xl border border-accent-gold/20 bg-white/5 p-8 backdrop-blur-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-accent-gold font-[family-name:var(--font-heading)]">Join our newsletter</h3>
              <p className="text-bg-cream/85 mt-2 text-sm">
                Get updates on new collections and exclusive offers.
              </p>
            </div>

            <form className="flex w-full lg:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full lg:w-80 px-4 py-3 rounded-xl border border-accent-gold/30 bg-[#faf7f2]/10 outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30 text-bg-cream placeholder:text-bg-cream/40 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-accent-gold hover:bg-accent-gold-hover text-[#18320b] font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-accent-gold/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-bg-cream/60">
          <p>
            © {new Date().getFullYear()} Rajasthalii. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="https://wa.me/919136663940" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors duration-200">WhatsApp</a>
            <a href="https://www.instagram.com/kk.rajasthali?igsh=ZG4xdDdxYXd5ZWRv" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors duration-200">Instagram</a>
            <Link href="#" className="hover:text-accent-gold transition-colors duration-200">Facebook</Link>
            <Link href="#" className="hover:text-accent-gold transition-colors duration-200">Pinterest</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
