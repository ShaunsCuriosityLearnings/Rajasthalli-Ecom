"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CategoryType, MainCategoryType, productFormSchema, ProductFormValues } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { UploadCloud, X } from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Input } from "./ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";

const sizes = [
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
] as const;

const AddProduct = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [mainCategories, setMainCategories] = useState<MainCategoryType[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [uploading, setUploading] = useState<{
    frontView: boolean;
    sideView: boolean;
    backView: boolean;
  }>({
    frontView: false,
    sideView: false,
    backView: false,
  });

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "frontView" | "sideView" | "backView"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [field]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      const presetName = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rajasthalii").trim();
      formData.append("upload_preset", presetName);

      const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME || "rajasthalii").trim();
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to upload image to Cloudinary");
      }

      const data = await res.json();
      form.setValue(field, data.secure_url, { shouldValidate: true });
    } catch (error: any) {
      console.error(`Error uploading ${field}:`, error);
      alert(error.message || "An error occurred during file upload. Please verify your Cloudinary configurations.");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),

    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      mainCategory: "",
      category: "",
      sizes: [],
      frontView: "",
      sideView: "",
      backView: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
        // Fetch Main Categories
        const mcRes = await fetch(`${baseUrl}/maincategory`);
        if (mcRes.ok) {
          const mcData = await mcRes.json();
          setMainCategories(mcData);
        }
        // Fetch Categories
        const catRes = await fetch(`${baseUrl}/category`);
        if (catRes.ok) {
          const catData = await catRes.json();
          setAllCategories(catData);
        }
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };
    fetchData();
  }, []);

  const selectedMainCategory = form.watch("mainCategory");

  const availableCategories = allCategories.filter(
    (cat) => cat.mainCategoryId?.toString() === selectedMainCategory
  );

  const mutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      shortDescription: string;
      description: string;
      price: number;
      categorySlug: string;
      sizes: string[];
      images: {
        frontView: string;
        sideView: string;
        backView: string;
      };
    }) => {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";

      const res = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create product");
      }
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      router.refresh();
      closeRef.current?.click();
    },
    onError: (error: any) => {
      console.error("Error creating product:", error);
      alert(error.message || "An error occurred. Please try again.");
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    const payload = {
      name: values.name,
      shortDescription: values.shortDescription,
      description: values.description,
      price: values.price,
      categorySlug: values.category, // category contains the selected slug
      sizes: values.sizes,
      images: {
        frontView: values.frontView,
        sideView: values.sideView,
        backView: values.backView,
      },
    };
    mutation.mutate(payload);
  };

  return (
    <SheetContent className="sm:max-w-2xl">
      <ScrollArea className="h-screen pr-4">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Product</SheetTitle>

          <SheetDescription>Create a new product.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6 pb-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>

                  <FormControl>
                    <Input {...field} placeholder="Jaipuri Saree" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>

                  <FormControl>
                    <Input {...field} placeholder="Vibrant hand block-printed cotton saree." />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea {...field} className="min-h-32" placeholder="Full details of fabric, craft and care instructions..." />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Category</FormLabel>

                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("category", "");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Main Category" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {mainCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedMainCategory}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Sizes</FormLabel>

                  <FormControl>
                    <div className="grid grid-cols-4 gap-3">
                      {sizes.map((size) => (
                        <div key={size} className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value?.includes(size)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...(field.value || []), size]);
                              } else {
                                field.onChange(
                                  field.value?.filter((s) => s !== size),
                                );
                              }
                            }}
                          />

                          <span className="text-xs uppercase">{size}</span>
                        </div>
                      ))}
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="font-medium">Product Images</h3>

              <FormField
                control={form.control}
                name="frontView"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Front View Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        {field.value ? (
                          <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-muted flex-shrink-0">
                            <img src={field.value} alt="Front View Preview" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => form.setValue("frontView", "", { shouldValidate: true })}
                              className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white hover:bg-destructive/80 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-border">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading.frontView ? (
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                                ) : (
                                  <>
                                    <UploadCloud className="w-8 h-8 text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground font-medium">Click to upload front view image</p>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "frontView")}
                                disabled={uploading.frontView}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sideView"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Side View Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        {field.value ? (
                          <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-muted flex-shrink-0">
                            <img src={field.value} alt="Side View Preview" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => form.setValue("sideView", "", { shouldValidate: true })}
                              className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white hover:bg-destructive/80 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-border">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading.sideView ? (
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                                ) : (
                                  <>
                                    <UploadCloud className="w-8 h-8 text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground font-medium">Click to upload side view image</p>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "sideView")}
                                disabled={uploading.sideView}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backView"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Back View Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        {field.value ? (
                          <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-muted flex-shrink-0">
                            <img src={field.value} alt="Back View Preview" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => form.setValue("backView", "", { shouldValidate: true })}
                              className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white hover:bg-destructive/80 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-border">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading.backView ? (
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                                ) : (
                                  <>
                                    <UploadCloud className="w-8 h-8 text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground font-medium">Click to upload back view image</p>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "backView")}
                                disabled={uploading.backView}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Creating..." : "Create Product"}
            </Button>

            <SheetClose asChild>
              <button ref={closeRef} className="hidden" type="button" />
            </SheetClose>
          </form>
        </Form>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;
