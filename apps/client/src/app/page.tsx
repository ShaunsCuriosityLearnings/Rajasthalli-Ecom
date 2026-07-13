import ProductList from "@/components/ProductList";
import HeroSection from "@/components/HeroSection";
import SeoSections from "@/components/SeoSections";
import CategoriesShowcase from "@/components/CategoriesShowcase";

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; mainCategory?: string }>;
}) => {
  const params = await searchParams;
  const category = params.category;

  const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
  let mainCategories: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/maincategory`, { cache: "no-store" });
    if (res.ok) {
      mainCategories = await res.json();
    }
  } catch (error) {
    console.error("Error fetching main categories on homepage:", error);
  }

  const activeMainCategorySlug = params.mainCategory || mainCategories[0]?.slug || "";
  const activeMainCategory = mainCategories.find((mc: any) => mc.slug === activeMainCategorySlug) || mainCategories[0];
  const subcategories = activeMainCategory?.categories || [];

  return (
    <div>
      <HeroSection />
      <CategoriesShowcase subcategories={subcategories} mainCategorySlug={activeMainCategorySlug} />
      <ProductList category={category} params="homepage" />
      <SeoSections />
    </div>
  );
};

export default Homepage;
