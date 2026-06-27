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
import { CategoryType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";


export const columns: ColumnDef<CategoryType>[] = [
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
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    id: "mainCategory",
    header: "Main Category",
    cell: ({ row }) => {
      const category = row.original;
      return <span>{category.mainCategory?.name || "N/A"}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CategoryActionsCell category={row.original} />;
    },
  },
];

const CategoryActionsCell = ({ category }: { category: CategoryType }) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/category/${category.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete category");
      }
      return res.json();
    },
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
    onError: (error: any) => {
      console.error("Error deleting category:", error);
      alert(error.message || "An error occurred while deleting the category.");
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
              navigator.clipboard.writeText(category.id.toString())
            }
          >
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsOpen(true)}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            Delete Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={() => mutation.mutate()}
        isLoading={mutation.isPending}
        title="Delete Category"
        description={`Are you sure you want to delete category "${category.name}"?\n\nDeleting this category will permanently delete all products assigned to this category. The parent main category will remain unchanged.`}
      />
    </>
  );
};

