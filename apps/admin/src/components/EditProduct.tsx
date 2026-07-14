"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CategoryType, MainCategoryType, productFormSchema, ProductFormValues, ProductType } from "@repo/types";
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
  "xs", "s", "m", "l", "xl", "xxl", "3xl",
  "28", "30", "32", "34", "36", "38", "40", "41", "42", "43", "44", "45", "46", "47", "48",
  "Single Bed (60\" x 90\")",
  "Double Bed (90\" x 100\")",
  "Queen Size (90\" x 108\")",
  "King Size (108\" x 108\")",
  "Bath Towel (30\" x 60\")",
  "Hand Towel (16\" x 28\")",
  "Face Towel (12\" x 12\")",
  "Pack of 1", "Pack of 2", "Pack of 3", "Pack of 4", "Pack of 6", "Pack of 8", "Pack of 12",
  "50 ml", "80 ml", "100 ml", "200 ml", "250 ml", "500 ml", "1 Litre", "2 Litres",
  "Free Size", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
] as const;

const sizeCategories = [
  {
    name: "Apparel (Alpha Sizes)",
    options: ["xs", "s", "m", "l", "xl", "xxl", "3xl"]
  },
  {
    name: "Apparel / Footwear (Numeric)",
    options: ["28", "30", "32", "34", "36", "38", "40", "41", "42", "43", "44", "45", "46", "47", "48"]
  },
  {
    name: "Bedsheets & Towels (Dimensions)",
    options: [
      "Single Bed (60\" x 90\")",
      "Double Bed (90\" x 100\")",
      "Queen Size (90\" x 108\")",
      "King Size (108\" x 108\")",
      "Bath Towel (30\" x 60\")",
      "Hand Towel (16\" x 28\")",
      "Face Towel (12\" x 12\")",
    ]
  },
  {
    name: "Pack Sizes",
    options: ["Pack of 1", "Pack of 2", "Pack of 3", "Pack of 4", "Pack of 6", "Pack of 8", "Pack of 12"]
  },
  {
    name: "Volume / Liquids",
    options: ["50 ml", "80 ml", "100 ml", "200 ml", "250 ml", "500 ml", "1 Litre", "2 Litres"]
  },
  {
    name: "Other / Footwear (US/UK)",
    options: ["Free Size", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
  }
];


interface EditProductProps {
  product: ProductType;
}

const EditProduct = ({ product }: EditProductProps) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [mainCategories, setMainCategories] = useState<MainCategoryType[]>([]);
  const [customSize, setCustomSize] = useState("");
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
      alert(error.message || "An error occurred during file upload.");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      price: product.price ? Number(product.price) : 0,
      mainCategory: product.category?.mainCategoryId?.toString() || "",
      category: product.categorySlug || product.category?.slug || "",
      sizes: product.sizes || [],
      frontView: product.images?.frontView || "",
      sideView: product.images?.sideView || "",
      backView: product.images?.backView || "",
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

      const res = await fetch(`${baseUrl}/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update product");
      }
      return res.json();
    },
    onSuccess: () => {
      router.refresh();
      closeRef.current?.click();
    },
    onError: (error: any) => {
      console.error("Error updating product:", error);
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
          <SheetTitle className="mb-4">Edit Product</SheetTitle>
          <SheetDescription>Update the details for "{product.name}".</SheetDescription>
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Textarea {...field} className="min-h-32" />
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
                    onOpenChange={(open) => {
                      if (open) fetchData();
                    }}
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
                    onOpenChange={(open) => {
                      if (open) fetchData();
                    }}
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
                <FormItem className="space-y-4">
                  <FormLabel className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Available Sizes / Options</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {sizeCategories.map((category) => (
                        <div key={category.name} className="space-y-2 border border-zinc-100 dark:border-zinc-800 p-3 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            {category.name}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {category.options.map((option) => (
                              <div key={option} className="flex items-center gap-2">
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...(field.value || []), option]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter((s) => s !== option)
                                      );
                                    }
                                  }}
                                />
                                <span className="text-xs uppercase font-medium">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Render custom sizes if they exist and are selected */}
                      {field.value?.some((s) => !sizes.includes(s as any)) && (
                        <div className="space-y-2 border border-zinc-100 dark:border-zinc-800 p-3 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Custom Sizes
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {field.value
                              ?.filter((s) => !sizes.includes(s as any))
                              .map((customOpt) => (
                                <div key={customOpt} className="flex items-center gap-2">
                                  <Checkbox
                                    checked={true}
                                    onCheckedChange={(checked) => {
                                      if (!checked) {
                                        field.onChange(
                                          field.value?.filter((s) => s !== customOpt)
                                        );
                                      }
                                    }}
                                  />
                                  <span className="text-xs font-medium">{customOpt}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Custom Size Input */}
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="e.g. 5 Litres, Pack of 24, 70 x 120 in"
                          value={customSize}
                          onChange={(e) => setCustomSize(e.target.value)}
                          className="max-w-xs h-9 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (customSize.trim()) {
                                const newOption = customSize.trim();
                                if (!field.value?.includes(newOption)) {
                                  field.onChange([...(field.value || []), newOption]);
                                }
                                setCustomSize("");
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 text-xs"
                          onClick={() => {
                            if (customSize.trim()) {
                              const newOption = customSize.trim();
                              if (!field.value?.includes(newOption)) {
                                field.onChange([...(field.value || []), newOption]);
                              }
                              setCustomSize("");
                            }
                          }}
                        >
                          Add Custom
                        </Button>
                      </div>
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
              {mutation.isPending ? "Updating..." : "Save Product Details"}
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

export default EditProduct;
