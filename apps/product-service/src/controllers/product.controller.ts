import { prisma, Prisma } from "@repo/productdb";
import { Request, Response } from "express";

export const createProduct = async (req: Request, res: Response) => {
  const { images, isHomepageNewArrival, ...productData } = req.body;

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
      isHomepageNewArrival: isHomepageNewArrival === true || isHomepageNewArrival === "true",

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

  const { images, isHomepageNewArrival, ...productData } = req.body;

  const updatedProduct = await prisma.product.update({
    where: {
      id: numericId,
    },
    data: {
      ...productData,
      ...(isHomepageNewArrival !== undefined && {
        isHomepageNewArrival: isHomepageNewArrival === true || isHomepageNewArrival === "true",
      }),

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
  const { sort, category, mainCategory, homepageNewArrivals, limit, search, size } = req.query;

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

  let products = await prisma.product.findMany({
    where: {
      ...(homepageNewArrivals === "true" && {
        isHomepageNewArrival: true,
      }),
      ...(category && {
        category: {
          slug: String(category),
        },
      }),
      ...(mainCategory && {
        category: {
          mainCategory: {
            slug: String(mainCategory),
          },
        },
      }),
      ...(size && {
        sizes: {
          has: String(size),
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

  // Fallback: if homepageNewArrivals is requested but none are tagged, return the newest ones
  if (homepageNewArrivals === "true" && products.length === 0) {
    products = await prisma.product.findMany({
      where: {
        ...(category && {
          category: {
            slug: String(category),
          },
        }),
        ...(mainCategory && {
          category: {
            mainCategory: {
              slug: String(mainCategory),
            },
          },
        }),
        ...(size && {
          sizes: {
            has: String(size),
          },
        }),
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: Prisma.SortOrder.desc },
      take: limit ? Number(limit) : 10,
    });
  }

  res.status(200).json(products);
};

export const logPaymentProcessed = async (req: Request, res: Response) => {
  const { orderId, status, amount } = req.body;
  console.log(`[Product Service] Payment Processed Logged: orderId=${orderId}, status=${status}, amount=${amount}`);
  return res.status(200).json({ success: true });
};

export const bulkUploadProducts = async (req: Request, res: Response) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({
      success: false,
      message: "Products array is required",
    });
  }

  try {
    // 1. Fetch all category slugs to validate in memory (extremely fast validation)
    const existingCategories = await prisma.category.findMany({
      select: { slug: true },
    });
    const categorySlugs = new Set(existingCategories.map((c) => c.slug));

    const results = {
      total: products.length,
      successCount: 0,
      failedCount: 0,
      errors: [] as { row: number; name: string; error: string }[],
    };

    // 2. Process each product individually so one bad row doesn't fail the whole batch
    for (let i = 0; i < products.length; i++) {
      const rowNum = i + 1;
      const p = products[i];

      // Validation
      if (!p.name || !p.price || !p.categorySlug || !p.images) {
        results.failedCount++;
        results.errors.push({
          row: rowNum,
          name: p.name || `Row ${rowNum}`,
          error: "Missing required fields (name, price, categorySlug, or images)",
        });
        continue;
      }

      if (!categorySlugs.has(p.categorySlug)) {
        results.failedCount++;
        results.errors.push({
          row: rowNum,
          name: p.name,
          error: `Category slug '${p.categorySlug}' does not exist in the database`,
        });
        continue;
      }

      const { frontView, sideView, backView } = p.images;
      if (!frontView || !sideView || !backView) {
        results.failedCount++;
        results.errors.push({
          row: rowNum,
          name: p.name,
          error: "Product images must include frontView, sideView, and backView",
        });
        continue;
      }

      try {
        await prisma.product.create({
          data: {
            name: p.name,
            shortDescription: p.shortDescription || "",
            description: p.description || "",
            price: new Prisma.Decimal(p.price),
            sizes: Array.isArray(p.sizes) ? p.sizes : [p.sizes || "Free Size"],
            categorySlug: p.categorySlug,
            images: {
              create: {
                frontView,
                sideView,
                backView,
              },
            },
          },
        });
        results.successCount++;
      } catch (dbErr: any) {
        results.failedCount++;
        results.errors.push({
          row: rowNum,
          name: p.name,
          error: dbErr.message || "Database write error occurred",
        });
      }
    }

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error("Bulk Upload Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred during bulk product upload",
    });
  }
};

