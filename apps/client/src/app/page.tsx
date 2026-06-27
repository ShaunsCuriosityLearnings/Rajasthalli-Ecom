import ProductList from "@/components/ProductList";
import HeroSection from "@/components/HeroSection";
import SeoSections from "@/components/SeoSections";

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;

  return (
    <div>
      <HeroSection />
      <ProductList category={category} params="homepage" />
      <SeoSections />
    </div>
  );
};

export default Homepage;
