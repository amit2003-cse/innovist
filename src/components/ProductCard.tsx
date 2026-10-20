"use client";

import React from "react";
import { FaceCream } from "@/data/faceCreams";
import { useCart } from "@/context/CartContext";
import FaceCreamJar from "./FaceCreamJar";
import { Star, ShoppingCart, Percent, Sparkles, Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: FaceCream;
  onQuickView: (product: FaceCream) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, items, updateQuantity } = useCart();

  const cartItem = items.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group w-full">
      {/* Upper Area: Visual & Badges */}
      <div>
        <div
          onClick={() => onQuickView(product)}
          className={`relative cursor-pointer w-full pt-3 pb-3 sm:pt-4 sm:pb-5 px-2 sm:px-4 bg-gradient-to-b ${product.accentColor} rounded-t-2xl sm:rounded-t-3xl flex flex-col items-center justify-center transition-all group-hover:brightness-95`}
        >
          {/* Best Seller / Tag Badge (Matches Innovist Screenshot) */}
          {product.tag && (
            <div className="absolute top-2 left-2 z-10">
              <span
                className={`text-[9px] sm:text-xs font-black text-white px-2 py-0.5 sm:py-1 rounded-full shadow-xs tracking-wider uppercase ${
                  product.isBestSeller ? "bg-rose-600" : "bg-zinc-800"
                }`}
              >
                {product.tag}
              </span>
            </div>
          )}

          {/* Product Jar Illustration */}
          <div className="py-1 transform group-hover:scale-105 transition-transform duration-300">
            <FaceCreamJar product={product} size="md" />
          </div>

          {/* Rating Pill Badge (Matches Innovist UI) */}
          <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] sm:text-[11px] font-bold shadow-2xs">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span>{product.rating}</span>
            <span className="text-emerald-400 font-normal">|</span>
            <span className="text-emerald-700 font-medium truncate max-w-[70px]">
              {product.reviewsCount}
            </span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-2.5 sm:p-4 flex flex-col flex-1">
          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-extrabold text-xs sm:text-sm md:text-base text-zinc-900 group-hover:text-amber-800 transition line-clamp-2 cursor-pointer leading-tight tracking-tight min-h-[32px] sm:min-h-[40px]"
          >
            {product.name}
          </h3>

          {/* Subtitle / Volume */}
          <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 truncate">
            {product.subtitle}
          </p>

          {/* Benefit Tags with Sparkle ✦ */}
          <div className="mt-2 space-y-1">
            {product.benefits.slice(0, 2).map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-50 border border-zinc-100 text-[9px] sm:text-[11px] text-zinc-700 font-medium leading-none"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                <span className="truncate">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Cart Action Section */}
      <div className="px-2.5 sm:px-4 pb-2.5 sm:pb-4 pt-1">
        {/* Price Row */}
        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-lg font-black text-zinc-900">
              ₹{product.price}
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-400 line-through">
              ₹{product.originalPrice}
            </span>
          </div>
          <span className="text-[9px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            Save ₹{product.saveAmount}
          </span>
        </div>

        {/* Flat Coupon Offer Badge */}
        <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-emerald-700 mb-2 truncate">
          <div className="w-3 h-3 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Percent className="w-2 h-2" />
          </div>
          <span className="truncate">₹{product.flatOfferPrice} with FLAT20</span>
        </div>

        {/* Primary Action Button (Innovist Golden Yellow) */}
        {inCart ? (
          <div className="w-full flex items-center justify-between bg-zinc-100 rounded-xl sm:rounded-2xl p-1 border border-zinc-200">
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
              aria-label="Decrease quantity"
              className="w-7 h-7 sm:w-9 sm:h-8 rounded-lg bg-white text-zinc-900 flex items-center justify-center hover:bg-zinc-200 transition shadow-2xs"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[11px] sm:text-xs font-bold text-zinc-900">
              {cartItem.quantity} in Bag
            </span>
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
              aria-label="Increase quantity"
              className="w-7 h-7 sm:w-9 sm:h-8 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center hover:bg-amber-500 transition shadow-2xs"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2 sm:py-2.5 px-2 rounded-xl sm:rounded-2xl bg-[#FFCC00] hover:bg-[#EBB800] text-zinc-950 font-black text-[11px] sm:text-xs tracking-wide transition shadow-xs flex items-center justify-center gap-1.5 transform active:scale-98"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
            <span>Add To Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
