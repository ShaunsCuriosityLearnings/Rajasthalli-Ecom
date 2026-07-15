import ProductList from "@/components/ProductList";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ sort: string, search: string, category: string, size?: string }>;
}) => {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const sort = resolvedParams.sort;
  const search = resolvedParams.search;
  const size = resolvedParams.size;
  return (
    <div className="">
      <ProductList category={category} sort={sort} search={search} size={size} params="products" />
    </div>
  );
};

export default ProductsPage;
