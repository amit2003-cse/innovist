"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FACE_CREAMS } from "@/data/faceCreams";
import FaceCreamJar from "./FaceCreamJar";
import { CheckCircle2, X, Sparkles, ShoppingBag } from "lucide-react";

interface SocialPurchase {
  buyerName: string;
  city: string;
  productId: string;
  timeAgo: string;
}

const PURCHASES: SocialPurchase[] = [
  {
    buyerName: "Ananya S.",
    city: "Mumbai",
    productId: "salicylic-acid-face-wash",
    timeAgo: "2 minutes ago",
  },
  {
    buyerName: "Rohan M.",
    city: "Bengaluru",
    productId: "retinol-night-face-cream",
    timeAgo: "4 minutes ago",
  },
  {
    buyerName: "Priya K.",
    city: "New Delhi",
    productId: "ceramide-barrier-cream",
    timeAgo: "6 minutes ago",
  },
  {
    buyerName: "Aarav D.",
    city: "Pune",
    productId: "exfoliating-face-scrub",
    timeAgo: "1 minute ago",
  },
  {
    buyerName: "Sneha R.",
    city: "Hyderabad",
    productId: "hyaluronic-hydra-gel",
    timeAgo: "8 minutes ago",
  },
  {
    buyerName: "Tanvi V.",
    city: "Kolkata",
    productId: "vitamin-c-radiance-face-wash",
    timeAgo: "3 minutes ago",
  },
];

export default function SocialProofToast() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    // Initial delay before first toast appears
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!mounted || isDismissed) return;

    // Toast display cycle: Visible for 6s, hidden for 6s before next (12s total cycle)
    const interval = setInterval(() => {
      if (isHoveredRef.current) return;

      setIsVisible(false);

      setTimeout(() => {
        if (!isHoveredRef.current) {
          setCurrentIndex((prev) => (prev + 1) % PURCHASES.length);
          setIsVisible(true);
        }
      }, 800);
    }, 12000);

    return () => clearInterval(interval);
  }, [mounted, isDismissed]);

  if (!mounted || isDismissed) return null;

  const current = PURCHASES[currentIndex];
  const product =
    FACE_CREAMS.find((p) => p.id === current.productId) || FACE_CREAMS[0];

  return (
    <div
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className={`fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40 max-w-[320px] sm:max-w-[340px] transition-all duration-500 transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-zinc-200/90 shadow-xl flex items-center gap-2.5 relative group">
        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-900 hover:bg-black text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow"
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Product Thumbnail */}
        <Link
          href={`/products/${product.id}`}
          className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-zinc-100 flex items-center justify-center p-1 shrink-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
        >
          <FaceCreamJar product={product} size="sm" />
        </Link>

        {/* Purchase Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-[11px] text-zinc-950 truncate">
              {current.buyerName}
            </span>
            <span className="text-[10px] text-zinc-400">from</span>
            <span className="font-bold text-[10px] text-zinc-700 truncate">
              {current.city}
            </span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="block text-[11px] font-bold text-zinc-800 hover:text-amber-700 truncate leading-tight mt-0.5"
          >
            Purchased {product.shortName}
          </Link>

          <div className="flex items-center justify-between gap-1 mt-1">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 text-[9px] font-bold">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
              <span>Verified Buyer</span>
            </div>
            <span className="text-[9px] text-zinc-400">{current.timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
