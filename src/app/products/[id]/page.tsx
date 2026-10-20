"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { FACE_CREAMS, FaceCream } from "@/data/faceCreams";
import { useCart } from "@/context/CartContext";
import FaceCreamJar from "@/components/FaceCreamJar";
import Header from "@/components/Header";
import FooterAccordion from "@/components/FooterAccordion";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";
import MobileBottomNav from "@/components/MobileBottomNav";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Droplet,
  Percent,
  Check,
  CheckCircle2,
  Truck,
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
  Filter,
  ArrowUpDown,
  ThumbsUp,
  Camera
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const unwrappedParams = use(params);
  const { addToCart, items, setIsCartOpen } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Find product by id or slug
  const product =
    FACE_CREAMS.find(
      (p) =>
        p.id === unwrappedParams.id ||
        p.id.toLowerCase().includes(unwrappedParams.id.toLowerCase())
    ) || FACE_CREAMS[0];

  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [mainTab, setMainTab] = useState<"description" | "why" | "journey">("description");
  const [benefitSubTab, setBenefitSubTab] = useState<"love" | "suitable">("love");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  // Index navigation for Prev / Next product
  const currentIndex = FACE_CREAMS.findIndex((p) => p.id === product.id);
  const prevProduct = currentIndex > 0 ? FACE_CREAMS[currentIndex - 1] : null;
  const nextProduct = currentIndex < FACE_CREAMS.length - 1 ? FACE_CREAMS[currentIndex + 1] : null;

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
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setPincodeStatus("valid");
    } else {
      setPincodeStatus("invalid");
    }
  };

  // FAQ Items matching Screenshot 4
  const faqs = [
    {
      q: `What does the ${product.name} do?`,
      a: `${product.name} is formulated with high-potency bio-actives to repair compromised moisture barriers, diminish pigmentation, and lock in hydration for up to 72 hours. It balances epidermal moisture without clogging pores.`,
    },
    {
      q: "Is this formula suitable for beginners?",
      a: "Yes, absolutely! The formula is buffered with soothing colloidal oat and skin-identical ceramides, making it safe for first-time active ingredient users and sensitive skin types.",
    },
    {
      q: "Can I use this cream every day?",
      a: "Yes. For maximum barrier strength and brightening results, apply twice daily—in your morning routine before sunscreen, and in your nighttime routine as the final sealing step.",
    },
    {
      q: "How does this formulation reduce hyperpigmentation?",
      a: "It inhibits tyrosinase activity and blocks melanin transfer to outer skin cells using stabilized antioxidants and acetyl glucosamine, visibly fading dark spots and sun damage within 14 to 28 days.",
    },
    {
      q: "What are the scientific mechanisms behind its benefits?",
      a: "It incorporates a physiological 3:1:1:1 lipid ratio (Ceramides, Cholesterol, Free Fatty Acids) that integrates directly into the stratum corneum, restoring structural matrix lipids and halting transepidermal water loss (TEWL).",
    },
    {
      q: "Will this help with dark spots and post-acne blemishes?",
      a: "Yes, clinically proven to fade post-inflammatory hyperpigmentation (PIH) and even out skin tone while strengthening the barrier against future breakouts.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] selection:bg-amber-200 selection:text-amber-900 pb-28 md:pb-24">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 flex-1 space-y-8 sm:space-y-12">
        {/* Navigation Breadcrumb / Product Slide Navigation */}
        <div className="flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-600 hover:text-black font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </Link>

          {/* Slide Between Products */}
          <div className="flex items-center gap-2">
            {prevProduct && (
              <Link
                href={`/products/${prevProduct.id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400 font-bold transition shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev: {prevProduct.shortName}</span>
                <span className="sm:hidden">Prev</span>
              </Link>
            )}
            {nextProduct && (
              <Link
                href={`/products/${nextProduct.id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400 font-bold transition shadow-2xs"
              >
                <span className="hidden sm:inline">Next: {nextProduct.shortName}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* 1. PRODUCT SHOWCASE CARD (Top Half) */}
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: Product Visual Slider */}
          <div className="lg:col-span-6 relative w-full bg-gradient-to-b from-[#F7F4EB] via-[#F4EFE6] to-[#FAF8F5] pt-12 pb-8 px-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-100">
            {product.tag && (
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-black text-white px-2.5 py-1 rounded-full bg-rose-600 shadow-xs tracking-wider uppercase">
                  {product.tag}
                </span>
              </div>
            )}

            {/* Slide Arrows `<` and `>` */}
            <button
              onClick={() => setActiveSlide((prev) => (prev === 0 ? 2 : prev - 1))}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-md flex items-center justify-center transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev === 2 ? 0 : prev + 1))}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-md flex items-center justify-center transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Content */}
            <div className="w-full flex items-center justify-center min-h-[280px] sm:min-h-[340px]">
              {activeSlide === 0 && (
                <div className="animate-fade-in flex flex-col items-center">
                  <FaceCreamJar product={product} size="lg" />
                </div>
              )}
              {activeSlide === 1 && (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-white/85 backdrop-blur-xs rounded-2xl border border-amber-200/60 max-w-xs animate-fade-in shadow-xs">
                  <Droplet className="w-12 h-12 text-amber-500 mb-2 animate-bounce" />
                  <h4 className="font-bold text-base text-zinc-900">{product.texture}</h4>
                  <p className="text-zinc-600 text-xs mt-1.5 leading-relaxed">
                    Lightweight whipped texture that melts into skin and seals moisture for 72 hours.
                  </p>
                </div>
              )}
              {activeSlide === 2 && (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-white/85 backdrop-blur-xs rounded-2xl border border-emerald-200/60 max-w-xs animate-fade-in shadow-xs">
                  <ShieldCheck className="w-12 h-12 text-emerald-600 mb-2" />
                  <h4 className="font-bold text-base text-zinc-900">Clinical Formulation</h4>
                  <p className="text-zinc-600 text-xs mt-1.5 leading-relaxed">
                    {product.keyIngredientSummary}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 mt-3 z-10">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeSlide === idx ? "w-6 bg-zinc-900" : "w-1.5 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Units Sold & Reviews Banner (Matches Innovist Screenshot 3) */}
            <div className="mt-5 w-full max-w-md flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-zinc-900 text-white font-bold shadow-xs">
              <span className="text-[11px] text-zinc-200 font-medium tracking-wide">
                464038+ units sold
              </span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-amber-400 font-bold">{product.rating}</span>
                <span className="text-zinc-400">|</span>
                <span className="text-zinc-300 font-normal">{product.reviewsCount}</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details, Pricing, Variants, Pincode */}
          <div className="lg:col-span-6 p-5 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 tracking-tight leading-snug">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                {product.subtitle}
              </p>

              {/* Benefit Pills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {product.benefits.slice(0, 2).map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold"
                  >
                    <span>✦</span>
                    <span>{b}</span>
                  </span>
                ))}
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-black text-zinc-950">
                  ₹{currentVariant.price}.00
                </span>
                <span className="text-base text-zinc-400 line-through">
                  ₹{currentVariant.mrp}.00
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Save ₹{currentVariant.mrp - currentVariant.price}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">MRP Inclusive of All Taxes.</p>

              {/* Special Coupon Bar */}
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 w-full">
                <Percent className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Get it for ₹{product.flatOfferPrice} with coupon code FLAT20</span>
              </div>

              {/* Payment Methods */}
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <span className="font-semibold text-zinc-700">Secure Payment</span>
                <div className="flex items-center gap-1.5 font-bold text-[10px] text-zinc-600">
                  <span className="px-2 py-0.5 bg-zinc-100 rounded border border-zinc-200">UPI</span>
                  <span className="px-2 py-0.5 bg-zinc-100 rounded border border-zinc-200">RuPay</span>
                  <span className="px-2 py-0.5 bg-zinc-100 rounded border border-zinc-200">Mastercard</span>
                  <span className="px-2 py-0.5 bg-zinc-100 rounded border border-zinc-200">VISA</span>
                </div>
              </div>
            </div>

            {/* Select Variant */}
            <div>
              <h3 className="text-xs font-bold text-zinc-900 mb-2.5">Select Variant</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {variants.map((v, i) => {
                  const isSelected = selectedVariant === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(i)}
                      className={`relative p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-amber-600 bg-amber-50/50 shadow-2xs"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      {v.isPopular && (
                        <span className="absolute -top-2 left-2 text-[9px] font-black uppercase tracking-wide bg-rose-600 text-white px-2 py-0.5 rounded shadow-2xs">
                          Most Popular
                        </span>
                      )}
                      <div>
                        <p className="font-bold text-xs text-zinc-900 leading-tight">
                          {v.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{v.unitPrice}</p>
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="font-extrabold text-sm text-zinc-900">₹{v.price}</span>
                        <span className="text-[10px] text-zinc-400 line-through">₹{v.mrp}</span>
                        <span className="text-[10px] font-bold text-emerald-600 ml-auto">
                          {v.discount}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pincode Check */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
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
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition shrink-0"
                >
                  Check
                </button>
              </form>

              {pincodeStatus === "valid" && (
                <div className="mt-2 pt-2 border-t border-zinc-200/60 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Delivery to {pincode} by tomorrow, 5:00 PM • Free Express Shipping</span>
                </div>
              )}
              {pincodeStatus === "invalid" && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  Please enter a valid 6-digit Indian delivery pincode.
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddAndOpenCart}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#FFCC00] hover:bg-[#EBB800] text-zinc-950 font-black text-sm tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-sm active:scale-98"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{inCart ? "Add Another & Go to Bag" : "Add to Cart"}</span>
            </button>
          </div>
        </div>

        {/* 2. KEY INGREDIENTS SECTION (Matches Innovist Screenshot 1) */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
            Key Ingredients
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Vitamin C */}
            <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center overflow-hidden mb-4 relative shadow-inner">
                  {/* Decorative Citrus Slice Graphic */}
                  <div className="w-28 h-28 rounded-full border-4 border-amber-100/80 flex items-center justify-center bg-orange-400/90 shadow-md">
                    <div className="w-20 h-20 rounded-full border-2 border-amber-200/60 flex items-center justify-center text-3xl">
                      🍊
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-amber-900">
                    Active
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-zinc-900">Vitamin C</h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  A stable, highly effective form of Vitamin C that helps reduce dark spots, pigmentation, tanning, and uneven skin tone while enhancing radiance, improving skin clarity, and revealing a brighter, even-looking complexion.
                </p>
              </div>
            </div>

            {/* Card 2: 2% Acetyl Glucosamine */}
            <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-cyan-100 via-sky-200 to-blue-200 flex items-center justify-center overflow-hidden mb-4 relative shadow-inner">
                  {/* Crystal / Powder Graphic */}
                  <div className="w-28 h-28 rounded-full border-4 border-white/80 flex items-center justify-center bg-sky-300/80 shadow-md">
                    <div className="w-20 h-20 rounded-full border-2 border-white/60 flex items-center justify-center text-3xl">
                      ⚗️
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-sky-900">
                    2% Pure
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-zinc-900">2% Acetyl Glucosamine</h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  Works synergistically with Vitamin C to help target stubborn pigmentation and visible discoloration. It supports gentle skin renewal, improves uneven skin tone, and enhances the formula&apos;s brightening benefits.
                </p>
              </div>
            </div>

            {/* Card 3: Sodium Hyaluronate */}
            <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-200 to-sky-300 flex items-center justify-center overflow-hidden mb-4 relative shadow-inner">
                  {/* Molecular Spheres Graphic */}
                  <div className="w-28 h-28 rounded-full border-4 border-white/80 flex items-center justify-center bg-blue-300/80 shadow-md">
                    <div className="w-20 h-20 rounded-full border-2 border-white/60 flex items-center justify-center text-3xl">
                      💧
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-blue-900">
                    5D Hydra
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-zinc-900">Sodium Hyaluronate</h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  A moisture-binding ingredient that helps attract and retain hydration within the skin, leaving it looking plump, smooth, and comfortable without greasiness.
                </p>
              </div>
            </div>

            {/* Card 4: Lactic Acid */}
            <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-200 to-green-300 flex items-center justify-center overflow-hidden mb-4 relative shadow-inner">
                  {/* Droplets Graphic */}
                  <div className="w-28 h-28 rounded-full border-4 border-white/80 flex items-center justify-center bg-teal-300/80 shadow-md">
                    <div className="w-20 h-20 rounded-full border-2 border-white/60 flex items-center justify-center text-3xl">
                      🌿
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-teal-900">
                    Bio-AHA
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-zinc-900">Lactic Acid</h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  A gentle exfoliating acid that helps remove dead skin cell buildup from the skin&apos;s surface, improving texture and allowing brighter, fresher-looking skin to surface.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW TO USE SECTION (Matches Innovist Screenshot 2) */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
            How to Use
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col items-center text-center">
              <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden mb-4 relative shadow-inner">
                <div className="w-24 h-24 rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-4xl">
                  🧴
                </div>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-1">
                STEP 1
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-xs">
                Start with a clean face using a brightening face wash.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col items-center text-center">
              <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden mb-4 relative shadow-inner">
                <div className="w-24 h-24 rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-4xl">
                  💧
                </div>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-1">
                STEP 2
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-xs">
                Use the dropper to apply a few drops of the serum onto your face and neck.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col items-center text-center">
              <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center overflow-hidden mb-4 relative shadow-inner">
                <div className="w-24 h-24 rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-4xl">
                  ✨
                </div>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-1">
                STEP 3
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-xs">
                Gently pat and massage the serum into your skin until fully absorbed.
              </p>
            </div>
          </div>
        </section>

        {/* 4. CUSTOMER REVIEWS SECTION (Matches Innovist Screenshot 3) */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Rating Breakdown Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-black text-zinc-950">4.9</span>
                  <div className="flex text-amber-400 text-lg">
                    {"★★★★★"}
                  </div>
                </div>

                {/* Rating Bars */}
                <div className="space-y-2 mt-4">
                  {[
                    { stars: 5, count: 506, pct: "92%" },
                    { stars: 4, count: 53, pct: "10%" },
                    { stars: 3, count: 11, pct: "3%" },
                    { stars: 2, count: 0, pct: "0%" },
                    { stars: 1, count: 0, pct: "0%" },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3 text-xs text-zinc-600">
                      <span className="w-3 font-bold text-right">{row.stars}</span>
                      <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: row.pct }}
                        />
                      </div>
                      <span className="w-8 text-right font-medium text-zinc-400">{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-700">All Reviews (570)</span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition">
                    + Add Review
                  </button>
                  <button className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600">
                    <Filter className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Badges (Amazon, Flipkart, Myntra, Nykaa) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Amazon */}
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition">
                  <div className="w-16 h-16 rounded-full bg-white shadow-2xs border border-zinc-200 flex items-center justify-center font-black text-xl text-zinc-900 mb-2">
                    a
                  </div>
                  <span className="font-extrabold text-xs text-zinc-900">4.0 Out of 5</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Amazon Verified</span>
                </div>

                {/* Flipkart */}
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition">
                  <div className="w-16 h-16 rounded-full bg-[#FFE11B] shadow-2xs border border-amber-300 flex items-center justify-center font-black text-xl text-blue-700 mb-2">
                    🛍️
                  </div>
                  <span className="font-extrabold text-xs text-zinc-900">4.0 Out of 5</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Flipkart Rating</span>
                </div>

                {/* Myntra */}
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 shadow-2xs text-white flex items-center justify-center font-black text-2xl mb-2">
                    M
                  </div>
                  <span className="font-extrabold text-xs text-zinc-900">4.7 Out of 5</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Myntra Top Pick</span>
                </div>

                {/* Nykaa */}
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition">
                  <div className="w-16 h-16 rounded-full bg-[#FC2779] shadow-2xs text-white flex items-center justify-center font-black text-xs uppercase tracking-tighter mb-2">
                    NYKAA
                  </div>
                  <span className="font-extrabold text-xs text-zinc-900">4.1 Out of 5</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Nykaa Beauty</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Review Photo Gallery (Matches Screenshot 3) */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 shrink-0 border border-zinc-200/80 shadow-2xs flex flex-col items-center justify-center text-2xl relative overflow-hidden group cursor-pointer"
              >
                <span>✨</span>
                <span className="absolute bottom-1 right-1 text-[9px] font-bold px-1 rounded bg-black/60 text-white">
                  📸
                </span>
              </div>
            ))}
            <div className="w-24 h-20 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shrink-0 flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-amber-100 transition shadow-2xs">
              View All
            </div>
          </div>

          {/* Real Reviews Cards (Matches Screenshot 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-zinc-900 flex items-center gap-1">
                    Merija . <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white" />
                  </span>
                  <span className="text-zinc-400 text-[10px]">08/11/26</span>
                </div>
                <div className="text-amber-400 text-xs mb-2">{"★★★★★"}</div>
                <h4 className="font-extrabold text-sm text-zinc-900 mb-1">
                  Gives a natural glow & refreshed skin!
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  &ldquo;Really loved using this formula! It feels lightweight, non-sticky, and gives a very natural glow within a few days of daily use.&rdquo;
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-zinc-900 flex items-center gap-1">
                    Sumaya ume hani <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white" />
                  </span>
                  <span className="text-zinc-400 text-[10px]">08/06/26</span>
                </div>
                <div className="text-amber-400 text-xs mb-2">{"★★★★★"}</div>
                <h4 className="font-extrabold text-sm text-zinc-900 mb-1">
                  Excellent Serum for Healthy, Glowing Skin
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  &ldquo;Great cream with a lightweight texture that absorbs quickly. It leaves my skin feeling soft, hydrated, and noticeably brighter.&rdquo;
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-zinc-900 flex items-center gap-1">
                    Akshi <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white" />
                  </span>
                  <span className="text-zinc-400 text-[10px]">08/17/26</span>
                </div>
                <div className="text-amber-400 text-xs mb-2">{"★★★★★"}</div>
                <h4 className="font-extrabold text-sm text-zinc-900 mb-1">
                  Innovist vit C serum
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  &ldquo;I&apos;ve been using it regularly, and I can honestly say that it actually works! Not exactly overnight, but definitely visible difference.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FREQUENTLY ASKED QUESTIONS (Matches Innovist Screenshot 4) */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(showAllFaqs ? faqs : faqs.slice(0, 4)).map((faq, i) => {
              const isOpen = activeFaq === i;
              const pastelBgs = [
                "bg-rose-50/50 hover:bg-rose-50",
                "bg-emerald-50/50 hover:bg-emerald-50",
                "bg-amber-50/50 hover:bg-amber-50",
                "bg-purple-50/50 hover:bg-purple-50",
                "bg-sky-50/50 hover:bg-sky-50",
                "bg-orange-50/50 hover:bg-orange-50",
              ];
              const bg = pastelBgs[i % pastelBgs.length];

              return (
                <div
                  key={i}
                  className={`rounded-2xl border border-zinc-200/70 p-4 transition-all duration-200 cursor-pointer ${bg}`}
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-xs sm:text-sm text-zinc-900 leading-snug">
                      {faq.q}
                    </h3>
                    <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {isOpen && (
                    <p className="mt-3 text-xs text-zinc-600 leading-relaxed pt-2 border-t border-zinc-200/60 animate-fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setShowAllFaqs(!showAllFaqs)}
              className="text-xs font-bold text-zinc-900 hover:text-amber-700 transition"
            >
              {showAllFaqs ? "Read Less ↑" : "Read More ↓"}
            </button>
          </div>
        </section>
      </main>

      {/* 6. STICKY DESKTOP & MOBILE BOTTOM BAR (Matches Innovist Screenshot 4) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-zinc-200 z-40 flex items-center justify-center shadow-lg">
        <div className="w-full max-w-6xl flex items-center justify-between gap-4 px-3 sm:px-6">
          {/* Left: Thumbnail & Title (Desktop & Mobile) */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 border border-amber-200/80 p-1 shrink-0 flex items-center justify-center">
              <FaceCreamJar product={product} size="sm" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-zinc-950 truncate">
                {product.name}
              </h4>
              <p className="text-[10px] sm:text-xs text-zinc-500 truncate">
                {currentVariant.title} • ₹{currentVariant.price}
              </p>
            </div>
          </div>

          {/* Right: Signature Yellow Add to Cart Button */}
          <button
            onClick={handleAddAndOpenCart}
            className="py-3 px-6 sm:px-12 rounded-xl bg-[#FFCC00] hover:bg-[#EBB800] text-zinc-950 font-black text-xs sm:text-sm tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-sm shrink-0 active:scale-98"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{inCart ? "In Bag (Add Another)" : "Add to Cart"}</span>
          </button>
        </div>
      </div>

      <FooterAccordion />
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
      <Toast />
      <MobileBottomNav onOpenSearch={() => setIsSearchOpen(true)} />
    </div>
  );
}
