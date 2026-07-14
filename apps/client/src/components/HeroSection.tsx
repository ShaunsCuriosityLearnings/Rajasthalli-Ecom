"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface SlideData {
  id: number;
  imageUrl: string;
  linkUrl: string;
}

interface HeroSectionProps {
  slides?: SlideData[];
}

const fallbackSlides: SlideData[] = [
  {
    id: 1,
    imageUrl: "/products/poshak-maroon.jpeg",
    linkUrl: "/products?mainCategory=dresses",
  },
  {
    id: 2,
    imageUrl: "/featured.jpg",
    linkUrl: "/products?mainCategory=home-interiors",
  },
  {
    id: 3,
    imageUrl: "/products/mojari-brown.jpeg",
    linkUrl: "/products?mainCategory=bathroom",
  },
];

const HeroSection = ({ slides = [] }: HeroSectionProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeSlides = slides.length > 0 ? slides : fallbackSlides;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      handleNextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlide, activeSlides.length]);

  const handleNextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % activeSlides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handleTabClick = (index: number) => {
    if (index === activeSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide(index);
      setIsTransitioning(false);
    }, 300);
  };

  const slide = activeSlides[activeSlide] || activeSlides[0] || fallbackSlides[0];

  if (!slide) return null;

  return (
    <section className="relative w-full aspect-[16/7] sm:aspect-auto sm:h-[420px] md:h-[480px] lg:h-[540px] xl:h-[580px] overflow-hidden bg-neutral-100">
      {/* Slide Image wrapped in Redirection Link */}
      <Link href={slide.linkUrl} className="block w-full h-full relative cursor-pointer">
        <div className="absolute inset-0 transition-all duration-700">
          <Image
            src={slide.imageUrl}
            alt={`Hero Banner ${slide.id}`}
            fill
            priority
            className={`object-contain sm:object-cover transition-all duration-[600ms] ease-in-out scale-100 ${
              isTransitioning ? "opacity-30 scale-98" : "opacity-100 scale-100"
            }`}
          />
        </div>
      </Link>

      {/* Navigation Dots (Replacing pills for clean minimal look) */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-white/70 backdrop-blur-xs px-4 py-2.5 rounded-full border border-white/20 shadow-xs z-10">
          {activeSlides.map((item, idx) => {
            const isTabActive = activeSlide === idx;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isTabActive ? "w-8 bg-[#16301d]" : "w-2 bg-gray-400/60 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
