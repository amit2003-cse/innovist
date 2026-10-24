"use client";

import React from "react";
import Link from "next/link";
import { FaceCream } from "@/data/faceCreams";
import { useCart } from "@/context/CartContext";
import FaceCreamJar from "./FaceCreamJar";
import TrustBadges from "./TrustBadges";
import { ShoppingCart, Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: FaceCream;
  onQuickView: (product: FaceCream) => void;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items, updateQuantity } = useCart();

  const cartItem = items.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;

  const tagBgClass =
    product.tag === "Best Seller"
      ? "bg-[#C62828]"
      : product.tag === "Trending"
      ? "bg-[#E65100]"
      : "bg-[#2E3C43]";

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group w-full h-full">
      {/* 1. Upper Image Box with Pedestal & Badges */}
      <div>
        <div className="relative w-full aspect-square bg-[#FAF7F2] flex items-center justify-center overflow-hidden border-b border-zinc-100">
          <Link
            href={`/products/${product.id}`}
            className="w-full h-full flex items-center justify-center p-3 relative cursor-pointer"
          >
            {/* Top-Left Badge (Best Seller / Trending / Aqua) */}
            {product.tag && (
              <div className="absolute top-2.5 left-2.5 z-10">
                <span
                  className={`${tagBgClass} text-white font-black text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-2xs`}
                >
                  {product.tag}
                </span>
              </div>
            )}

            {/* Visual Product Render with Pedestal */}
            <div className="transform group-hover:scale-105 transition-transform duration-300">
              <FaceCreamJar product={product} size="md" />
            </div>

            {/* Rating Badge (Bottom-Left of Image exactly like screenshots) */}
            <div className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/95 border border-emerald-400 text-emerald-900 text-[10px] sm:text-[11px] font-bold shadow-2xs">
              <span className="text-emerald-600 font-black text-xs leading-none">★</span>
              <span>{product.rating}</span>
              <span className="text-emerald-400 font-normal">|</span>
              <span className="text-emerald-800 font-medium truncate max-w-[80px]">
                {product.reviewsCount}
              </span>
            </div>
          </Link>
        </div>

        {/* 2. Product Details Section */}
        <div className="p-3 sm:p-3.5 space-y-2 flex flex-col flex-1">
          {/* Title & Subtitle */}
          <div>
            <Link
              href={`/products/${product.id}`}
              className="font-bold text-xs sm:text-sm text-zinc-950 group-hover:text-amber-700 transition line-clamp-1 leading-snug cursor-pointer block"
            >
              {product.name}
            </Link>
            <p className="text-[10px] sm:text-[11px] text-zinc-600 font-normal truncate mt-0.5">
              {product.subtitle}
            </p>
          </div>

          {/* 3 Benefit Pills (Exact from Screenshots) */}
          <div className="space-y-1 pt-0.5">
            {product.benefits.slice(0, 3).map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#F5F5F5] border border-zinc-200/50 text-[9.5px] sm:text-[10.5px] text-zinc-700 font-medium leading-tight"
              >
                <span className="text-zinc-400 font-bold text-xs leading-none shrink-0">+</span>
                <span className="truncate">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Pricing & Cart Action Section */}
      <div className="p-3 sm:p-3.5 pt-0">
        {/* Price Row + Save Pill */}
        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-zinc-950">
              ₹{product.price}
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-400 line-through font-normal">
              ₹{product.originalPrice}
            </span>
          </div>

          <span className="border border-emerald-500/70 text-emerald-800 bg-emerald-50/50 font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded">
            Save ₹{product.saveAmount}
          </span>
        </div>

        {/* Coupon Offer Line */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-800 font-bold mb-2.5 truncate">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] font-black shrink-0">
            %
          </span>
          <span className="truncate">Get it for ₹{product.flatOfferPrice} with FLAT20</span>
        </div>

        {/* Add To Cart Button (Signature Yellow) */}
        {inCart ? (
          <div className="w-full flex items-center justify-between bg-zinc-100 rounded-xl p-1 border border-zinc-200">
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
              aria-label="Decrease quantity"
              className="w-7 h-7 sm:w-8 sm:h-7 rounded-lg bg-white text-zinc-900 flex items-center justify-center hover:bg-zinc-200 transition shadow-2xs"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-zinc-900">
              {cartItem.quantity} in Bag
            </span>
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
              aria-label="Increase quantity"
              className="w-7 h-7 sm:w-8 sm:h-7 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center hover:bg-amber-500 transition shadow-2xs"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2 sm:py-2.5 px-3 rounded-xl bg-[#FFCC00] hover:bg-[#EBB800] text-zinc-950 font-black text-xs sm:text-sm tracking-wide transition shadow-xs flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-950 fill-zinc-950 shrink-0" />
            <span>Add To Cart</span>
          </button>
        )}

        {/* Risk Reversal Guarantee Strip (CRO Feature 6) */}
        <div className="mt-2 pt-2 border-t border-zinc-100">
          <TrustBadges variant="strip" />
        </div>
      </div>
    </div>
  );
}
