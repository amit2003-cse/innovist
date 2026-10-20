"use client";

import React, { useRef } from "react";
import { FaceCream } from "@/data/faceCreams";
import ProductCard from "./ProductCard";
import { ArrowRight, Flame, ChevronLeft, ChevronRight } from "lucide-react";

interface BestSellersSectionProps {
  products: FaceCream[];
  onQuickView: (product: FaceCream) => void;
  onViewAll: () => void;
}

export default function BestSellersSection({
  products,
  onQuickView,
  onViewAll,
}: BestSellersSectionProps) {
  const bestSellers = products.filter((p) => p.isBestSeller);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const cardWidth = 280;
      const scrollAmount = direction === "left" ? -cardWidth * 1.5 : cardWidth * 1.5;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-4 sm:py-6 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-zinc-900 tracking-tight">
              Best Sellers Across Brands
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500 hidden sm:block">
              Top clinically proven face creams and daily barrier moisturizers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Left/Right Controls */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous products"
              className="w-7 h-7 rounded-full bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-700 hover:text-black flex items-center justify-center transition shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next products"
              className="w-7 h-7 rounded-full bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-700 hover:text-black flex items-center justify-center transition shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-amber-600 transition flex items-center gap-1 group shrink-0 ml-1"
          >
            <span>More Products</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Horizontal Swipeable Slider - Matches Innovist Mobile Screenshot 1 */}
      <div className="relative group/slider">
        <div
          ref={sliderRef}
          className="flex gap-2.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-3 pt-1 px-0.5 -mx-0.5"
        >
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="w-[72vw] max-w-[280px] sm:w-[250px] md:w-[270px] shrink-0 snap-start flex"
            >
              <ProductCard
                product={product}
                onQuickView={onQuickView}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
