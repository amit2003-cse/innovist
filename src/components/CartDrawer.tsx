"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import FaceCreamJar from "./FaceCreamJar";
import {
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Percent,
  ArrowRight,
  Check
} from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    amountNeededForFreeShipping,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput) {
      applyCoupon(couponInput);
      setCouponInput("");
    }
  };

  const handleCheckout = () => {
    alert(
      `Proceeding to Razorpay Payment Gateway...\n\nOrder Total: ₹${total}\nItems: ${items.length}\n\nRazorpay and MongoDB integration will be linked in backend setup!`
    );
  };

  const progressPercentage = Math.min(
    100,
    Math.round(((subtotal - discountAmount) / freeShippingThreshold) * 100)
  );

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Semi-transparent Dark Backdrop (Clicking here immediately closes the drawer) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity cursor-pointer"
        onClick={() => setIsCartOpen(false)}
        aria-label="Close cart backdrop"
      />

      {/* Drawer Panel: w-[88%] on mobile with left space exposed, max-w-[400px] on desktop */}
      <div className="relative w-[88%] sm:w-[390px] max-w-[420px] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
        {/* 1. Header (Matches Innovist Screenshot 1: "< Your Shopping Bag (0)") */}
        <div className="h-12 px-3 border-b border-zinc-200 flex items-center bg-white shrink-0">
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Back to store"
            className="flex items-center gap-1 text-zinc-900 hover:text-black font-bold text-xs sm:text-sm tracking-tight group"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-800 group-hover:-translate-x-0.5 transition-transform" />
            <span>Your Shopping Bag ({totalItemsCount})</span>
          </button>
        </div>

        {/* 2. Top Banner (Matches Innovist Screenshot 1: "Pay Online & Get Up To 125 OFF") */}
        <div className="bg-[#46403B] text-white py-2 px-3 text-center text-[10px] sm:text-xs font-bold tracking-wider uppercase shrink-0">
          Pay Online & Get Up To 125 OFF
        </div>

        {/* Free Shipping Progress Indicator (if items in cart) */}
        {items.length > 0 && (
          <div className="p-3 bg-amber-50/80 border-b border-amber-200/60 text-xs shrink-0">
            {amountNeededForFreeShipping === 0 ? (
              <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                🎉 Congratulations! You unlocked <strong>FREE Shipping</strong>!
              </p>
            ) : (
              <p className="font-semibold text-amber-950">
                Add <strong className="text-zinc-900">₹{amountNeededForFreeShipping}</strong> more to unlock <strong>FREE Shipping</strong>!
              </p>
            )}
            <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* 3. Empty State (Exact Match to Innovist Screenshot 1) */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
            {/* Minimalist Sad Cart Illustration */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-5">
              {/* Asymmetrical soft gray blob backdrop matching Screenshot 1 */}
              <div className="absolute w-36 h-32 bg-[#F1F2F4] rounded-[52%_48%_65%_35%/48%_52%_48%_52%]" />

              {/* Floating decorative sparkles (+, -, dots) */}
              <span className="absolute top-8 left-11 text-zinc-400 font-mono text-sm select-none">+</span>
              <span className="absolute top-5 right-12 text-zinc-400 font-mono text-sm select-none">-</span>
              <span className="absolute top-14 right-7 text-zinc-400 font-mono text-xs select-none">✦</span>
              <span className="absolute bottom-11 left-9 text-zinc-400 font-mono text-xs select-none">+</span>
              <span className="absolute bottom-8 right-14 text-zinc-400 text-xs select-none">•</span>

              {/* SVG Cart with Sad Expression matching Screenshot 1 */}
              <svg
                viewBox="0 0 160 160"
                className="w-32 h-32 relative z-10 drop-shadow-2xs"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Cart Handle */}
                <path
                  d="M 26 52 L 40 52 L 56 106 L 118 106"
                  stroke="#27272A"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Cart Body Trapezoid */}
                <polygon
                  points="44,55 128,55 118,102 54,102"
                  fill="#FFFFFF"
                  stroke="#27272A"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />

                {/* Sad Face: Left Eye */}
                <circle cx="75" cy="74" r="1.6" fill="#27272A" />

                {/* Sad Face: Right Eye */}
                <circle cx="97" cy="74" r="1.6" fill="#27272A" />

                {/* Sad Face: Drooping Mouth */}
                <path
                  d="M 80 88 Q 86 81 92 88"
                  stroke="#27272A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Cart Wheels */}
                <circle
                  cx="64"
                  cy="118"
                  r="6"
                  stroke="#27272A"
                  strokeWidth="2.4"
                  fill="#FFFFFF"
                />
                <circle
                  cx="112"
                  cy="118"
                  r="6"
                  stroke="#27272A"
                  strokeWidth="2.4"
                  fill="#FFFFFF"
                />
              </svg>
            </div>

            {/* Heading (Matches Screenshot 1) */}
            <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
              Oops! Your cart is empty!
            </h3>

            {/* Subtitle (Matches Screenshot 1) */}
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-1 max-w-[210px] leading-relaxed">
              There is nothing in your cart lets add some items.
            </p>

            {/* Solid Black Pill Button (Matches Screenshot 1: "Shop Now") */}
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-5 px-9 py-2.5 rounded-full bg-black text-white text-xs sm:text-sm font-bold tracking-wide hover:bg-zinc-800 transition transform active:scale-95 shadow-sm"
            >
              Shop Now
            </button>
          </div>
        ) : (
          /* Item List When Products are in Bag */
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-2.5 p-2 rounded-2xl border border-zinc-200 bg-white shadow-2xs"
              >
                {/* Product Visual */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-b ${product.accentColor} flex items-center justify-center shrink-0`}
                >
                  <FaceCreamJar product={product} size="sm" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-[11px] text-zinc-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500">{product.size}</p>

                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xs font-black text-zinc-900">
                      ₹{product.price * quantity}
                    </span>
                    <span className="text-[9px] text-zinc-400 line-through">
                      ₹{product.originalPrice * quantity}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-zinc-100 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-5 h-5 rounded-lg bg-white text-zinc-800 flex items-center justify-center hover:bg-zinc-200 transition shadow-2xs"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="text-[11px] font-bold px-1">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-5 h-5 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center hover:bg-amber-500 transition shadow-2xs"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(product.id)}
                  aria-label="Remove item"
                  className="p-1 text-zinc-400 hover:text-rose-600 transition shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer / Summary (When Items Exist) */}
        {items.length > 0 && (
          <div className="p-3 border-t border-zinc-200 bg-zinc-50 space-y-2.5 shrink-0">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px]">
                  <div className="flex items-center gap-1 text-emerald-800 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon}</strong> Applied (20% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[10px] font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (FLAT20)"
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-xl border border-zinc-300 focus:outline-none uppercase bg-white font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1 text-xs text-zinc-600 border-t border-zinc-200 pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>FLAT20 Savings</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700 uppercase font-bold">FREE</strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm font-black text-zinc-900 pt-1 border-t border-zinc-200">
                <span>Total Amount</span>
                <span className="text-sm sm:text-base text-zinc-950 font-black">₹{total}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-2.5 px-4 rounded-full bg-black hover:bg-zinc-800 text-white font-extrabold text-xs tracking-wide transition shadow-md flex items-center justify-center gap-1.5 transform active:scale-98"
            >
              <span>Proceed To Pay ₹{total}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-[9px] text-center text-zinc-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Secure 256-bit encrypted Razorpay payment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
