"use client";

import React, { useState, useRef } from "react";
import { FaceCream } from "@/data/faceCreams";
import ProductCard from "./ProductCard";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface SelfCareShelfProps {
  products: FaceCream[];
  onQuickView: (product: FaceCream) => void;
  onViewAll: () => void;
}

export default function SelfCareShelf({
  products,
  onQuickView,
  onViewAll,
}: SelfCareShelfProps) {
  const [shelfFilter, setShelfFilter] = useState<string>("barrier");
  const sliderRef = useRef<HTMLDivElement>(null);

  const shelfTabs = [
    { id: "barrier", label: "Barrier Care", icon: "🛡️" },
    { id: "brightening", label: "Skin Care", icon: "🍊" },
    { id: "sun-cream", label: "Sun Care", icon: "☀️" },
    { id: "hydra", label: "Hydra Gel", icon: "💧" },
  ];

  const filteredProducts = products.filter((p) => p.category === shelfFilter);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-4 sm:py-6 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Title & All Products Link */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-zinc-900 tracking-tight">
            The Self-Care Shelf
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-500 hidden sm:block">
            Targeted face creams formulated for daily self-care rituals
          </p>
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
        {shelfTabs.map((tab) => {
          const isActive = shelfFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setShelfFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                isActive
                  ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs"
                  : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Swipeable Slider */}
      <div className="relative group/slider">
        <div
          ref={sliderRef}
          className="flex gap-2.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-3 pt-1 px-0.5 -mx-0.5"
        >
          {filteredProducts.map((product) => (
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
