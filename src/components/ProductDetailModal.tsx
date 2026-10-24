"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaceCream } from "@/data/faceCreams";
import { useCart } from "@/context/CartContext";
import FaceCreamJar from "./FaceCreamJar";
import TrustBadges from "./TrustBadges";
import {
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Droplet,
  Sun,
  Moon,
  Sparkles,
  Percent,
  Check,
  CheckCircle2,
  MapPin,
  Truck,
  Leaf,
  HeartHandshake,
  Award,
  FlaskConical,
  Zap,
  ShoppingBag
} from "lucide-react";

interface ProductDetailModalProps {
  product: FaceCream | null;
  onClose: () => void;
  onSelectProduct?: (product: FaceCream) => void;
  allProducts?: FaceCream[];
}

export default function ProductDetailModal({
  product,
  onClose,
  onSelectProduct,
  allProducts = [],
}: ProductDetailModalProps) {
  const { addToCart, items, setIsCartOpen } = useCart();

  // Active slide inside product image showcase (0: Main Jar, 1: Texture & Swatch, 2: Key Botanicals)
  const [activeSlide, setActiveSlide] = useState(0);

  // Variant Selection: 0: Standard, 1: Pack of 2, 2: Pack of 3
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Pincode state
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "valid" | "invalid">("idle");

  // Content tab: "description" | "why" | "journey"
  const [mainTab, setMainTab] = useState<"description" | "why" | "journey">("description");

  // Subtab: "love" | "suitable"
  const [benefitSubTab, setBenefitSubTab] = useState<"love" | "suitable">("love");

  // Reset internal states when product changes
  useEffect(() => {
    setActiveSlide(0);
    setSelectedVariant(0);
    setPincodeStatus("idle");
  }, [product?.id]);

  if (!product) return null;

  // Find index of current product in allProducts for "slide to next product"
  const currentIndex = allProducts.findIndex((p) => p.id === product.id);
  const hasPrevProduct = currentIndex > 0;
  const hasNextProduct = currentIndex < allProducts.length - 1;

  const goToPrevProduct = () => {
    if (hasPrevProduct && onSelectProduct) {
      onSelectProduct(allProducts[currentIndex - 1]);
    }
  };

  const goToNextProduct = () => {
    if (hasNextProduct && onSelectProduct) {
      onSelectProduct(allProducts[currentIndex + 1]);
    }
  };

  // Variants calculations
  const variants = [
    {
      title: "50 ml (Standard)",
      unitPrice: `₹${(product.price / 50).toFixed(1)}/ml`,
      price: product.price,
      mrp: product.originalPrice,
      discount: `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off`,
      isPopular: true,
    },
    {
      title: "Pack of 2 | 100 ml",
      unitPrice: `₹${((product.price * 1.75) / 100).toFixed(1)}/ml`,
      price: Math.round(product.price * 1.75),
      mrp: product.originalPrice * 2,
      discount: "35% off",
      isPopular: false,
    },
    {
      title: "Pack of 3 | 150 ml",
      unitPrice: `₹${((product.price * 2.45) / 150).toFixed(1)}/ml`,
      price: Math.round(product.price * 2.45),
      mrp: product.originalPrice * 3,
      discount: "45% off",
      isPopular: false,
    },
  ];

  const currentVariant = variants[selectedVariant];
  const inCart = items.some((item) => item.product.id === product.id);

  const handleAddAndOpenCart = () => {
    addToCart(product);
    setIsCartOpen(true);
    onClose();
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setPincodeStatus("valid");
    } else {
      setPincodeStatus("invalid");
    }
  };

  // Image Slides
  const slidesCount = 3;
  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slidesCount - 1 : prev - 1));
  };
  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === slidesCount - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white sm:rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-zinc-100 relative my-auto h-full sm:h-auto sm:max-h-[92vh] flex flex-col">
        {/* Top Header Controls (Previous Product, Close, Next Product) */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
          {/* Switch to Previous Product */}
          {allProducts.length > 0 ? (
            <button
              onClick={goToPrevProduct}
              disabled={!hasPrevProduct}
              aria-label="Previous Product"
              className={`p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-zinc-800 transition pointer-events-auto flex items-center gap-1 text-xs font-bold ${
                hasPrevProduct ? "hover:bg-white hover:scale-105 active:scale-95" : "opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline pr-1">Prev</span>
            </button>
          ) : (
            <div />
          )}

          {/* Close & Next Button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {allProducts.length > 0 && (
              <button
                onClick={goToNextProduct}
                disabled={!hasNextProduct}
                aria-label="Next Product"
                className={`p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-zinc-800 transition flex items-center gap-1 text-xs font-bold ${
                  hasNextProduct ? "hover:bg-white hover:scale-105 active:scale-95" : "opacity-30 cursor-not-allowed"
                }`}
              >
                <span className="hidden sm:inline pl-1">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-zinc-800 hover:bg-zinc-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pb-24">
          {/* 1. PRODUCT IMAGE SLIDER (Matches Innovist Screenshot 3) */}
          <div className="relative w-full bg-gradient-to-b from-[#F7F4EB] via-[#F4EFE6] to-[#FAF8F5] pt-12 pb-6 px-4 flex flex-col items-center justify-center overflow-hidden">
            {/* Tag / Best Seller Badge */}
            {product.tag && (
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-black text-white px-2.5 py-1 rounded-full bg-rose-600 shadow-xs tracking-wider uppercase">
                  {product.tag}
                </span>
              </div>
            )}

            {/* Slide Arrows `<` and `>` */}
            <button
              onClick={handlePrevSlide}
              aria-label="Previous image"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-md flex items-center justify-center transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-md flex items-center justify-center transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Content */}
            <div className="w-full flex items-center justify-center min-h-[220px] transition-all duration-300">
              {activeSlide === 0 && (
                <div className="transform transition-transform animate-fade-in flex flex-col items-center">
                  <FaceCreamJar product={product} size="lg" />
                </div>
              )}
              {activeSlide === 1 && (
                <div className="flex flex-col items-center justify-center text-center p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-amber-200/60 max-w-[260px] animate-fade-in shadow-xs">
                  <Droplet className="w-10 h-10 text-amber-500 mb-2 animate-bounce" />
                  <h4 className="font-bold text-sm text-zinc-900">{product.texture}</h4>
                  <p className="text-zinc-600 text-xs mt-1 leading-relaxed">
                    Lightweight whipped formula that melts on contact and seals moisture for 72 hours.
                  </p>
                </div>
              )}
              {activeSlide === 2 && (
                <div className="flex flex-col items-center justify-center text-center p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-emerald-200/60 max-w-[260px] animate-fade-in shadow-xs">
                  <ShieldCheck className="w-10 h-10 text-emerald-600 mb-2" />
                  <h4 className="font-bold text-sm text-zinc-900">Clinical Formulation</h4>
                  <p className="text-zinc-600 text-xs mt-1 leading-relaxed">
                    {product.keyIngredientSummary}
                  </p>
                </div>
              )}
            </div>

            {/* Units Sold & Review Pill (Matches Innovist Screenshot 1 Exactly) */}
            <div className="w-full flex items-center justify-between text-xs px-3.5 py-2.5 bg-[#2B2B2B] text-white font-bold rounded-b-2xl mt-4">
              <span className="text-xs text-white font-bold tracking-wide">
                464038+ units sold
              </span>
              <div className="flex items-center gap-1.5 text-xs bg-white text-zinc-900 px-2.5 py-0.5 rounded-full font-bold shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                <span className="text-emerald-700 font-extrabold">{product.rating}</span>
                <span className="text-zinc-300">|</span>
                <span className="text-zinc-600 font-medium">{product.reviewsCount}</span>
              </div>
            </div>
          </div>

          {/* 2. PRODUCT TITLE & PRICING (Matches Innovist Screenshot 3) */}
          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight leading-snug">
                {product.name}
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                {product.subtitle}
              </p>

              {/* Benefit Pills */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {product.benefits.slice(0, 2).map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] font-semibold"
                  >
                    <span>✦</span>
                    <span>{b}</span>
                  </span>
                ))}
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-2.5 mt-3">
                <span className="text-2xl font-black text-zinc-950">
                  ₹{currentVariant.price}.00
                </span>
                <span className="text-sm text-zinc-400 line-through">
                  ₹{currentVariant.mrp}.00
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Save ₹{currentVariant.mrp - currentVariant.price}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">MRP Inclusive of All Taxes.</p>

              {/* Coupon Bar */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-full">
                <Percent className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Get it for ₹{product.flatOfferPrice} with code FLAT20</span>
              </div>

              {/* Secure Payment Badges (Matches Innovist Screenshot 3) */}
              <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="font-semibold text-zinc-700">Secure Payment</span>
                <div className="flex items-center gap-1.5 font-bold text-[10px] text-zinc-600">
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200">UPI</span>
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200">RuPay</span>
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200">Mastercard</span>
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200">VISA</span>
                </div>
              </div>
            </div>

            {/* 3. SELECT VARIANT (Matches Innovist Screenshot 3) */}
            <div>
              <h3 className="text-xs font-bold text-zinc-900 mb-2">Select Variant</h3>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-2 -mt-2">
                {variants.map((v, i) => {
                  const isSelected = selectedVariant === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(i)}
                      className={`relative min-w-[155px] p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between shrink-0 ${
                        isSelected
                          ? "border-[#E53935] bg-white shadow-2xs"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      {v.isPopular && (
                        <span className="absolute -top-2 left-2 text-[9px] font-black uppercase tracking-wide bg-[#E53935] text-white px-2 py-0.5 rounded-full shadow-2xs">
                          Most Popular
                        </span>
                      )}
                      <div>
                        <p className="font-bold text-xs text-zinc-900 leading-tight">
                          {v.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{v.unitPrice}</p>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between gap-1">
                        <span className="font-black text-sm text-zinc-900">₹{v.price}</span>
                        <span className="text-[11px] text-zinc-400 line-through">₹{v.mrp}</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                          {v.discount}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. ENTER PINCODE CHECK (Matches Innovist Screenshot 4) */}
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    if (pincodeStatus !== "idle") setPincodeStatus("idle");
                  }}
                  placeholder="Enter Delivery Pincode"
                  className="w-full bg-transparent text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition shrink-0"
                >
                  Check
                </button>
              </form>

              {pincodeStatus === "valid" && (
                <div className="mt-2 pt-2 border-t border-zinc-200/60 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Delivery to {pincode} by tomorrow, 5:00 PM • Free Express Shipping</span>
                </div>
              )}
              {pincodeStatus === "invalid" && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">
                  Please enter a valid 6-digit Indian delivery pincode.
                </p>
              )}
            </div>

            {/* 5. TABS: Description | Why choose this? | Product journey (Matches Screenshot 4) */}
            <div className="pt-2">
              <div className="flex gap-2 border-b border-zinc-100 pb-2">
                <button
                  onClick={() => setMainTab("description")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    mainTab === "description"
                      ? "bg-zinc-900 text-white shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setMainTab("why")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    mainTab === "why"
                      ? "bg-zinc-900 text-white shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  Why choose this?
                </button>
                <button
                  onClick={() => setMainTab("journey")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    mainTab === "journey"
                      ? "bg-zinc-900 text-white shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  Product journey
                </button>
              </div>

              <div className="pt-3 text-xs text-zinc-700 leading-relaxed">
                {mainTab === "description" && (
                  <p>
                    {product.name} is a clinically formulated, science-backed barrier moisturizer engineered to hydrate, restore compromised lipids, and reinforce your skin mantle. Powered by {product.keyIngredientSummary}, this lightweight whipped formula absorbs deeply without leaving oily residue.
                  </p>
                )}
                {mainTab === "why" && (
                  <p>
                    Unlike ordinary cosmetic moisturizers that only sit on the surface, our formula works at the cellular lipid level to replenish ceramides and fatty acids, locking in moisture for a full 72 hours.
                  </p>
                )}
                {mainTab === "journey" && (
                  <p>
                    Formulated in state-of-the-art dermatological laboratories using high-purity bioactive extracts, cold-pressed oat lipids, and stabilized antioxidants tested on Indian skin under extreme weather conditions.
                  </p>
                )}
              </div>
            </div>

            {/* 6. SUB-TABS: Why You'll Love It vs Suitable For (Matches Screenshot 4) */}
            <div className="pt-2">
              <div className="flex border-b border-zinc-200">
                <button
                  onClick={() => setBenefitSubTab("love")}
                  className={`flex-1 pb-2 text-center text-xs font-extrabold border-b-2 transition ${
                    benefitSubTab === "love"
                      ? "border-zinc-900 text-zinc-900"
                      : "border-transparent text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  Why You&apos;ll Love It
                </button>
                <button
                  onClick={() => setBenefitSubTab("suitable")}
                  className={`flex-1 pb-2 text-center text-xs font-extrabold border-b-2 transition ${
                    benefitSubTab === "suitable"
                      ? "border-zinc-900 text-zinc-900"
                      : "border-transparent text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  Suitable For
                </button>
              </div>

              <div className="pt-3 space-y-2">
                {benefitSubTab === "love" ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-zinc-900">Brightens Dull & Tired Skin</p>
                        <p className="text-[11px] text-zinc-500">Revives dull skin for radiant, healthier-looking complexion.</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-zinc-900">Restores Skin Barrier Integrity</p>
                        <p className="text-[11px] text-zinc-500">Repairs compromised lipid layers caused by sun, pollution & active treatments.</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-zinc-900">Effortless Everyday Wear</p>
                        <p className="text-[11px] text-zinc-500">Fast-absorbing, non-greasy texture layers comfortably under SPF or makeup.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-zinc-900">All Skin Types</p>
                        <p className="text-[11px] text-zinc-500">{product.skinType}</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-zinc-900">Primary Skin Concern</p>
                        <p className="text-[11px] text-zinc-500">Formulated specifically for {product.concern}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 7. KEY INGREDIENTS (Matches Innovist Screenshot 1) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-zinc-950 uppercase tracking-wider">
                  Key Ingredients
                </h3>
                <Link
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-800 transition"
                >
                  View Full Product Page →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Vitamin C */}
                <div className="p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 text-2xl shadow-inner">
                    🍊
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-zinc-900">Vitamin C</h4>
                    <p className="text-[10px] text-zinc-600 leading-tight mt-0.5 line-clamp-2">
                      Fades dark spots, visible pigmentation, and enhances radiance.
                    </p>
                  </div>
                </div>

                {/* 2. 2% Acetyl Glucosamine */}
                <div className="p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-200 to-blue-300 flex items-center justify-center shrink-0 text-2xl shadow-inner">
                    ⚗️
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-zinc-900">2% Acetyl Glucosamine</h4>
                    <p className="text-[10px] text-zinc-600 leading-tight mt-0.5 line-clamp-2">
                      Targets stubborn discoloration and accelerates cell renewal.
                    </p>
                  </div>
                </div>

                {/* 3. Sodium Hyaluronate */}
                <div className="p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center shrink-0 text-2xl shadow-inner">
                    💧
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-zinc-900">Sodium Hyaluronate</h4>
                    <p className="text-[10px] text-zinc-600 leading-tight mt-0.5 line-clamp-2">
                      Deep moisture-binding hydrator that keeps skin plump.
                    </p>
                  </div>
                </div>

                {/* 4. Lactic Acid */}
                <div className="p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center shrink-0 text-2xl shadow-inner">
                    🌿
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-zinc-900">Lactic Acid</h4>
                    <p className="text-[10px] text-zinc-600 leading-tight mt-0.5 line-clamp-2">
                      Gently removes dead skin cells and improves overall texture.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. HOW TO USE (Matches Innovist Screenshot 5) */}
            <div className="pt-2">
              <h3 className="text-xs font-black text-zinc-950 uppercase tracking-wider mb-2.5">
                How to Use
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-amber-100 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex flex-col items-center justify-center shrink-0 font-black text-xs">
                    <span className="text-[9px] uppercase tracking-wider">STEP</span>
                    <span className="text-base leading-none">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Cleanse</h4>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      Start with a clean face using a gentle, hydrating face cleanser. Pat dry.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-amber-100 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex flex-col items-center justify-center shrink-0 font-black text-xs">
                    <span className="text-[9px] uppercase tracking-wider">STEP</span>
                    <span className="text-base leading-none">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Apply</h4>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      Take a coin-sized amount of cream onto your fingertips. Dot across forehead, cheeks, and chin.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-amber-100 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex flex-col items-center justify-center shrink-0 font-black text-xs">
                    <span className="text-[9px] uppercase tracking-wider">STEP</span>
                    <span className="text-base leading-none">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Massage</h4>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      Gently massage in upward circular motions until completely absorbed. Follow with SPF in AM.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. THE NO-NASTIES CHECKLIST (Matches Innovist Screenshot 5) */}
            <div className="pt-2">
              <h3 className="text-xs font-black text-zinc-950 uppercase tracking-wider mb-2.5">
                The No-Nasties Checklist
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { title: "Sulphate Free", icon: "⚗️", bg: "bg-amber-50/70" },
                  { title: "Paraben Free", icon: "🌿", bg: "bg-emerald-50/70" },
                  { title: "Derma-Tested", icon: "🔬", bg: "bg-blue-50/70" },
                  { title: "Cruelty Free", icon: "🐰", bg: "bg-rose-50/70" },
                  { title: "Phthalate Free", icon: "🧪", bg: "bg-purple-50/70" },
                  { title: "Alcohol Free", icon: "💧", bg: "bg-cyan-50/70" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-2xl ${item.bg} border border-zinc-200/60 flex flex-col items-center text-center`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white shadow-2xs flex items-center justify-center text-sm mb-1">
                      {item.icon}
                    </div>
                    <span className="font-bold text-[10px] text-zinc-800 leading-tight">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Reversal Guarantee Badges (CRO Feature 6) */}
            <div className="pt-2">
              <TrustBadges variant="full" />
            </div>
          </div>
        </div>

        {/* 10. FULL-WIDTH STICKY YELLOW ADD TO CART BUTTON (Matches Image 1 Exactly) */}
        <div className="sticky bottom-0 left-0 right-0 p-3 bg-white border-t border-zinc-200 z-50 shadow-lg space-y-2">
          <button
            onClick={handleAddAndOpenCart}
            className="w-full py-3.5 px-6 rounded-xl bg-[#FFCC00] hover:bg-[#EBB800] text-zinc-950 font-black text-sm tracking-wide uppercase transition flex items-center justify-center gap-2 shadow-xs active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{inCart ? "In Bag • Add Another" : "Add to Cart"}</span>
          </button>
          <TrustBadges variant="strip" />
        </div>
      </div>
    </div>
  );
}
