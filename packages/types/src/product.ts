import { z } from "zod";
import type { Product, Category, ProductImages, MainCategory } from "@repo/productdb";

export type ProductType = Omit<Product, "price" | "createdAt" | "updatedAt" | "categorySlug"> & {
  price: Product["price"] | number;
  images: Omit<ProductImages, "id" | "productId">;
  createdAt?: Date;
  updatedAt?: Date;
  categorySlug?: string;
  category?: Category;
};

export type ProductsType = ProductType[];

export type MainCategoryType = MainCategory & {
  categories?: Category[];
};

export type CategoryType = Category & {
  mainCategory?: MainCategory | null;
};

export const mainCategoryFormSchema = z.object({
  name: z.string().min(1, {
    message: "Main Category Name is required!",
  }),
  slug: z.string().min(1, {
    message: "Slug is required!",
  }),
});

export type MainCategoryFormValues = z.infer<typeof mainCategoryFormSchema>;

export const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Name is Required!" }),
  slug: z.string().min(1, { message: "Slug is Required!" }),
  mainCategoryId: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const productFormSchema = z.object({
  name: z.string().min(1, {
    message: "Product name is required!",
  }),
  shortDescription: z
    .string()
    .min(1, {
      message: "Short description is required!",
    })
    .max(90),
  description: z.string().min(1, {
    message: "Description is required!",
  }),
  price: z.number().min(1, {
    message: "Price is required!",
  }),
  mainCategory: z.string().min(1, {
    message: "Main Category is required!",
  }),
  category: z.string().min(1, {
    message: "Category is required!",
  }),
  sizes: z.array(z.string()),
  frontView: z.string().min(1, {
    message: "Front view image path is required!",
  }),
  sideView: z.string().min(1, {
    message: "Side view image path is required!",
  }),
  backView: z.string().min(1, {
    message: "Back view image path is required!",
  }),
});

export const heroSlideFormSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required!" }),
  linkUrl: z.string().min(1, { message: "Link URL is required!" }),
});

export type HeroSlideFormValues = z.infer<typeof heroSlideFormSchema>;

export type ProductFormValues = z.infer<typeof productFormSchema>;