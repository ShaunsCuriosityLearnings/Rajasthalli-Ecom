"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, UploadCloud, Link as LinkIcon, ExternalLink, FileImage } from "lucide-react";

interface HeroSlide {
  id: number;
  imageUrl: string;
  linkUrl: string;
  createdAt: string;
}

const HeroSlidesManager = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";

  // Fetch existing slides
  const { data: slides = [], isLoading } = useQuery<HeroSlide[]>({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/hero`);
      if (!res.ok) throw new Error("Failed to fetch hero slides");
      return res.json();
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
      setImageUrl(data.secure_url);
    } catch (error: any) {
      console.error("Error uploading hero banner:", error);
      alert(error.message || "An error occurred during file upload. Please verify your Cloudinary configurations.");
    } finally {
      setUploadingImage(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (payload: { imageUrl: string; linkUrl: string }) => {
      const token = await getToken();
      const res = await fetch(`${baseUrl}/hero`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create hero slide");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      setImageUrl("");
      setLinkUrl("");
      router.refresh();
    },
    onError: (error: any) => {
      console.error("Error creating hero slide:", error);
      alert(error.message || "Failed to add slide. Ensure you are under the 5 slides limit.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = await getToken();
      const res = await fetch(`${baseUrl}/hero/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete hero slide");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      router.refresh();
    },
    onError: (error: any) => {
      console.error("Error deleting hero slide:", error);
      alert(error.message || "Failed to delete slide.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload a banner image.");
      return;
    }
    if (!linkUrl) {
      alert("Please enter a link destination URL.");
      return;
    }
    createMutation.mutate({ imageUrl, linkUrl });
  };

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Hero Banners</h1>
        <p className="text-muted-foreground">
          Manage full-width home screen banners. Banners must be exactly <strong>2560 × 1440 pixels</strong> in resolution and contain no text overlays. Max 5 slides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Create / Add form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Banner</CardTitle>
              <CardDescription>Upload a banner image and attach a redirect link.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* File Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Banner Image</label>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage || slides.length >= 5}
                    />
                    {uploadingImage && (
                      <p className="text-xs text-muted-foreground animate-pulse flex items-center gap-1.5">
                        <UploadCloud size={14} className="animate-bounce" /> Uploading to Cloudinary...
                      </p>
                    )}
                    {imageUrl && (
                      <div className="relative aspect-[16/9] w-full border rounded-lg overflow-hidden mt-1 shadow-sm bg-neutral-50">
                        <img
                          src={imageUrl}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Redirect Link Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Redirect Link URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                    <Input
                      type="text"
                      placeholder="/products?mainCategory=dresses"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="pl-9"
                      disabled={slides.length >= 5}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Link when the user clicks the banner. E.g., `/products?category=dresses`
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || uploadingImage || slides.length >= 5}
                >
                  {createMutation.isPending ? (
                    "Adding..."
                  ) : (
                    <>
                      <Plus size={16} className="mr-1.5" /> Add Slide
                    </>
                  )}
                </Button>

                {slides.length >= 5 && (
                  <p className="text-xs text-red-500 text-center font-medium">
                    Maximum limit of 5 slides reached.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Active banners preview grid */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Active Slides</CardTitle>
                  <CardDescription>Currently active slides in rotation ({slides.length}/5).</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-28 w-full bg-neutral-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : slides.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <FileImage className="mx-auto text-muted-foreground mb-2 opacity-50" size={40} />
                  <p className="text-sm text-muted-foreground">No active hero banners. A fallback slider is shown to users.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {slides.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className="flex items-center gap-4 p-3 border rounded-lg bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                    >
                      {/* Thumbnail Preview */}
                      <div className="relative aspect-[16/9] w-32 flex-shrink-0 border rounded-md overflow-hidden bg-neutral-200">
                        <img
                          src={slide.imageUrl}
                          alt={`Banner ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Info & Actions */}
                      <div className="flex-grow min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono truncate">
                          <LinkIcon size={12} />
                          <span className="truncate">{slide.linkUrl}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Added: {new Date(slide.createdAt).toLocaleDateString()}
                        </div>
                        <div className="pt-1.5 flex gap-2">
                          <a
                            href={slide.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                          >
                            Test link <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this banner?")) {
                            deleteMutation.mutate(slide.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSlidesManager;
