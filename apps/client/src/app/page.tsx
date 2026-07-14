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
  let heroSlides: any[] = [];
  try {
    const [mcRes, heroRes] = await Promise.all([
      fetch(`${baseUrl}/maincategory`, { cache: "no-store" }),
      fetch(`${baseUrl}/hero`, { cache: "no-store" }),
    ]);

    if (mcRes.ok) mainCategories = await mcRes.json();
    if (heroRes.ok) heroSlides = await heroRes.json();
  } catch (error) {
    console.error("Error fetching homepage initial data:", error);
  }

  return (
    <div>
      <HeroSection slides={heroSlides} />
      
      {mainCategories.map((mc: any) => {
        if (!mc.categories || mc.categories.length === 0) return null;
        return (
          <CategoriesShowcase 
            key={mc.id || mc.slug} 
            subcategories={mc.categories} 
            mainCategorySlug={mc.slug}
            mainCategoryName={mc.name}
          />
        );
      })}

      <ProductList category={category} params="homepage" />
      <SeoSections />
    </div>
  );
};

export default Homepage;
