"use client";

import React from "react";
import { INGREDIENT_HIGHLIGHTS } from "@/data/faceCreams";
import { Microscope, CheckCircle2 } from "lucide-react";

export default function IngredientsSection() {
  return (
    <section className="py-4 sm:py-6 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Microscope className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-zinc-900 tracking-tight">
            Backed by the Right Ingredients
          </h2>
        </div>
        <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
          Pure bio-actives formulated at optimal skin pH levels
        </p>
      </div>

      {/* 2 columns on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {INGREDIENT_HIGHLIGHTS.map((ing, idx) => (
          <div
            key={idx}
            className={`rounded-2xl sm:rounded-3xl p-3 sm:p-5 border shadow-2xs transition-all duration-300 hover:shadow-md flex flex-col justify-between ${ing.color} bg-opacity-70`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl sm:text-3xl">{ing.icon}</span>
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/80 border border-zinc-200 text-zinc-800">
                  Clinical
                </span>
              </div>

              <h3 className="font-black text-xs sm:text-base text-zinc-900 tracking-tight leading-tight">
                {ing.name}
              </h3>
              <p className="text-[10px] sm:text-xs font-bold text-zinc-700 mt-0.5">
                {ing.role}
              </p>

              <p className="text-[10px] sm:text-xs text-zinc-600 mt-1.5 leading-relaxed line-clamp-3">
                {ing.desc}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-zinc-800">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Clean
              </span>
              <span className="text-zinc-500 text-[9px] sm:text-[10px]">Dermat-Tested</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
