"use client";

import React from "react";
import { CATEGORIES, CONCERNS } from "@/data/faceCreams";

interface CategoryConcernFilterProps {
  mode: "category" | "concern";
  setMode: (mode: "category" | "concern") => void;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedConcern: string;
  onSelectConcern: (id: string) => void;
}

export default function CategoryConcernFilter({
  mode,
  setMode,
  selectedCategory,
  onSelectCategory,
  selectedConcern,
  onSelectConcern,
}: CategoryConcernFilterProps) {
  return (
    <section className="py-3 sm:py-5 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Segmented Toggle Pills (Exactly like Innovist UI) */}
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <div className="inline-flex p-1 bg-zinc-100 rounded-full border border-zinc-200 shadow-2xs">
          <button
            onClick={() => setMode("category")}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-extrabold tracking-tight transition-all ${
              mode === "category"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Shop By Category
          </button>
          <button
            onClick={() => setMode("concern")}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-extrabold tracking-tight transition-all ${
              mode === "concern"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Shop By Concern
          </button>
        </div>
      </div>

      {/* Horizontal Scroll with top & bottom padding so icons NEVER clip */}
      <div className="w-full overflow-x-auto no-scrollbar pt-3 pb-3 px-1">
        <div className="flex items-start gap-2.5 sm:gap-4 min-w-max px-2 justify-start md:justify-center">
          {mode === "category" ? (
            <>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className="flex flex-col items-center w-[76px] sm:w-[94px] group transition-all text-center shrink-0 focus:outline-none"
                  >
                    <div
                      className={`w-14 h-14 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-xs border transition-all mb-1.5 ${
                        isSelected
                          ? "bg-amber-100/90 border-amber-500 shadow-md ring-2 ring-amber-400/80"
                          : "bg-white border-zinc-200 group-hover:border-zinc-300 group-hover:bg-zinc-50"
                      }`}
                    >
                      <span>{cat.icon}</span>
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-bold tracking-tight transition-colors line-clamp-2 leading-tight px-0.5 ${
                        isSelected ? "text-zinc-950 font-extrabold" : "text-zinc-600 group-hover:text-zinc-900"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </>
          ) : (
            <>
              {CONCERNS.map((con) => {
                const isSelected = selectedConcern === con.id;
                return (
                  <button
                    key={con.id}
                    onClick={() => onSelectConcern(con.id)}
                    className="flex flex-col items-center w-[84px] sm:w-[102px] group transition-all text-center shrink-0 focus:outline-none"
                  >
                    <div
                      className={`w-14 h-14 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-xs border transition-all mb-1.5 ${
                        isSelected
                          ? "bg-purple-100/90 border-purple-500 shadow-md ring-2 ring-purple-400/80"
                          : "bg-white border-zinc-200 group-hover:border-zinc-300 group-hover:bg-zinc-50"
                      }`}
                    >
                      <span>{con.icon}</span>
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-bold tracking-tight transition-colors line-clamp-2 leading-tight px-0.5 ${
                        isSelected ? "text-zinc-950 font-extrabold" : "text-zinc-600 group-hover:text-zinc-900"
                      }`}
                    >
                      {con.name}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
