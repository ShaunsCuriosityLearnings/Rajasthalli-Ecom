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
import { MainCategoryType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";


export const columns: ColumnDef<MainCategoryType>[] = [
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
    id: "subcategoriesCount",
    header: "Subcategories",
    cell: ({ row }) => {
      const mainCategory = row.original;
      return <span>{mainCategory.categories?.length || 0}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const mainCategory = row.original;
      if (!mainCategory.createdAt) return <span>N/A</span>;
      return (
        <span>
          {new Date(mainCategory.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <MainCategoryActionsCell mainCategory={row.original} />;
    },
  },
];

const MainCategoryActionsCell = ({ mainCategory }: { mainCategory: MainCategoryType }) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/maincategory/${mainCategory.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete main category");
      }
      return res.json();
    },
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
    onError: (error: any) => {
      console.error("Error deleting main category:", error);
      alert(error.message || "An error occurred while deleting the main category.");
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
              navigator.clipboard.writeText(mainCategory.id.toString())
            }
          >
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsOpen(true)}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            Delete Main Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={() => mutation.mutate()}
        isLoading={mutation.isPending}
        title="Delete Main Category"
        description={`Are you sure you want to delete main category "${mainCategory.name}"?\n\nDeleting this main category will permanently delete all subcategories assigned to it, and all products assigned to those categories will also be deleted.`}
      />
    </>
  );
};

