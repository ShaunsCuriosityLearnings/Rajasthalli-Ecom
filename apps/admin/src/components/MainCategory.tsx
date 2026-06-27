"use client";

import { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { mainCategoryFormSchema, MainCategoryFormValues } from "@repo/types";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

const MainCategory = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<MainCategoryFormValues>({
    resolver: zodResolver(mainCategoryFormSchema),

    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const generateSlug = (value: string) => {
    return value.toLowerCase().trim().replace(/\s+/g, "-");
  };

  const mutation = useMutation({
    mutationFn: async (payload: { name: string; slug: string }) => {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";

      const res = await fetch(`${baseUrl}/maincategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create main category");
      }
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      router.refresh();
      closeRef.current?.click();
    },
    onError: (error: any) => {
      console.error("Error creating main category:", error);
      alert(error.message || "An error occurred. Please try again.");
    },
  });

  const onSubmit = (values: MainCategoryFormValues) => {
    mutation.mutate(values);
  };

  return (
    <SheetContent className="sm:max-w-lg overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Add Main Category</SheetTitle>

        <SheetDescription>
          Create a top-level category for your catalog.
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Main Category Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Category Name</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Home Interiors"
                      onChange={(e) => {
                        field.onChange(e);

                        form.setValue("slug", generateSlug(e.target.value));
                      }}
                    />
                  </FormControl>

                  <FormDescription>
                    Enter the main category name.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>

                  <FormControl>
                    <Input {...field} placeholder="home-interiors" />
                  </FormControl>

                  <FormDescription>
                    Used in URLs and category mapping.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Saving..." : "Save Main Category"}
            </Button>

            <SheetClose asChild>
              <button ref={closeRef} className="hidden" type="button" />
            </SheetClose>
          </form>
        </Form>
      </div>
    </SheetContent>
  );
};

export default MainCategory;
