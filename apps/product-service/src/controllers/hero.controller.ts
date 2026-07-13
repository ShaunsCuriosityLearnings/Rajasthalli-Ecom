import { Request, Response } from "express";
import { prisma } from "@repo/productdb";

export const getHeroSlides = async (req: Request, res: Response) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.status(200).json(slides);
  } catch (error: any) {
    console.error("Error fetching hero slides:", error);
    res.status(500).json({ error: error.message || "Failed to fetch hero slides" });
  }
};

export const createHeroSlide = async (req: Request, res: Response) => {
  try {
    const { imageUrl, linkUrl } = req.body;

    if (!imageUrl || !linkUrl) {
      return res.status(400).json({ error: "Missing required fields: imageUrl or linkUrl" });
    }

    // Enforce maximum of 5 slides
    const count = await prisma.heroSlide.count();
    if (count >= 5) {
      return res.status(400).json({ error: "Maximum limit of 5 hero slides reached. Please delete an existing slide first." });
    }

    const slide = await prisma.heroSlide.create({
      data: {
        imageUrl,
        linkUrl,
      },
    });

    res.status(201).json(slide);
  } catch (error: any) {
    console.error("Error creating hero slide:", error);
    res.status(500).json({ error: error.message || "Failed to create hero slide" });
  }
};

export const deleteHeroSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    const slide = await prisma.heroSlide.findUnique({
      where: { id: numericId },
    });

    if (!slide) {
      return res.status(404).json({ error: "Hero slide not found" });
    }

    await prisma.heroSlide.delete({
      where: { id: numericId },
    });

    res.status(200).json({ success: true, message: "Hero slide deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting hero slide:", error);
    res.status(500).json({ error: error.message || "Failed to delete hero slide" });
  }
};
