"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Home, Grid, Search, ShoppingBag, User } from "lucide-react";

interface MobileBottomNavProps {
  onOpenSearch: () => void;
  onScrollToTop: () => void;
  onScrollToCategories: () => void;
}

export default function MobileBottomNav({
  onOpenSearch,
  onScrollToTop,
  onScrollToCategories,
}: MobileBottomNavProps) {
  const { totalItemsCount, setIsCartOpen } = useCart();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-4 py-2 flex items-center justify-around md:hidden shadow-lg">
      <button
        onClick={onScrollToTop}
        className="flex flex-col items-center gap-0.5 text-zinc-800 hover:text-amber-600 transition"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold">Home</span>
      </button>

      <button
        onClick={onScrollToCategories}
        className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-amber-600 transition"
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-medium">Creams</span>
      </button>

      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-amber-600 transition"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-medium">Search</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-0.5 text-zinc-800 hover:text-amber-600 transition"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-400 text-zinc-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalItemsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold">Bag</span>
      </button>

      <button
        onClick={() => alert("Google Auth and User Profile will be connected in backend phase.")}
        className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-amber-600 transition"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium">Account</span>
      </button>
    </div>
  );
}
