import { ShippingFormInputs } from "./cart";

export interface OrderProduct {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderType {
  _id: string;
  userId: string;
  email: string;
  amount: number;
  status: "pending" | "success" | "failed" | "packed" | "out for delivery" | "delivered";
  products: OrderProduct[];
  shippingAddress?: ShippingFormInputs;
  createdAt: string;
  updatedAt: string;
}

