"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
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
import { ProductType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";


// export type Product = {
//   id: number;
//   name: string;
//   shortDescription: string;
//   description: string;
//   price: number;
//   sizes: [string, ...string[]];

//   images: {
//     frontView: string;
//     sideView: string;
//     backView: string;
//   };
// };

export const columns: ColumnDef<ProductType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },

  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const product = row.original;

      const imageSrc =
        product.images?.frontView ||
        product.images?.sideView ||
        product.images?.backView ||
        "/placeholder.png";

      const finalSrc = imageSrc && imageSrc.trim() !== "" ? imageSrc : "/placeholder.png";

      return (
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={finalSrc}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "shortDescription",
    header: "Description",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <ProductActionsCell product={row.original} />;
    },
  },
];

const ProductActionsCell = ({ product }: { product: ProductType }) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/products/${product.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete product");
      }
      return res.json();
    },
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
    onError: (error: any) => {
      console.error("Error deleting product:", error);
      alert(error.message || "An error occurred while deleting the product.");
    },
  });

  return (
    <>
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
            onClick={() =>
              navigator.clipboard.writeText(product.id.toString())
            }
          >
            Copy product ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={`/products/${product.id}`}>View Product</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsOpen(true)}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={() => mutation.mutate()}
        isLoading={mutation.isPending}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.name}"?\n\nDeleting this product will permanently remove it from the catalog.`}
      />
    </>
  );
};

