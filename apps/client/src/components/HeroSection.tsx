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
        <section className="relative w-full py-8 md:py-16 overflow-hidden">
            {/* Background Gradients & Sunburst */}
            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#faf7f2] via-[#f5efe2] to-[#eef4e8]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-[#c89b3c]/5 to-transparent blur-3xl -z-10" />

            {/* Double Gold Heritage Border Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative border border-[#c89b3c]/30 rounded-[40px] p-6 md:p-12 lg:p-16 bg-[#faf7f2]/40 backdrop-blur-xs shadow-lg">
                    {/* Corner Flourishes */}
                    <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#c89b3c]/40 rounded-tl-sm" />
                    <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#c89b3c]/40 rounded-tr-sm" />
                    <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#c89b3c]/40 rounded-bl-sm" />
                    <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#c89b3c]/40 rounded-br-sm" />

                    {/* Grid Layout */}
                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        {/* LEFT CONTENT (7 cols on lg) */}
                        <div
                            className={`lg:col-span-7 flex flex-col items-start transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                                }`}
                        >
                            {/* Tag Badge */}
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7d1f1f]/8 text-[#7d1f1f] text-xs font-semibold tracking-wider uppercase border border-[#7d1f1f]/15 mb-6 shadow-xs">
                                <Sparkles size={12} className="animate-spin-slow text-[#c89b3c]" />
                                {slide.tag}
                            </span>

                            {/* Main Heading */}
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#18320b] tracking-wide font-[family-name:var(--font-heading)]">
                                {slide.title.split(" ").slice(0, -2).join(" ")}{" "}
                                <span className="text-[#7d1f1f] italic">{slide.title.split(" ").slice(-2).join(" ")}</span>
                            </h2>

                            {/* Subtitle */}
                            <p className="mt-4 text-sm md:text-base text-gray-600 font-[family-name:var(--font-body)] max-w-xl leading-relaxed">
                                {slide.subtitle}
                            </p>

                            {/* Price / Offer Flag */}
                            <div className="mt-6 flex items-center gap-3">
                                <span className="h-px w-8 bg-[#c89b3c]/40" />
                                <span className="text-sm font-semibold tracking-widest text-[#c89b3c] uppercase font-[family-name:var(--font-body)]">
                                    {slide.offer}
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-4 mt-8">
                                <Link
                                    href={slide.buttonLink}
                                    className="px-8 py-3.5 bg-[#18320b] hover:bg-[#234712] text-white border border-[#c89b3c]/30 rounded-full font-semibold tracking-wide text-xs md:text-sm transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-2 cursor-pointer"
                                >
                                    {slide.buttonText}
                                    <ArrowRight size={16} className="text-[#c89b3c]" />
                                </Link>

                                <Link
                                    href="/products"
                                    className="px-8 py-3.5 border border-[#c89b3c]/40 hover:bg-[#c89b3c]/8 text-[#18320b] rounded-full font-semibold tracking-wide text-xs md:text-sm transition-all duration-300 cursor-pointer"
                                >
                                    View Catalog
                                </Link>
                            </div>

                            {/* Features Bar */}
                            <div className="flex items-center gap-6 mt-10 text-[11px] text-[#18320b]/75 font-semibold tracking-wider uppercase font-[family-name:var(--font-body)]">
                                <span className="flex items-center gap-1">
                                    <Shield size={13} className="text-[#c89b3c]" /> 100% Handcrafted
                                </span>
                                <span className="flex items-center gap-1">
                                    <Heart size={13} className="text-[#7d1f1f]" /> Artisan Direct
                                </span>
                            </div>
                        </div>

                        {/* RIGHT IMAGE COLLAGE (5 cols on lg) */}
                        <div
                            className={`lg:col-span-5 relative flex items-center justify-center transition-all duration-300 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
                                }`}
                        >
                            {/* Decorative Mandalas / Sunburst in background */}
                            <div className="absolute w-72 h-72 border border-[#c89b3c]/10 rounded-full animate-spin-slow pointer-events-none -z-10" />
                            <div className="absolute w-[320px] h-[320px] border border-dashed border-[#c89b3c]/5 rounded-full pointer-events-none -z-10" />

                            {/* Main Image Frame */}
                            <div className="relative w-full h-[360px] md:h-[450px] rounded-[36px] overflow-hidden shadow-2xl border border-[#c89b3c]/20">
                                <Image
                                    src={slide.mainImage}
                                    alt={slide.title}
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>

                            {/* Layered Overlapping Image */}
                            <div className="absolute -bottom-6 -left-8 w-36 h-48 md:w-44 md:h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#faf7f2] hidden sm:block">
                                <Image
                                    src={slide.secondaryImage}
                                    alt="Creative Highlight"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Floating Card */}
                            <div className="absolute -right-6 top-10 bg-[#faf7f2] border border-[#c89b3c]/30 rounded-2xl shadow-xl p-4 md:p-5 flex flex-col animate-bounce-slow">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold font-[family-name:var(--font-body)]">
                                    {slide.floatingText}
                                </span>
                                <span className="font-bold text-sm md:text-base text-[#18320b] mt-1 font-[family-name:var(--font-heading)]">
                                    {slide.floatingValue}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Navigation Tabs (Pills under the Hero Box) */}
                <div className="flex justify-center items-center gap-3 mt-8">
                    {slides.map((item, idx) => {
                        const isTabActive = activeSlide === idx;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(idx)}
                                className={`px-4 py-2 text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-full border transition-all duration-300 cursor-pointer ${isTabActive
                                        ? "bg-[#18320b] border-[#c89b3c]/40 text-[#faf7f2] shadow-sm"
                                        : "bg-[#faf7f2]/60 hover:bg-[#faf7f2] border-gray-200 text-gray-500"
                                    }`}
                            >
                                0{item.id} {item.tag.split(" ").slice(1).join(" ")}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
