import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { OrderType, ProductsType } from "@repo/types";
import { auth } from "@clerk/nextjs/server";

const CardList = async ({ title }: { title: string }) => {
  let products: ProductsType = [];
  let orders: OrderType[] = [];

  const { getToken } = await auth();
  const token = await getToken();

  if (title === "Popular Products") {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?limit=5&popular=true`
      );
      if (res.ok) {
        products = await res.json();
      } else {
        console.error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  } else {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        orders = Array.isArray(data) ? data : [];
      } else {
        const errText = await res.text();
        console.error(`Failed to fetch orders: ${res.status} ${res.statusText} - ${errText}`);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title === "Popular Products"
          ? products.map((item) => {
            const imageSrc =
              item.images?.frontView ||
              item.images?.sideView ||
              item.images?.backView;

            return (
              <Card
                key={item.id}
                className="flex flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm relative overflow-hidden flex shrink-0 items-center justify-center bg-secondary">
                  {imageSrc && imageSrc.trim() !== "" ? (
                    <Image
                      src={imageSrc}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground text-center">No Image</span>
                  )}
                </div>
                <CardContent className="flex-1 p-0 min-w-0">
                  <CardTitle className="text-xs sm:text-sm font-medium line-clamp-1">
                    {item.name}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-0 text-xs sm:text-sm font-semibold shrink-0">₹{String(item.price)}</CardFooter>
              </Card>
            );
          })
          : orders.map((item) => (
            <Card
              key={item._id}
              className="flex flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4"
            >
              <CardContent className="flex-1 p-0 min-w-0 flex flex-col gap-1 items-start">
                <CardTitle className="text-xs sm:text-sm font-medium truncate w-full pr-2">
                  {item.email}
                </CardTitle>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{item.status}</Badge>
              </CardContent>
              <CardFooter className="p-0 text-xs sm:text-sm font-semibold shrink-0">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(item.amount)}
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default CardList;