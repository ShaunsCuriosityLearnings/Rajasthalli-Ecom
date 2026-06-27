"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { ShippingFormInputs } from "@repo/types";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export type OrderProduct = {
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  amount: number;
  userId: string;
  email: string;
  status: "pending" | "success" | "failed" | "packed" | "out for delivery" | "delivered";
  products: OrderProduct[];
  shippingAddress?: ShippingFormInputs;
  createdAt?: string;
  updatedAt?: string;
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "shippingAddress",
    header: "Delivery Address",
    cell: ({ row }) => {
      const shippingAddress = row.getValue("shippingAddress") as ShippingFormInputs | undefined;
      if (!shippingAddress) return <span className="text-muted-foreground italic">N/A</span>;
      return (
        <div 
          className="text-xs max-w-[200px] truncate cursor-help" 
          title={`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}\nPhone: ${shippingAddress.phone}`}
        >
          <div className="font-semibold text-zinc-800 dark:text-zinc-200">{shippingAddress.name}</div>
          <div className="text-zinc-500">{shippingAddress.address}, {shippingAddress.city}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <div
          className={cn(
            `p-1 px-2.5 rounded-md w-max text-xs font-semibold uppercase tracking-wider text-[10px]`,
            status === "pending" && "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
            status === "success" && "bg-green-500/20 text-green-700 dark:text-green-300",
            status === "failed" && "bg-red-500/20 text-red-700 dark:text-red-300",
            status === "packed" && "bg-blue-500/20 text-blue-700 dark:text-blue-300",
            status === "out for delivery" && "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300",
            status === "delivered" && "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <OrderActionsCell order={row.original} />;
    },
  },
];

const OrderActionsCell = ({ order }: { order: Order }) => {
  const router = useRouter();
  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8001";
      const res = await fetch(`${baseUrl}/orders/${order.id}/admin-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update order status");
      }
      return res.json();
    },
    onSuccess: () => {
      router.refresh();
    },
    onError: (error: any) => {
      console.error("Error updating order status:", error);
      alert(error.message || "An error occurred while updating the order status.");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(order.id)}
        >
          Copy order ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/users/${order.userId}`}>View customer</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>View order details</DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => mutation.mutate("pending")}
          disabled={order.status === "pending" || mutation.isPending}
        >
          Mark as Pending
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => mutation.mutate("success")}
          disabled={order.status === "success" || mutation.isPending}
        >
          Mark as Success (Paid)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => mutation.mutate("packed")}
          disabled={order.status === "packed" || mutation.isPending}
        >
          Mark as Packed
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => mutation.mutate("out for delivery")}
          disabled={order.status === "out for delivery" || mutation.isPending}
        >
          Mark as Out for Delivery
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => mutation.mutate("delivered")}
          disabled={order.status === "delivered" || mutation.isPending}
        >
          Mark as Delivered
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => mutation.mutate("failed")}
          disabled={order.status === "failed" || mutation.isPending}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          Mark as Failed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
