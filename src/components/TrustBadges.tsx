"use client";

import React from "react";
import { ShieldCheck, Truck, RefreshCw } from "lucide-react";

interface TrustBadgesProps {
  variant?: "full" | "compact" | "strip";
  className?: string;
}

export default function TrustBadges({ variant = "full", className = "" }: TrustBadgesProps) {
  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-3 gap-1.5 pt-2 border-t border-zinc-100 text-[10px] text-zinc-600 ${className}`}>
        <div className="flex items-center gap-1 text-center justify-center p-1 rounded-lg bg-zinc-50 border border-zinc-100">
          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="font-semibold truncate">100% Genuine</span>
        </div>
        <div className="flex items-center gap-1 text-center justify-center p-1 rounded-lg bg-zinc-50 border border-zinc-100">
          <Truck className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="font-semibold truncate">Safe Transit</span>
        </div>
        <div className="flex items-center gap-1 text-center justify-center p-1 rounded-lg bg-zinc-50 border border-zinc-100">
          <RefreshCw className="w-3 h-3 text-blue-600 shrink-0" />
          <span className="font-semibold truncate">7-Day Return</span>
        </div>
      </div>
    );
  }

  if (variant === "strip") {
    return (
      <div className={`flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-50 border border-zinc-200/80 text-[10.5px] text-zinc-700 ${className}`}>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-bold">100% Clinical Actives</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-bold">Zero-Damage Insured</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="font-bold">7-Day Replacement</span>
        </div>
      </div>
    );
  }

  // Full Rich Variant (PDP & Cart)
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-zinc-50/90 border border-zinc-200 text-xs ${className}`}>
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="font-extrabold text-[11px] text-zinc-900 leading-tight">100% Genuine Actives</p>
          <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">Dermatologically tested & certified</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <Truck className="w-4 h-4" />
        </div>
        <div>
          <p className="font-extrabold text-[11px] text-zinc-900 leading-tight">Zero-Damage Insurance</p>
          <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">Safe packaging & tamper-proof seal</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <RefreshCw className="w-4 h-4" />
        </div>
        <div>
          <p className="font-extrabold text-[11px] text-zinc-900 leading-tight">7-Day Replacement</p>
          <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">Instant doorstep exchange guarantee</p>
        </div>
      </div>
    </div>
  );
}
