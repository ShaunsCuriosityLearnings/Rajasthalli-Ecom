"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MainCategoryType, categoryFormSchema, CategoryFormValues } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddCategory = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [mainCategories, setMainCategories] = useState<MainCategoryType[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      mainCategoryId: "",
    },
  });

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/maincategory`);
        if (res.ok) {
          const data = await res.json();
          setMainCategories(data);
        }
      } catch (error) {
        console.error("Error fetching main categories:", error);
      }
    };
    fetchMainCategories();
  }, []);

  const generateSlug = (value: string) => {
    return value.toLowerCase().trim().replace(/\s+/g, "-");
  };

  const mutation = useMutation({
    mutationFn: async (payload: { name: string; slug: string; mainCategoryId: number | null }) => {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";

      const res = await fetch(`${baseUrl}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create category");
      }
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      router.refresh();
      closeRef.current?.click();
    },
    onError: (error: any) => {
      console.error("Error creating category:", error);
      alert(error.message || "An error occurred. Please try again.");
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      slug: values.slug,
      mainCategoryId: values.mainCategoryId && values.mainCategoryId !== "none" ? Number(values.mainCategoryId) : null,
    };
    mutation.mutate(payload);
  };

  return (
    <SheetContent className="sm:max-w-lg overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Add Category</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Category Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Bandhani Sarees"
                        onChange={(e) => {
                          field.onChange(e);
                          form.setValue("slug", generateSlug(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>Enter category name.</FormDescription>
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
                      <Input {...field} placeholder="bandhani-sarees" />
                    </FormControl>
                    <FormDescription>Used in URLs and category mapping.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Main Category Dropdown */}
              <FormField
                control={form.control}
                name="mainCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Category (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Main Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None / Unmapped</SelectItem>
                        {mainCategories.map((mc) => (
                          <SelectItem key={mc.id} value={mc.id.toString()}>
                            {mc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Map this category to a top-level main category.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Creating..." : "Submit"}
              </Button>

              <SheetClose asChild>
                <button ref={closeRef} className="hidden" type="button" />
              </SheetClose>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default AddCategory;
