import { notFound } from "next/navigation";
import { ProductType } from "@repo/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditProduct from "@/components/EditProduct";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";

const getProductData = async (id: string): Promise<ProductType> => {
  const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
  const res = await fetch(`${baseUrl}/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch product details: ${res.statusText}`);
  }
  return res.json();
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const SingleProductPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const numericId = Number(id);
  if (isNaN(numericId)) {
    return notFound();
  }

  let product: ProductType;
  try {
    product = await getProductData(id);
  } catch (error) {
    console.error(`Failed to load product details for ID: ${id}`, error);
    return notFound();
  }

  const frontImage = product.images?.frontView || "/placeholder.png";
  const sideImage = product.images?.sideView || "/placeholder.png";
  const backImage = product.images?.backView || "/placeholder.png";

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(typeof product.price === "number" ? product.price : Number(product.price));

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* LEFT COLUMN - GALLERY */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={frontImage}
              alt={`${product.name} Front View`}
              fill
              className="object-cover transition-all hover:scale-105"
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <Image
                src={sideImage}
                alt={`${product.name} Side View`}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <Image
                src={backImage}
                alt={`${product.name} Back View`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - INFO */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
                {product.category?.name || "Uncategorized"}
              </span>
              <h1 className="text-3xl font-bold mt-2 text-zinc-900 dark:text-zinc-550">{product.name}</h1>
              <p className="text-zinc-500 text-sm mt-1">Product ID: {product.id}</p>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg">Edit Product</Button>
              </SheetTrigger>
              <EditProduct product={product} />
            </Sheet>
          </div>

          <div className="border-y py-4">
            <p className="text-2xl font-bold text-primary">{formattedPrice}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">Short Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line bg-secondary/30 p-4 rounded-lg border">
              {product.description || "No full description provided."}
            </p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="border rounded-md px-3 py-1 text-xs font-medium bg-background uppercase shadow-sm"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
