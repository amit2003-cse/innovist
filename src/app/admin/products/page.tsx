"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FACE_CREAMS, FaceCream } from "@/data/faceCreams";
import FaceCreamJar from "@/components/FaceCreamJar";
import {
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Droplet,
  Percent,
  Search
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(FACE_CREAMS);
  const [stockStatus, setStockStatus] = useState<Record<string, boolean>>(
    FACE_CREAMS.reduce((acc, p) => ({ ...acc, [p.id]: true }), {})
  );
  const [search, setSearch] = useState("");

  const toggleStock = (id: string) => {
    setStockStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.concern.toLowerCase().includes(search.toLowerCase()) ||
      (p.keyIngredientSummary && p.keyIngredientSummary.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Face Creams Catalog & Inventory
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Dermatologically backed barrier face creams catalog, inventory stock levels & pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300">
            Total Products: <strong>{products.length}</strong>
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-[#151922] border border-zinc-800 rounded-3xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search face creams by name, actives (Ceramides, Retinol, Vit C), or concern..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((p) => {
          const inStock = stockStatus[p.id] !== false;
          return (
            <div
              key={p.id}
              className="bg-[#151922] border border-zinc-800 rounded-3xl p-4 space-y-3.5 flex flex-col justify-between hover:border-zinc-700 transition"
            >
              <div className="space-y-3">
                {/* Top Jar & Badges */}
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                    <FaceCreamJar product={p} size="sm" />
                  </div>

                  <div className="text-right space-y-1">
                    <button
                      onClick={() => toggleStock(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                        inStock
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-400"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-emerald-500/10 hover:text-emerald-400"
                      }`}
                    >
                      {inStock ? "● In Stock" : "○ Out of Stock"}
                    </button>
                    <p className="text-[10px] font-mono text-zinc-500">{p.size}</p>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-extrabold text-sm text-white leading-tight">{p.name}</h3>
                  <p className="text-[11px] text-amber-400 font-semibold mt-0.5">{p.concern}</p>
                  <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">
                    {p.keyIngredientSummary || p.subtitle}
                  </p>
                </div>

                {/* Pricing & Rating */}
                <div className="flex items-baseline justify-between pt-2 border-t border-zinc-800 text-xs">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-white text-base">₹{p.price}</span>
                    <span className="text-[11px] text-zinc-500 line-through">₹{p.originalPrice}</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    ★ {p.rating}
                  </span>
                </div>
              </div>

              {/* View on Storefront Link */}
              <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
                <span className="text-[10px] text-zinc-500 font-mono">ID: {p.id}</span>
                <Link
                  href={`/products/${p.id}`}
                  target="_blank"
                  className="text-zinc-400 hover:text-white flex items-center gap-1 font-semibold text-[11px] transition"
                >
                  <span>Preview Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
