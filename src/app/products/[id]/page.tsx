"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FACE_CREAMS, FaceCream } from "@/data/faceCreams";
import { useCart } from "@/context/CartContext";
import FaceCreamJar from "@/components/FaceCreamJar";
import Header from "@/components/Header";
import FooterAccordion from "@/components/FooterAccordion";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";
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
  Search,
  Filter,
  ArrowUpDown
} from "lucide-react";

function ProductDetailContent() {
  const routeParams = useParams();
  const productId = (routeParams?.id as string) || "";
  const { addToCart, items, setIsCartOpen } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Find product by id or slug
  const product =
    FACE_CREAMS.find(
      (p) =>
        p.id === productId ||
        p.id.toLowerCase().includes(productId.toLowerCase())
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
      q: "Is this Vitamin C formula suitable for beginners?",
      a: "Yes, absolutely! The formula is buffered with soothing colloidal oat and skin-identical ceramides, making it safe for first-time active ingredient users and sensitive skin types.",
    },
    {
      q: "Can I use this cream every day?",
      a: "Yes. For maximum barrier strength and brightening results, apply twice daily—in your morning routine before sunscreen, and in your nighttime routine as the final sealing step.",
    },
    {
      q: "How does this formula reduce hyperpigmentation?",
      a: "It inhibits tyrosinase activity and blocks melanin transfer to outer skin cells using stabilized antioxidants and acetyl glucosamine, visibly fading dark spots and sun damage within 14 to 28 days.",
    },
    {
      q: "What are the scientific mechanisms behind Vitamin C's benefits for the skin?",
      a: "It incorporates stabilized bio-active antioxidants that neutralize free radicals, stimulate collagen synthesis, and accelerate natural epidermal turnover.",
    },
    {
      q: "Will this help with dark spots and hyperpigmentation?",
      a: "Yes, clinically proven to fade post-inflammatory hyperpigmentation (PIH) and even out skin tone while strengthening the barrier against future damage.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] selection:bg-amber-200 selection:text-amber-900 pb-24 md:pb-20">
      {/* 1. Website Header with Auto-Rotating Announcement Bar (Matches Image 1) */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-2 flex-1 space-y-6 sm:space-y-10">
        {/* Navigation Breadcrumb / Product Slide Navigation */}
        <div className="flex items-center justify-between text-xs py-1">
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
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400 font-bold transition shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev: {prevProduct.shortName}</span>
                <span className="sm:hidden">Prev</span>
              </Link>
            )}
            {nextProduct && (
              <Link
                href={`/products/${nextProduct.id}`}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400 font-bold transition shadow-2xs"
              >
                <span className="hidden sm:inline">Next: {nextProduct.shortName}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* 2. PRODUCT SHOWCASE CARD (Matches Innovist Screenshot 1 Exactly) */}
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
          {/* Top Hero Image Showcase */}
          <div className="relative w-full rounded-t-3xl bg-gradient-to-b from-[#F5EFE4] to-[#EBE0D0] pt-6 pb-0 flex flex-col items-center justify-center overflow-hidden">
            {/* Top-Left Red Badge: Best Seller (Matches Image 1) */}
            <div className="absolute top-3 left-3 z-10">
              <span className="text-[11px] font-black text-white px-3 py-1 rounded-full bg-[#E53935] shadow-sm tracking-wider">
                Best Seller
              </span>
            </div>

            {/* Slide Arrows `<` and `>` (Matches Image 1) */}
            <button
              onClick={() => setActiveSlide((prev) => (prev === 0 ? 2 : prev - 1))}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-zinc-800 shadow-md flex items-center justify-center transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev === 2 ? 0 : prev + 1))}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-zinc-800 shadow-md flex items-center justify-center transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom-Right Magnifying Glass Zoom Icon (Matches Image 1) */}
            <button
              aria-label="Zoom image"
              className="absolute right-3 bottom-14 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-md flex items-center justify-center transition border border-zinc-200"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Product Center Visual with Podium (Matches Image 1) */}
            <div className="w-full flex flex-col items-center justify-center min-h-[290px] sm:min-h-[350px] relative">
              <div className="transform transition-transform animate-fade-in flex flex-col items-center">
                <FaceCreamJar product={product} size="lg" />
                {/* Podium Ellipse Shadow */}
                <div className="w-44 h-4 bg-black/10 rounded-full blur-xs mt-1" />
              </div>
            </div>

            {/* Bottom Solid Dark Bar: Units Sold & Review Pill (Matches Image 1 Exactly) */}
            <div className="w-full flex items-center justify-between text-xs px-4 py-2.5 bg-[#2B2B2B] text-white font-bold">
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

          {/* Product Details Section (Matches Image 1 Exactly) */}
          <div className="p-4 sm:p-7 space-y-4">
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-zinc-950 tracking-tight leading-snug">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                {product.subtitle}
              </p>

              {/* Feature Pills (Matches Image 1) */}
              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className="px-3 py-1 rounded-md border border-[#E4D5BC] bg-[#FAF8F5] text-zinc-800 text-xs font-semibold">
                  Reduces Melanin Production by 2.5x
                </span>
                <span className="px-3 py-1 rounded-md border border-[#E4D5BC] bg-[#FAF8F5] text-zinc-800 text-xs font-semibold">
                  Fades Dark Spots & Pigmentation
                </span>
              </div>

              {/* Pricing Row (Matches Image 1 Exactly) */}
              <div className="mt-3.5">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-zinc-950">
                    ₹{currentVariant.price}.00
                  </span>
                  <span className="text-sm text-zinc-400 line-through">
                    ₹{currentVariant.mrp}.00
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">MRP Inclusive of All Taxes.</p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <span className="w-4 h-4 rounded bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">
                    %
                  </span>
                  <span>Save ₹{currentVariant.mrp - currentVariant.price}</span>
                </div>
              </div>

              {/* Secure Payment (Matches Image 1) */}
              <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <span className="font-semibold text-zinc-700">Secure Payment</span>
                <div className="flex items-center gap-1.5 font-bold text-[10px] text-zinc-600">
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200">UPI</span>
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200">RuPay</span>
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200">Mastercard</span>
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200">VISA</span>
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200">Net Banking</span>
                </div>
              </div>
            </div>

            {/* Select Variant (Horizontal Scroll - Matches Image 1) */}
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

            {/* Delivery Pincode Check (Matches Image 1) */}
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
          </div>
        </div>

        {/* 3. KEY INGREDIENTS (Matches Innovist Screenshot 1) */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
            Key Ingredients
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Vitamin C */}
            <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center overflow-hidden mb-4 relative shadow-inner">
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

        {/* 4. HOW TO USE (Matches Innovist Screenshot 2) */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
            How to Use
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* 5. CUSTOMER REVIEWS (Matches Innovist Screenshot 3) */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-black text-zinc-950">4.9</span>
                  <div className="flex text-amber-400 text-lg">
                    {"★★★★★"}
                  </div>
                </div>

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

            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition">
                  <div className="w-16 h-16 rounded-full bg-white shadow-2xs border border-zinc-200 flex items-center justify-center font-black text-xl text-zinc-900 mb-2">
                    a
                  </div>
                  <span className="font-extrabold text-xs text-zinc-900">4.0 Out of 5</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Amazon Verified</span>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition">
                  <div className="w-16 h-16 rounded-full bg-[#FFE11B] shadow-2xs border border-amber-300 flex items-center justify-center font-black text-xl text-blue-700 mb-2">
                    🛍️
                  </div>
                  <span className="font-extrabold text-xs text-zinc-900">4.0 Out of 5</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Flipkart Rating</span>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 shadow-2xs text-white flex items-center justify-center font-black text-2xl mb-2">
                    M
                  </div>
                  <span className="font-extrabold text-xs text-zinc-900">4.7 Out of 5</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Myntra Top Pick</span>
                </div>

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

          {/* User Review Photo Gallery */}
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

          {/* Real Reviews Cards */}
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

        {/* 6. FREQUENTLY ASKED QUESTIONS (Matches Innovist Screenshot 4) */}
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

      {/* 7. FULL-WIDTH STICKY YELLOW ADD TO CART BUTTON (Matches Image 1 Exactly) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-zinc-200 z-50 shadow-lg">
        <div className="w-full max-w-4xl mx-auto">
          <button
            onClick={handleAddAndOpenCart}
            className="w-full py-3.5 px-6 rounded-xl bg-[#FFCC00] hover:bg-[#EBB800] text-zinc-950 font-black text-sm tracking-wide uppercase transition flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{inCart ? "In Bag • Add Another" : "Add to Cart"}</span>
          </button>
        </div>
      </div>

      <FooterAccordion />
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
      <Toast />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
