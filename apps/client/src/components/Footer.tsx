import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary-green text-bg-cream/90 border-t border-accent-gold/30 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Grid Layout (4 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-wide text-accent-gold font-[family-name:var(--font-heading)]">
              Rajasthalii
            </h2>
            <p className="text-bg-cream/80 leading-relaxed font-[family-name:var(--font-body)] text-sm">
              We bring the vibrant soul and rich heritage of India to your doorstep. Specializing in authentic Indian wear for her and exquisite Rajasthani bedsheets, blending time-honored artistry with modern elegance.
            </p>
          </div>

          {/* Column 2: Company Navigation */}
          <div>
            <h3 className="font-semibold text-bg-cream mb-4 uppercase tracking-wider text-xs text-accent-gold">Company</h3>
            <ul className="space-y-3 text-bg-cream/70 text-sm">
              <li>
                <Link href="/about" className="hover:text-accent-gold transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent-gold transition-colors duration-200">Contact</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-accent-gold transition-colors duration-200">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Policies */}
          <div>
            <h3 className="font-semibold text-bg-cream mb-4 uppercase tracking-wider text-xs text-accent-gold">Legal</h3>
            <ul className="space-y-3 text-bg-cream/70 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-accent-gold transition-colors duration-200">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent-gold transition-colors duration-200">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-accent-gold transition-colors duration-200">Shipping Policy</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="text-sm font-[family-name:var(--font-body)]">
            <h3 className="font-semibold text-bg-cream mb-4 uppercase tracking-wider text-xs text-accent-gold">Mumbai Shop</h3>
            <p className="text-bg-cream/70 leading-relaxed">
              Shopno3, Dheeraj Garden, CHS,<br />
              Poonam Nagar, Andheri East,<br />
              Mumbai-93
            </p>
            <div className="mt-4 space-y-1.5 text-xs text-bg-cream/60">
              <p>Email: <a href="mailto:kk.rajasthali@gmail.com" className="hover:text-accent-gold transition-colors">kk.rajasthali@gmail.com</a></p>
              <p>Phone: <a href="tel:+919136663940" className="hover:text-accent-gold transition-colors">+91 9136663940</a></p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-accent-gold/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-bg-cream/60">
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
