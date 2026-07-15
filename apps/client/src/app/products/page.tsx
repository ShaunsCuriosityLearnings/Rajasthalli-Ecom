import ProductList from "@/components/ProductList";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ sort: string, search: string, category: string, mainCategory?: string, size?: string }>;
}) => {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const mainCategory = resolvedParams.mainCategory;
  const sort = resolvedParams.sort;
  const search = resolvedParams.search;
  const size = resolvedParams.size;
  return (
    <div className="">
      <ProductList category={category} mainCategory={mainCategory} sort={sort} search={search} size={size} params="products" />
    </div>
  );
};

export default ProductsPage;
