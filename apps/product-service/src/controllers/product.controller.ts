import { prisma, Prisma } from "@repo/productdb";
import { Request, Response } from "express";

export const createProduct = async (req: Request, res: Response) => {
  const { images, ...productData } = req.body;

  if (!images) {
    return res.status(400).json({
      success: false,
      message: "Images are required",
    });
  }

  const { frontView, sideView, backView } = images;

  if (!frontView || !sideView || !backView) {
    return res.status(400).json({
      success: false,
      message: "Front view, Side view and Back view images are required",
    });
  }

  const product = await prisma.product.create({
    data: {
      ...productData,

      images: {
        create: {
          frontView,
          sideView,
          backView,
        },
      },
    },
    include: {
      images: true,
      category: true,
    },
  });

  res.status(201).json({
    success: true,
    product,
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  const { images, ...productData } = req.body;

  const updatedProduct = await prisma.product.update({
    where: {
      id: numericId,
    },
    data: {
      ...productData,

      ...(images && {
        images: {
          upsert: {
            create: {
              frontView: images.frontView,
              sideView: images.sideView,
              backView: images.backView,
            },
            update: {
              frontView: images.frontView,
              sideView: images.sideView,
              backView: images.backView,
            },
          },
        },
      }),
    },
    include: {
      images: true,
      category: true,
    },
  });

  return res.status(200).json(updatedProduct);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  const deletedproduct = await prisma.product.delete({
    where: { id: numericId },
  });
  return res.status(200).json(deletedproduct);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  const product = await prisma.product.findUnique({
    where: {
      id: numericId,
    },
    include: {
      images: true,
      category: true,
    },
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json(product);
};

export const getProducts = async (req: Request, res: Response) => {
  const { sort, category, limit, search } = req.query;

  const orderBy = (() => {
    switch (sort) {
      case "asc":
        return { price: Prisma.SortOrder.asc };

      case "desc":
        return { price: Prisma.SortOrder.desc };

      case "oldest":
        return { createdAt: Prisma.SortOrder.asc };

      default:
        return { createdAt: Prisma.SortOrder.desc };
    }
  })();

  const products = await prisma.product.findMany({
    where: {
      ...(category && {
        category: {
          slug: String(category),
        },
      }),
      ...(search && {
        OR: [
          {
            name: {
              contains: String(search),
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: String(search),
              mode: "insensitive",
            },
          },
          {
            shortDescription: {
              contains: String(search),
              mode: "insensitive",
            },
          },
        ],
      }),
    },
    include: {
      images: true,
      category: true,
    },
    orderBy,
    take: limit ? Number(limit) : undefined,
  });

  res.status(200).json(products);
};

export const logPaymentProcessed = async (req: Request, res: Response) => {
  const { orderId, status, amount } = req.body;
  console.log(`[Product Service] Payment Processed Logged: orderId=${orderId}, status=${status}, amount=${amount}`);
  return res.status(200).json({ success: true });
};

