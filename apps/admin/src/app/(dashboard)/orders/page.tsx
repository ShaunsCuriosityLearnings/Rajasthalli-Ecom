import { auth } from "@clerk/nextjs/server";
import { Order, columns } from "./columns";
import { DataTable } from "./data-table";

const getData = async (): Promise<Order[]> => {
  const { getToken } = await auth();
  const token = await getToken();

  const orderServiceUrl = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8001";
  const url = `${orderServiceUrl}/orders`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.statusText}`);
  }

  const data = await res.json();

  // Map database orders to the columns table Order model
  return data.map((order: any) => ({
    id: order._id,
    amount: order.amount,
    status: order.status,
    userId: order.userId,
    email: order.email,
    products: order.products || [],
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));
};

const OrdersPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Orders</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default OrdersPage;
