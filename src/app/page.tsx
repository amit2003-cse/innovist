"use client";

import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryConcernFilter from "@/components/CategoryConcernFilter";
import BestSellersSection from "@/components/BestSellersSection";
import BrandsThatLead from "@/components/BrandsThatLead";
import SelfCareShelf from "@/components/SelfCareShelf";
import IngredientsSection from "@/components/IngredientsSection";
import JournalSection from "@/components/JournalSection";
import FooterAccordion from "@/components/FooterAccordion";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import ProductDetailModal from "@/components/ProductDetailModal";
import Toast from "@/components/Toast";
import MobileBottomNav from "@/components/MobileBottomNav";
import { FACE_CREAMS, FaceCream } from "@/data/faceCreams";

export default function Home() {
  const [filterMode, setFilterMode] = useState<"category" | "concern">("category");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedConcern, setSelectedConcern] = useState<string>("Dry & Damaged Barrier");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<FaceCream | null>(null);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFilterMode("category");
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleConcernSelect = (concernId: string) => {
    setSelectedConcern(concernId);
    setFilterMode("concern");
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToCategories = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToBestSellers = () => {
    if (bestSellersRef.current) {
      bestSellersRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtered products list for when user uses category/concern filters
  const displayedFilteredCreams =
    filterMode === "category"
      ? selectedCategory === "all"
        ? FACE_CREAMS
        : FACE_CREAMS.filter((p) => p.category === selectedCategory)
      : FACE_CREAMS.filter((p) => p.concern === selectedConcern);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] selection:bg-amber-200 selection:text-amber-900 pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">
      {/* 1. Header with Fraud Banner, Logo, Search Trigger, Cart */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={handleCategorySelect}
      />

      {/* 2. Hero Carousel Banner: Festive Glow Face Cream Edit */}
      <HeroBanner
        onShopNow={scrollToBestSellers}
        onOpenQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 3. Category & Concern Segmented Filter */}
      <div ref={categoriesRef}>
        <CategoryConcernFilter
          mode={filterMode}
          setMode={setFilterMode}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          selectedConcern={selectedConcern}
          onSelectConcern={handleConcernSelect}
        />
      </div>

      {/* 4. Best Sellers Section */}
      <div ref={bestSellersRef}>
        <BestSellersSection
          products={displayedFilteredCreams}
          onQuickView={(p) => setQuickViewProduct(p)}
          onViewAll={() => handleCategorySelect("all")}
        />
      </div>

      {/* 5. Brands / Formulations That Lead */}
      <BrandsThatLead onSelectCategory={handleCategorySelect} />

      {/* 6. The Self-Care Face Cream Shelf */}
      <SelfCareShelf
        products={FACE_CREAMS}
        onQuickView={(p) => setQuickViewProduct(p)}
        onViewAll={() => handleCategorySelect("all")}
      />

      {/* 7. Backed by the Right Ingredients */}
      <IngredientsSection />

      {/* 8. Skincare Journal Section */}
      <JournalSection />

      {/* 9. App Download & Comprehensive Accordion Footer */}
      <FooterAccordion />

      {/* 10. Interactive Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* 11. Interactive Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 12. Product Quick View & Detailed Routine Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* 13. Toast Notification Pill */}
      <Toast />

      {/* 14. Mobile Bottom App Navigation */}
      <MobileBottomNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onScrollToTop={scrollToTop}
        onScrollToCategories={scrollToCategories}
      />
    </div>
  );
}
