"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Heart } from "lucide-react";

interface SlideData {
    id: number;
    tag: string;
    title: string;
    subtitle: string;
    offer: string;
    buttonText: string;
    buttonLink: string;
    mainImage: string;
    secondaryImage: string;
    floatingText: string;
    floatingValue: string;
}

const slides: SlideData[] = [
    {
        id: 1,
        tag: "✨ Royal Rajputi Apparels",
        title: "Wear The Heritage Of Rajasthan",
        subtitle: "Experience the royal charm of hand-dyed Bandhani Sarees, Rajputi Poshaks, and intricate Ghagra Cholis, meticulously crafted by master artisans.",
        offer: "Starting from ₹1,999",
        buttonText: "Shop Royal Wear",
        buttonLink: "/products?mainCategory=dresses",
        mainImage: "/products/poshak-maroon.jpeg",
        secondaryImage: "/products/bandhani-red.jpeg",
        floatingText: "Trending Now",
        floatingValue: "Bandhani Silk",
    },
    {
        id: 2,
        tag: "🏺 Jaipuri Handicrafts",
        title: "Enchant Your Home Spaces",
        subtitle: "Adorn your sanctuaries with handcrafted wall decors, traditional paintings, and elegant brass lamps reflecting centuries of royal heritage.",
        offer: "Artisan Direct Pricing",
        buttonText: "Explore Home Decor",
        buttonLink: "/products?mainCategory=home-interiors",
        mainImage: "/featured.jpg",
        secondaryImage: "/products/block-beige.jpeg",
        floatingText: "Exclusive",
        floatingValue: "Hand Block Art",
    },
    {
        id: 3,
        tag: "🌸 Bath & Accessories",
        title: "Elevate Your Daily Rituals",
        subtitle: "Incorporate elegance and traditional touch into your personal spaces with hand-woven mats, artisan mirrors, and organic cotton towels.",
        offer: "Flat 10% Off on Accessories",
        buttonText: "Browse Bath Range",
        buttonLink: "/products?mainCategory=bathroom",
        mainImage: "/products/mojari-brown.jpeg", // Using available mojari image for accessory theme
        secondaryImage: "/featured.jpg",
        floatingText: "Pure Organic",
        floatingValue: "Handcrafted Mats",
    },
];

const HeroSection = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            handleNextSlide();
        }, 8000);
        return () => clearInterval(timer);
    }, [activeSlide]);

    const handleNextSlide = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
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

    const slide = (slides[activeSlide] || slides[0]) as SlideData;

    return (
        <section className="relative w-full h-[450px] sm:h-[550px] md:h-[650px] lg:h-[700px] overflow-hidden">
            {/* Main Background Image */}
            <div className="absolute inset-0 transition-all duration-700">
                <Image
                    src={slide.mainImage}
                    alt={slide.title}
                    fill
                    priority
                    className={`object-cover transition-all duration-[600ms] ease-in-out scale-100 ${
                        isTransitioning ? "opacity-30 scale-98" : "opacity-100 scale-100"
                    }`}
                />
            </div>

            {/* Premium Gradient Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f2]/95 via-[#faf7f2]/75 to-transparent md:from-[#faf7f2]/90 md:via-[#faf7f2]/55 md:to-transparent" />

            {/* Content Container aligned with site width */}
            <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start">
                    <div
                        className={`max-w-2xl transition-all duration-500 ${
                            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                        }`}
                    >
                        {/* Tag Badge */}
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7d1f1f]/8 text-[#7d1f1f] text-[10px] sm:text-xs font-semibold tracking-wider uppercase border border-[#7d1f1f]/15 mb-6 shadow-xs">
                            <Sparkles size={12} className="animate-spin-slow text-[#c89b3c]" />
                            {slide.tag}
                        </span>

                        {/* Main Heading */}
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#16301d] tracking-wide font-[family-name:var(--font-heading)]">
                            {slide.title.split(" ").slice(0, -2).join(" ")}{" "}
                            <span className="text-[#7d1f1f] italic">{slide.title.split(" ").slice(-2).join(" ")}</span>
                        </h2>

                        {/* Subtitle */}
                        <p className="mt-4 text-xs sm:text-sm md:text-base text-gray-700 font-[family-name:var(--font-body)] max-w-lg leading-relaxed font-light">
                            {slide.subtitle}
                        </p>

                        {/* Price / Offer Flag */}
                        <div className="mt-6 flex items-center gap-3">
                            <span className="h-px w-8 bg-[#c89b3c]/40" />
                            <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#c89b3c] uppercase font-[family-name:var(--font-body)]">
                                {slide.offer}
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link
                                href={slide.buttonLink}
                                className="px-8 py-3.5 bg-[#16301d] hover:bg-[#234c2f] text-white border border-[#c89b3c]/30 rounded-full font-semibold tracking-wide text-xs md:text-sm transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-2 cursor-pointer"
                            >
                                {slide.buttonText}
                                <ArrowRight size={16} className="text-[#c89b3c]" />
                            </Link>

                            <Link
                                href="/products"
                                className="px-8 py-3.5 border border-[#c89b3c]/40 hover:bg-[#c89b3c]/8 text-[#16301d] rounded-full font-semibold tracking-wide text-xs md:text-sm transition-all duration-300 cursor-pointer bg-white/35 backdrop-blur-xs"
                            >
                                View Catalog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Dots (Replacing pills for clean minimal look) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-[#faf7f2]/80 backdrop-blur-xs px-4 py-3 rounded-full border border-[#c89b3c]/20 shadow-xs">
                {slides.map((item, idx) => {
                    const isTabActive = activeSlide === idx;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(idx)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                isTabActive ? "w-8 bg-[#16301d]" : "w-2 bg-gray-400/40 hover:bg-gray-400"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default HeroSection;
