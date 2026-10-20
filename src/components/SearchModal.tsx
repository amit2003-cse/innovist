"use client";

import React, { useState, useEffect, useRef } from "react";
import { FACE_CREAMS, FaceCream } from "@/data/faceCreams";
import { useCart } from "@/context/CartContext";
import FaceCreamJar from "./FaceCreamJar";
import { Search, X, Star, ShoppingCart, Sparkles, ArrowRight } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickView: (product: FaceCream) => void;
}

export default function SearchModal({ isOpen, onClose, onQuickView }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickPills = ["Ceramides", "Vitamin C", "Dry Barrier", "SPF 50", "Salicylic", "Night Repair"];

  const filteredProducts = query.trim()
    ? FACE_CREAMS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.concern.toLowerCase().includes(q) ||
          p.keyIngredients.some((ing) => ing.toLowerCase().includes(q))
        );
      })
    : FACE_CREAMS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-zinc-100 flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Face Creams, Ceramides, Glow, SPF..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-semibold text-zinc-500 hover:text-zinc-800"
            >
              ESC
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-white border-b border-zinc-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-zinc-400 font-semibold text-[11px] whitespace-nowrap">
            Popular:
          </span>
          {quickPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setQuery(pill)}
              className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-amber-100 text-zinc-700 hover:text-amber-900 transition whitespace-nowrap font-medium text-[11px]"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            <span>{query ? `Search Results (${filteredProducts.length})` : "Trending Face Creams"}</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">
              <p className="text-sm font-semibold">No face cream matches found for &quot;{query}&quot;</p>
              <p className="text-xs text-zinc-400 mt-1">
                Try searching for &quot;Ceramides&quot;, &quot;Vitamin C&quot;, or &quot;Hydra&quot;
              </p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-zinc-50 border border-zinc-100 transition group"
              >
                {/* Product thumbnail */}
                <div
                  onClick={() => {
                    onQuickView(p);
                    onClose();
                  }}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-b ${p.accentColor} flex items-center justify-center shrink-0 cursor-pointer`}
                >
                  <FaceCreamJar product={p} size="sm" />
                </div>

                {/* Details */}
                <div
                  onClick={() => {
                    onQuickView(p);
                    onClose();
                  }}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 group-hover:text-amber-700 transition truncate">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 truncate">{p.subtitle}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-zinc-900">₹{p.price}</span>
                    <span className="text-[10px] text-zinc-400 line-through">₹{p.originalPrice}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      ★ {p.rating}
                    </span>
                  </div>
                </div>

                {/* Quick Add To Cart */}
                <button
                  onClick={() => addToCart(p)}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95 transition"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            100% Face Cream Formulations Only
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-zinc-800 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
