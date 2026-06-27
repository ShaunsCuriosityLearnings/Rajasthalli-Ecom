import { ProductType } from "@repo/types";
import Image from "next/image";
import ProductInteraction from "@/components/ProductInteraction";
import { Truck, ShieldCheck, RefreshCcw, Star, ChevronRight, Award } from "lucide-react";
import Link from "next/link";

// Fetch single product helper with database connection safety
const fetchProduct = async (id: string): Promise<ProductType | null> => {
  const numericId = Number(id);
  if (isNaN(numericId)) return null;

  const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${baseUrl}/products/${numericId}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json() as ProductType;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) {
    return {
      title: "Product Not Found | Rajasthalii",
    };
  }
  return {
    title: `${product.name} | Rajasthalii`,
    description: product.description,
  };
};

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    size?: string;
    view?: string;
  }>;
}) => {
  const { id } = await params;
  const { size, view } = await searchParams;

  const product = await fetchProduct(id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Product Not Found</h1>
        <p className="text-gray-500 mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/products"
          className="mt-6 inline-block bg-[#7d1f1f] hover:bg-[#631818] text-white px-6 py-3 rounded-xl font-medium transition shadow-sm hover:shadow"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const selectedSize = size || product.sizes[0] || "";
  const selectedView = view === "sideView" || view === "backView" ? view : "frontView";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* BREADCRUMBS */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-8 pb-4 border-b border-[#c89b3c]/10">
        <Link href="/" className="hover:text-[#18320b] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-[#18320b] transition-colors">Products</Link>
        {product.category && (
          <>
            <ChevronRight size={12} />
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-[#18320b] transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-[#7d1f1f] font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* LEFT COLUMN: Gallery */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-24 h-fit">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-50 shadow-md border border-[#c89b3c]/15 group">
            <Image
              src={product.images[selectedView]}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Elegant Royal Overlay Tag */}
            <div className="absolute top-4 left-4 bg-[#7d1f1f] text-[#f7eedc] text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-full shadow-md">
              Artisan Handcrafted
            </div>
          </div>

          {/* THUMBNAILS */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {(["frontView", "sideView", "backView"] as const).map((viewKey) => {
              const isActive = selectedView === viewKey;
              const viewLabel = viewKey === "frontView" ? "Front" : viewKey === "sideView" ? "Side" : "Back";
              return (
                <Link
                  key={viewKey}
                  href={`/products/${product.id}?view=${viewKey}${size ? `&size=${size}` : ""}`}
                  className={`relative aspect-[4/5] rounded-2xl overflow-hidden border-2 bg-neutral-50 transition-all duration-300 ${
                    isActive
                      ? "border-[#c89b3c] shadow-md ring-4 ring-[#c89b3c]/10 scale-[0.98]"
                      : "border-neutral-200 hover:border-[#c89b3c]/50"
                  }`}
                >
                  <Image
                    src={product.images[viewKey]}
                    alt={`${viewLabel} View`}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 bg-[#18320b]/5 transition-opacity ${isActive ? "opacity-0" : "opacity-100 hover:opacity-0"}`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <div>
            {/* Elegant category & collection badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#18320b]/10 text-[#18320b] text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                {product.category?.name || "Collection"}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#c89b3c]" />
              <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-[0.2em]">
                Rajasthalii Heritage
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 font-[family-name:var(--font-heading)]">
              {product.name}
            </h1>

            {/* Reviews */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#eab308" className="text-yellow-500" />
                ))}
              </div>
              <span className="text-xs font-semibold text-neutral-800">4.9</span>
              <span className="h-3 w-px bg-neutral-300" />
              <span className="text-xs text-neutral-500 hover:underline cursor-pointer">124 authentic reviews</span>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-[#a2b58c]/10 border border-[#c89b3c]/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Special Price</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#7d1f1f]">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </h2>
              <span className="text-[10px] text-[#18320b] font-medium mt-1 block">Inclusive of all local taxes</span>
            </div>
            <div className="bg-white/85 border border-[#c89b3c]/25 rounded-xl px-4 py-2 text-center shadow-xs">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">Stock Status</span>
              <span className="text-xs font-semibold text-emerald-700">In Stock & Ready to Ship</span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Heritage Story</h3>
            <p className="text-neutral-600 leading-relaxed text-sm md:text-base font-light">
              {product.description}
            </p>
          </div>

          <hr className="border-neutral-200" />

          {/* Interactive controls */}
          <ProductInteraction
            product={product}
            selectedSize={selectedSize}
            selectedView={selectedView}
          />

          <hr className="border-neutral-200" />

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#a2b58c]/5 border border-neutral-100 rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-full bg-[#18320b]/10 flex items-center justify-center mb-3">
                <Truck size={18} className="text-[#18320b]" />
              </div>
              <h4 className="font-semibold text-xs text-neutral-800 mb-1">Free Delivery</h4>
              <p className="text-[10px] text-neutral-500 leading-normal">Free express shipping across all states in India</p>
            </div>

            <div className="bg-[#a2b58c]/5 border border-neutral-100 rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-full bg-[#18320b]/10 flex items-center justify-center mb-3">
                <ShieldCheck size={18} className="text-[#18320b]" />
              </div>
              <h4 className="font-semibold text-xs text-neutral-800 mb-1">Secure Checkout</h4>
              <p className="text-[10px] text-neutral-500 leading-normal">100% secure payment gateways & COD options</p>
            </div>

            <div className="bg-[#a2b58c]/5 border border-neutral-100 rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-full bg-[#18320b]/10 flex items-center justify-center mb-3">
                <RefreshCcw size={18} className="text-[#18320b]" />
              </div>
              <h4 className="font-semibold text-xs text-neutral-800 mb-1">7-Day Returns</h4>
              <p className="text-[10px] text-neutral-500 leading-normal">Hassle-free easy return and replacement policy</p>
            </div>
          </div>

          {/* Secure Payment Card */}
          <div className="border border-[#c89b3c]/20 bg-neutral-50/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-xs text-neutral-800 mb-1 uppercase tracking-wider">Payment Partners</h3>
              <p className="text-[10px] text-neutral-500">Fully encrypted transactions backed by secure UPI, Cards, and NetBanking</p>
            </div>

            <div className="flex gap-3 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-2xs items-center">
              <Image src="/cards.png" alt="Accepted Cards" width={80} height={40} className="object-contain" />
              <div className="w-px h-6 bg-neutral-200 mx-2" />
              <Image src="/stripe.png" alt="Stripe Secured" width={60} height={30} className="object-contain" />
            </div>
          </div>

          {/* Highlights & Heritage Info */}
          <div className="bg-[#a2b58c]/5 border border-[#c89b3c]/15 rounded-3xl p-6 md:p-8">
            <h3 className="font-bold text-sm text-neutral-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Award className="text-[#c89b3c]" size={18} />
              Product Highlights
            </h3>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-neutral-600 text-xs leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#7d1f1f] font-bold mt-0.5">•</span>
                <span>Handcrafted by skilled Rajasthani artisans</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7d1f1f] font-bold mt-0.5">•</span>
                <span>Premium quality heritage fabric</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7d1f1f] font-bold mt-0.5">•</span>
                <span>Authentic traditional designs & colors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7d1f1f] font-bold mt-0.5">•</span>
                <span>Ideal for weddings, festivals & festive occasions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
