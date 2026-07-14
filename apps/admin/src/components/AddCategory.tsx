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
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      mainCategoryId: "",
      imageUrl: "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rajasthalii_preset";
      formData.append("upload_preset", presetName);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME || "dczs83y98";
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to upload image to Cloudinary");
      }

      const data = await res.json();
      form.setValue("imageUrl", data.secure_url, { shouldValidate: true });
    } catch (error: any) {
      console.error("Error uploading category image:", error);
      alert(error.message || "An error occurred during file upload. Please verify your Cloudinary configurations.");
    } finally {
      setUploadingImage(false);
    }
  };

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

  useEffect(() => {
    fetchMainCategories();
  }, []);

  const generateSlug = (value: string) => {
    return value.toLowerCase().trim().replace(/\s+/g, "-");
  };

  const mutation = useMutation({
    mutationFn: async (payload: { name: string; slug: string; mainCategoryId: number | null; imageUrl: string | null }) => {
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
      imageUrl: values.imageUrl || null,
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
                      onOpenChange={(open) => {
                        if (open) fetchMainCategories();
                      }}
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

              {/* Category Image */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                        {uploadingImage && <p className="text-xs text-muted-foreground animate-pulse">Uploading image to Cloudinary...</p>}
                        {field.value && (
                          <div className="relative w-28 h-28 border rounded-md overflow-hidden mt-2 shadow-xs">
                            <img
                              src={field.value}
                              alt="Category Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>Upload a main portrait image for this category.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={mutation.isPending || uploadingImage} className="w-full">
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
