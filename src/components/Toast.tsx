"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2 } from "lucide-react";

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-950 text-white shadow-2xl border border-zinc-800 text-xs font-semibold animate-slide-up">
      <div className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5" />
      </div>
      <span>{toastMessage}</span>
    </div>
  );
}
