import { prisma, Prisma } from "@repo/productdb";
import { Request, Response } from "express";

export const createMaincategory = async (req: Request, res: Response) => {
  const data: Prisma.MainCategoryCreateInput = req.body;

  const mainCategory = await prisma.mainCategory.create({
    data,
  });

  res.status(201).json(mainCategory);
};

export const updateMaincategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const data: Prisma.MainCategoryUpdateInput = req.body;

  const mainCategory = await prisma.mainCategory.update({
    where: {
      id: Number(id),
    },
    data,
  });

  res.status(200).json(mainCategory);
};

export const deleteMaincategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numericId = Number(id);

  // 1. Find all categories belonging to this main category
  const categories = await prisma.category.findMany({
    where: { mainCategoryId: numericId },
  });
  const categorySlugs = categories.map((cat) => cat.slug);

  // 2. Find all products belonging to these categories
  const products = await prisma.product.findMany({
    where: { categorySlug: { in: categorySlugs } },
  });
  const productIds = products.map((p) => p.id);

  // 3. Delete all product images associated with these products
  await prisma.productImages.deleteMany({
    where: { productId: { in: productIds } },
  });

  // 4. Delete all products in these categories
  await prisma.product.deleteMany({
    where: { categorySlug: { in: categorySlugs } },
  });

  // 5. Delete all categories under this main category
  await prisma.category.deleteMany({
    where: { mainCategoryId: numericId },
  });

  // 6. Delete the main category itself
  await prisma.mainCategory.delete({
    where: { id: numericId },
  });

  res.status(200).json({
    success: true,
    message: "Main Category, its categories, and all associated products deleted successfully",
  });
};

export const getMaincategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const mainCategory = await prisma.mainCategory.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      categories: {
        include: {
          products: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!mainCategory) {
    return res.status(404).json({
      success: false,
      message: "Main Category not found",
    });
  }

  res.status(200).json(mainCategory);
};

export const getMaincategorys = async (req: Request, res: Response) => {
  const mainCategories = await prisma.mainCategory.findMany({
    include: {
      categories: true,
    },
  });

  res.status(200).json(mainCategories);
};
