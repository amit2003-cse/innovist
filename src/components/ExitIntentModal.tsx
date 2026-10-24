"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import FaceCreamJar from "./FaceCreamJar";
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Percent,
  Clock,
  Gift
} from "lucide-react";

export default function ExitIntentModal() {
  const { items, applyCoupon, setIsCartOpen, total, subtotal } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when cursor approaches top edge to close tab
      if (e.clientY <= 15) {
        try {
          const shown = sessionStorage.getItem("innovist_exit_modal_shown");
          if (!shown && items.length > 0) {
            sessionStorage.setItem("innovist_exit_modal_shown", "true");
            setIsOpen(true);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [mounted, items.length]);

  if (!isOpen || items.length === 0) return null;

  const handleClaimDiscount = () => {
    applyCoupon("EXTRA50");
    setIsOpen(false);
    setIsCartOpen(true);
  };

  const firstItem = items[0]?.product;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden text-zinc-900 text-center animate-scale-up">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-5 text-zinc-950 relative">
          <div className="w-13 h-13 mx-auto rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-amber-600 mb-2">
            <Gift className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/15 text-zinc-950 text-xs font-black uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Wait! Before You Go</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Here&apos;s an Instant ₹50 Gift!
          </h3>
          <p className="text-xs text-amber-950 font-medium mt-1 max-w-xs mx-auto">
            Don&apos;t leave your healthy skin routine behind. Complete your order now and save an extra ₹50.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4">
          {/* Cart Preview Item */}
          {firstItem && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-left">
              <div className="w-12 h-12 bg-white rounded-xl p-1 border border-zinc-100 shrink-0 flex items-center justify-center">
                <FaceCreamJar product={firstItem} size="sm" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-xs text-zinc-900 truncate">
                  {firstItem.name}
                </p>
                <p className="text-[10px] text-zinc-500">
                  {items.length} item(s) currently reserved in your bag
                </p>
              </div>
              <span className="font-black text-sm text-zinc-950 shrink-0">
                ₹{total}
              </span>
            </div>
          )}

          {/* Coupon Code Pill */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 border-dashed flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Exclusive Recovery Voucher
              </span>
              <span className="font-mono text-base font-black text-zinc-900">
                EXTRA50
              </span>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-zinc-950 text-xs font-black uppercase shadow-2xs">
              FLAT ₹50 OFF
            </span>
          </div>

          {/* CTA Button */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleClaimDiscount}
              className="w-full py-3 px-4 rounded-full bg-zinc-950 hover:bg-black text-[#FFCC00] font-black text-xs sm:text-sm tracking-wide transition shadow-md flex items-center justify-center gap-2 transform active:scale-98"
            >
              <span>Apply ₹50 &amp; Checkout Now</span>
              <ArrowRight className="w-4 h-4 text-[#FFCC00]" />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600 font-medium py-1"
            >
              No thanks, I&apos;ll pay full price later
            </button>
          </div>
        </div>

        {/* Bottom Trust Line */}
        <div className="py-2.5 px-4 bg-zinc-50 border-t border-zinc-100 text-[10px] text-zinc-500 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Guaranteed Safe Checkout &bull; Free Returns &bull; 100% Genuine</span>
        </div>
      </div>
    </div>
  );
}
