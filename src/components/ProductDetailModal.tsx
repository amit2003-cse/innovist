"use client";

import React from "react";
import { FaceCream } from "@/data/faceCreams";
import { useCart } from "@/context/CartContext";
import FaceCreamJar from "./FaceCreamJar";
import {
  X,
  Star,
  Check,
  ShieldCheck,
  Sparkles,
  Droplet,
  Sun,
  Moon,
  ShoppingCart,
  Percent
} from "lucide-react";

interface ProductDetailModalProps {
  product: FaceCream | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart, items, setIsCartOpen } = useCart();

  if (!product) return null;

  const inCart = items.some((item) => item.product.id === product.id);

  const handleAddAndOpenCart = () => {
    addToCart(product);
    setIsCartOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-zinc-100 relative my-6 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-zinc-100 text-zinc-600 transition shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Top Visual Showcase */}
          <div
            className={`w-full py-8 px-6 bg-gradient-to-b ${product.accentColor} flex flex-col items-center justify-center relative`}
          >
            {product.tag && (
              <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-zinc-900 text-white uppercase tracking-wider">
                {product.tag}
              </span>
            )}
            <FaceCreamJar product={product} size="lg" />

            {/* Rating */}
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-zinc-200 text-zinc-800 text-xs font-bold shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-zinc-300">|</span>
              <span className="text-zinc-600 font-medium">{product.reviewsCount}</span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
                {product.subtitle}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-black text-zinc-900">
                  ₹{product.price}
                </span>
                <span className="text-sm text-zinc-400 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Save ₹{product.saveAmount}
                </span>
              </div>

              {/* Special coupon pill */}
              <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Percent className="w-3.5 h-3.5" />
                <span>Special price: ₹{product.flatOfferPrice} with coupon FLAT20</span>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Key Clinical Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs font-semibold text-zinc-800"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Science & Ingredients */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2 text-xs">
              <h3 className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                Clinical Formulation Breakdown
              </h3>
              <p className="text-amber-800 leading-relaxed">
                {product.keyIngredientSummary}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.keyIngredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 font-semibold text-[11px]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* How to Use Routine */}
            <div className="space-y-2 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                How To Incorporate In Your Routine
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900 mb-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Morning (AM) Routine</span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">{product.howToUse.am}</p>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900 mb-1">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Evening (PM) Routine</span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">{product.howToUse.pm}</p>
                </div>
              </div>
            </div>

            {/* Texture & Skin Type */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-zinc-100">
              <div>
                <span className="text-zinc-400 block font-semibold text-[11px]">
                  Texture & Feel:
                </span>
                <span className="font-bold text-zinc-800">{product.texture}</span>
              </div>
              <div>
                <span className="text-zinc-400 block font-semibold text-[11px]">
                  Skin Compatibility:
                </span>
                <span className="font-bold text-zinc-800">{product.skinType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-zinc-500">Price per unit:</span>
            <div className="text-lg font-black text-zinc-900">₹{product.price}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addToCart(product)}
              className="px-5 py-3 rounded-2xl bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-900 font-bold text-xs flex items-center gap-2 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{inCart ? "Add Another" : "Add To Bag"}</span>
            </button>

            <button
              onClick={handleAddAndOpenCart}
              className="px-6 py-3 rounded-2xl bg-[#FFCC00] hover:bg-[#EBB800] text-zinc-950 font-extrabold text-xs tracking-wide shadow-sm flex items-center gap-2 transition"
            >
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
