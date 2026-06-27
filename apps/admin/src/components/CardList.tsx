import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { OrderType, ProductsType } from "@repo/types";
import { auth } from "@clerk/nextjs/server";

const popularProducts: ProductsType = [
  {
    id: 1,
    name: "Royal Bandhani Saree",
    shortDescription:
      "Traditional handcrafted Bandhani saree featuring intricate tie-dye patterns.",
    description:
      "A premium Bandhani saree crafted by skilled artisans of Rajasthan. Perfect for weddings, festivals, and special occasions.",
    price: 4999,
    sizes: ["Free Size"],
    images: {
      frontView: "/products/bandhani-red.jpeg",
      sideView: "/products/bandhani-yellow.jpg",
      backView: "/products/bandhani-maroon.jpg",
    },
  },

  {
    id: 2,
    name: "Leheriya Silk Dupatta",
    shortDescription:
      "Elegant Leheriya dupatta with vibrant Rajasthani wave patterns.",
    description:
      "Made from premium silk and dyed using traditional Leheriya techniques for a festive look.",
    price: 1499,
    sizes: ["Free Size"],
    images: {
      frontView: "/products/leheriya-pink.jpeg",
      sideView: "/products/leheriya-blue.jpg",
      backView: "/products/leheriya-orange.jpg",
    },
  },

  {
    id: 3,
    name: "Mirror Work Ghagra Choli",
    shortDescription:
      "Traditional ghagra choli adorned with handcrafted mirror work.",
    description:
      "A stunning ethnic outfit designed for weddings, Garba nights, and cultural celebrations.",
    price: 6999,
    sizes: ["S", "M", "L", "XL"],
    images: {
      frontView: "/products/ghagra-green.jpeg",
      sideView: "/products/ghagra-red.jpg",
      backView: "/products/ghagra-navy.jpg",
    },
  },

  {
    id: 4,
    name: "Jaipuri Printed Kurti",
    shortDescription:
      "Comfortable cotton kurti with authentic Jaipuri block prints.",
    description:
      "A versatile everyday wear kurti made from breathable cotton fabric.",
    price: 1199,
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      frontView: "/products/kurti-white.jpeg",
      sideView: "/products/kurti-blue.jpg",
      backView: "/products/kurti-mustard.jpg",
    },
  },

  {
    id: 5,
    name: "Rajasthani Angrakha Dress",
    shortDescription:
      "Classic Angrakha-style dress inspired by royal Rajasthan.",
    description:
      "Combines traditional design with modern comfort, suitable for festive occasions.",
    price: 2499,
    sizes: ["S", "M", "L", "XL"],
    images: {
      frontView: "/products/angrakha-purple.jpeg",
      sideView: "/products/angrakha-green.jpg",
      backView: "/products/angrakha-black.jpg",
    },
  },

  {
    id: 6,
    name: "Hand Block Printed Saree",
    shortDescription: "Beautiful hand block printed cotton saree from Jaipur.",
    description:
      "Crafted using centuries-old block printing techniques by local artisans.",
    price: 2999,
    sizes: ["Free Size"],
    images: {
      frontView: "/products/block-beige.jpeg",
      sideView: "/products/block-blue.jpg",
      backView: "/products/block-pink.jpg",
    },
  },

  {
    id: 7,
    name: "Mojari Embroidered Footwear",
    shortDescription:
      "Traditional Rajasthani mojari with intricate embroidery.",
    description:
      "Handcrafted footwear designed for comfort and traditional elegance.",
    price: 899,
    sizes: ["6", "7", "8", "9", "10"],
    images: {
      frontView: "/products/mojari-brown.jpeg",
      sideView: "/products/mojari-gold.jpg",
      backView: "/products/mojari-black.jpg",
    },
  },

  {
    id: 8,
    name: "Royal Rajputi Poshak",
    shortDescription:
      "Luxurious Rajputi Poshak inspired by Rajasthan's royal heritage.",
    description:
      "Designed with rich fabrics and traditional detailing for grand celebrations.",
    price: 8999,
    sizes: ["S", "M", "L", "XL"],
    images: {
      frontView: "/products/poshak-maroon.jpeg",
      sideView: "/products/poshak-green.jpg",
      backView: "/products/poshak-red.jpg",
    },
  },

  {
    id: 9,
    name: "Cotton Leheriya Kurta Set",
    shortDescription:
      "Lightweight kurta set featuring authentic Leheriya patterns.",
    description:
      "Perfect for summer wear, festivals, and casual traditional outings.",
    price: 1999,
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      frontView: "/products/kurta-yellow.jpeg",
      sideView: "/products/kurta-blue.jpg",
      backView: "/products/kurta-pink.jpg",
    },
  },
];

const latestTransactions = [
  {
    id: 1,
    title: "Order Payment",
    badge: "John Doe",
    image:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1400,
  },
  {
    id: 2,
    title: "Order Payment",
    badge: "Jane Smith",
    image:
      "https://images.pexels.com/photos/4969918/pexels-photo-4969918.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 2100,
  },
  {
    id: 3,
    title: "Order Payment",
    badge: "Michael Johnson",
    image:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1300,
  },
  {
    id: 4,
    title: "Order Payment",
    badge: "Lily Adams",
    image:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 2500,
  },
  {
    id: 5,
    title: "Order Payment",
    badge: "Sam Brown",
    image:
      "https://images.pexels.com/photos/1680175/pexels-photo-1680175.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1400,
  },
];

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
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-sm relative overflow-hidden flex items-center justify-center bg-secondary">
                  {imageSrc && imageSrc.trim() !== "" ? (
                    <Image
                      src={imageSrc}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-muted-foreground text-center">No Image</span>
                  )}
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.name}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-0">₹{String(item.price)}</CardFooter>
              </Card>
            );
          })
          : orders.map((item) => (
            <Card
              key={item._id}
              className="flex-row items-center justify-between gap-4 p-4"
            >
              <CardContent className="flex-1 p-0">
                <CardTitle className="text-sm font-medium">
                  {item.email}
                </CardTitle>
                <Badge variant="secondary">{item.status}</Badge>
              </CardContent>
              <CardFooter className="p-0">${item.amount / 100}</CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default CardList;