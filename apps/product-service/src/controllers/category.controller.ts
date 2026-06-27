import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/productdb";

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug, mainCategoryId } = req.body;

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      mainCategoryId: mainCategoryId ? Number(mainCategoryId) : null,
    },
    include: {
      mainCategory: true,
    },
  });

  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug, mainCategoryId } = req.body;

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (slug !== undefined) updateData.slug = slug;
  if (mainCategoryId !== undefined) {
    updateData.mainCategoryId = mainCategoryId ? Number(mainCategoryId) : null;
  }

  const category = await prisma.category.update({
    where: {
      id: Number(id),
    },
    data: updateData,
    include: {
      mainCategory: true,
    },
  });

  res.status(200).json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numericId = Number(id);

  const category = await prisma.category.findUnique({
    where: { id: numericId },
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  // 1. Delete associated product images first, since they reference Product.id
  const products = await prisma.product.findMany({
    where: { categorySlug: category.slug },
  });
  const productIds = products.map((p) => p.id);

  await prisma.productImages.deleteMany({
    where: { productId: { in: productIds } },
  });

  // 2. Delete products assigned to this category
  await prisma.product.deleteMany({
    where: { categorySlug: category.slug },
  });

  // 3. Delete the category itself
  await prisma.category.delete({
    where: { id: numericId },
  });

  res.status(200).json({
    success: true,
    message: "Category and all assigned products deleted successfully",
  });
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      mainCategory: true,
      products: {
        include: {
          images: true,
        },
      },
    },
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.status(200).json(category);
};

export const getCategorys = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: {
      mainCategory: true,
      // products: true,
    },
  });

  res.status(200).json(categories);
};
