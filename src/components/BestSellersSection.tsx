"use client";

import React from "react";
import { FaceCream } from "@/data/faceCreams";
import ProductCard from "./ProductCard";
import { ArrowRight, Flame } from "lucide-react";

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

  return (
    <section className="py-4 sm:py-6 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
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

        <button
          onClick={onViewAll}
          className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-amber-600 transition flex items-center gap-1 group shrink-0"
        >
          <span>More Products</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid: 2 columns on mobile, 4 on desktop (Matches Innovist Screenshots 1 & 2) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
        {bestSellers.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
}
