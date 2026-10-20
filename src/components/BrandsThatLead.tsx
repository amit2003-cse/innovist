"use client";

import React from "react";
import { ArrowRight, Sparkles, Shield, Sun, Moon } from "lucide-react";

interface BrandsThatLeadProps {
  onSelectCategory: (category: string) => void;
}

export default function BrandsThatLead({ onSelectCategory }: BrandsThatLeadProps) {
  const collections = [
    {
      id: "barrier",
      brandName: "BARE ANATOMY",
      subName: "FACE BARRIER LAB",
      accent: "from-[#FDF2E9] to-[#FCE8D5]",
      btnBorder: "border-amber-800 text-amber-900",
      icon: Shield,
      tag: "5x Ceramides",
    },
    {
      id: "brightening",
      brandName: "CHEMIST AT PLAY",
      subName: "SKIN CARE GLOW",
      accent: "from-[#F5EEF8] to-[#EBD7F3]",
      btnBorder: "border-purple-800 text-purple-900",
      icon: Sparkles,
      tag: "10% Vitamin C",
    },
    {
      id: "sun-cream",
      brandName: "SUNSCOOP",
      subName: "SUN CARE SPF 50",
      accent: "from-[#FEF9E7] to-[#FDEBD0]",
      btnBorder: "border-yellow-800 text-yellow-900",
      icon: Sun,
      tag: "Zero Cast Cream",
    },
    {
      id: "night-repair",
      brandName: "ANECDOTE",
      subName: "NIGHT RECOVERY",
      accent: "from-[#1E293B] to-[#0F172A]",
      textColor: "text-white",
      btnBorder: "border-zinc-400 text-white bg-zinc-800/80",
      icon: Moon,
      tag: "Retinol Peptides",
    },
  ];

  return (
    <section className="py-4 sm:py-6 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-base sm:text-xl md:text-2xl font-black text-zinc-900 tracking-tight">
          Brands That Lead
        </h2>
        <p className="text-[11px] sm:text-xs text-zinc-500">
          Clinically backed face cream formulations across our signature labs
        </p>
      </div>

      {/* 2x2 grid on mobile, 4 columns on desktop (Matches Innovist Screenshot 2) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {collections.map((item) => {
          const Icon = item.icon;
          const isDark = !!item.textColor;
          return (
            <div
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-gradient-to-br ${item.accent} ${
                isDark ? "text-white" : "text-zinc-900"
              } shadow-2xs hover:shadow-md transition-all duration-300 border border-zinc-200/60 flex flex-col justify-between h-32 sm:h-40 relative overflow-hidden`}
            >
              <div className="absolute right-2 top-2 opacity-15 group-hover:opacity-30 transition-opacity">
                <Icon className="w-10 h-10 sm:w-14 sm:h-14" />
              </div>

              <div>
                <span
                  className={`inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full mb-1 ${
                    isDark
                      ? "bg-zinc-800 text-zinc-300 border border-zinc-700"
                      : "bg-white/80 text-zinc-700 border border-zinc-200"
                  }`}
                >
                  {item.tag}
                </span>

                <h3 className="font-black text-xs sm:text-sm md:text-base tracking-tight leading-tight uppercase">
                  {item.brandName}
                </h3>
                <p
                  className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase mt-0.5 truncate ${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {item.subName}
                </p>
              </div>

              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold ${
                    isDark ? "text-zinc-200" : "text-zinc-900"
                  }`}
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
