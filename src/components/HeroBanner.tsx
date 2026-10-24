"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import FaceCreamJar from "./FaceCreamJar";
import { FACE_CREAMS, FaceCream } from "@/data/faceCreams";

interface HeroBannerProps {
  onShopNow: () => void;
  onOpenQuickView: (product: FaceCream) => void;
}

export default function HeroBanner({ onShopNow, onOpenQuickView }: HeroBannerProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "5 Steps to Festive Glow",
      subtitle: "The Face Cream Edit: 72H Barrier Repair & Vitamin C Radiance",
      tag: "Dermatologist Approved",
      cta: "SHOP NOW",
      bgGradient: "from-[#F3E8FF] via-[#FCE7F3] to-[#FEF3C7]",
      highlightProducts: [
        FACE_CREAMS[0], // Ceramide Barrier Cream
        FACE_CREAMS[1], // 10% Vitamin C Cream
        FACE_CREAMS[2], // Hyaluronic Hydra Gel
      ],
    },
    {
      title: "Zero White Cast. 100% Glow.",
      subtitle: "SPF 50 PA++++ Invisible Hydrating Day Face Cream",
      tag: "Sunscreen + Face Cream",
      cta: "EXPLORE SPF CREAMS",
      bgGradient: "from-[#FEF3C7] via-[#FFF7ED] to-[#FFEDD5]",
      highlightProducts: [
        FACE_CREAMS[6], // SPF 50 Day Cream
        FACE_CREAMS[1], // Vitamin C Glow Cream
        FACE_CREAMS[0], // Ceramide Cream
      ],
    },
    {
      title: "Wake Up To Glass Skin",
      subtitle: "Multi-Peptide & Retinol Night Recovery Soufflé",
      tag: "Overnight Transformation",
      cta: "DISCOVER NIGHT CREAMS",
      bgGradient: "from-[#EDE9FE] via-[#E0E7FF] to-[#DBEAFE]",
      highlightProducts: [
        FACE_CREAMS[4], // Retinol Peptide
        FACE_CREAMS[7], // Rice Water Niacinamide
        FACE_CREAMS[2], // Hyalu Hydra
      ],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[activeSlide];

  return (
    <section className="relative w-full max-w-full overflow-hidden transition-all duration-700">
      <div
        className={`w-full max-w-full bg-gradient-to-b md:bg-gradient-to-r ${slide.bgGradient} py-5 sm:py-8 md:py-12 px-3 sm:px-6 lg:px-8 border-b border-zinc-200/60`}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
          {/* Visual Showcase (Staged Podium matching Screenshot 1) */}
          <div className="w-full md:flex-1 flex flex-col items-center justify-center order-1 md:order-2">
            <div className="relative w-full max-w-xs sm:max-w-sm flex items-center justify-center pt-2 pb-4">
              {/* Center Podium Base */}
              <div className="relative flex items-center justify-center gap-1 sm:gap-2">
                {slide.highlightProducts.map((p, idx) => {
                  const isCenter = idx === 1 || (slide.highlightProducts.length === 2 && idx === 0);
                  return (
                    <div
                      key={p.id}
                      onClick={() => onOpenQuickView(p)}
                      className={`group cursor-pointer transition-all duration-300 transform ${
                        isCenter
                          ? "z-20 scale-105"
                          : "z-10 scale-90 opacity-95"
                      }`}
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-md border border-white hover:border-amber-300 transition-all flex flex-col items-center">
                        <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 mb-1 max-w-[90px] truncate">
                          {p.tag || "Pure Cream"}
                        </span>
                        <FaceCreamJar product={p} size={isCenter ? "md" : "sm"} />
                        <p className="text-[11px] sm:text-xs font-bold text-zinc-900 mt-1 text-center max-w-[85px] sm:max-w-[110px] truncate">
                          {p.shortName}
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-black text-amber-700">
                          ₹{p.price}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Text & Call to Action (Centered on mobile like Screenshot 1) */}
          <div className="w-full md:flex-1 text-center md:text-left space-y-2.5 sm:space-y-4 max-w-xl order-2 md:order-1 px-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-zinc-200/80 shadow-xs text-[11px] sm:text-xs font-bold text-zinc-800">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
              {slide.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed max-w-md mx-auto md:mx-0">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2.5">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto px-7 py-2.5 sm:py-3 bg-zinc-950 text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase rounded-full hover:bg-zinc-800 transition shadow-md flex items-center justify-center gap-2 group"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="px-3 py-1.5 rounded-full bg-white/80 border border-zinc-200 text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>FLAT 20% OFF Applied</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 sm:h-2 transition-all rounded-full ${
                activeSlide === i ? "w-6 sm:w-7 bg-zinc-900" : "w-1.5 sm:w-2 bg-zinc-400/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
