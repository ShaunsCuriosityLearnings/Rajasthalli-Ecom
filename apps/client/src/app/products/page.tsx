import ProductList from "@/components/ProductList";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ sort: string, search: string, category: string }>;
}) => {
  const category = (await searchParams).category;
  const sort = (await searchParams).sort;
  const search = (await searchParams).search;
  return (
    <div className="">
      <ProductList category={category} sort={sort} search={search} params="products" />
    </div>
  );
};

export default ProductsPage;
