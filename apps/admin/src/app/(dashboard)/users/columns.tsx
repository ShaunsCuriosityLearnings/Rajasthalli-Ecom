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
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@clerk/nextjs/server";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
export type { User };


export const columns: ColumnDef<User>[] = [
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
    accessorKey: "imageUrl",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original;
      const rawImageUrl = user.imageUrl || (user as any).image_url;
      const avatarUrl = rawImageUrl && rawImageUrl.trim() !== "" ? rawImageUrl : "/placeholder.png";
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "No Name";
      return (
        <div className="w-9 h-9 relative">
          <Image
            src={avatarUrl}
            alt={fullName}
            fill
            className="rounded-full object-cover"
          />
        </div>
      );
    },
  },
  {
    id: "fullName",
    header: "User",
    accessorFn: (user) => {
      return [user.firstName, user.lastName].filter(Boolean).join(" ") || "No Name";
    },
  },
  {
    id: "email",
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
    accessorFn: (user) => {
      return user.emailAddresses[0]?.emailAddress || "No Email";
    },
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (user) => {
      return user.banned ? "inactive" : "active";
    },
    cell: ({ row }) => {
      const user = row.original;
      const status = user.banned ? "inactive" : "active";

      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            status === "active" && "bg-green-500/40",
            status === "inactive" && "bg-red-500/40"
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <UserActionsCell user={row.original} />;
    },
  },
];

const UserActionsCell = ({ user }: { user: User }) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:8004";
      const res = await fetch(`${baseUrl}/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
    onError: (error: any) => {
      console.error("Error deleting user:", error);
      alert(error.message || "An error occurred while deleting the user.");
    },
  });

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "this user";

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
            onClick={() => navigator.clipboard.writeText(user.id)}
          >
            Copy user ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/users/${user.id}`}>View customer</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsOpen(true)}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={() => mutation.mutate()}
        isLoading={mutation.isPending}
        title="Delete User"
        description={`Are you sure you want to delete ${fullName}?\n\nDeleting this user will permanently remove their account from the system and Clerk.`}
      />
    </>
  );
};

