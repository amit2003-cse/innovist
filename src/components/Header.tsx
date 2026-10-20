"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import UserAvatar from "@/components/UserAvatar";
import {
  Menu,
  X,
  Search,
  User,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Package,
} from "lucide-react";

interface HeaderProps {
  onOpenSearch: () => void;
  onSelectCategory?: (catId: string) => void;
}

export default function Header({ onOpenSearch, onSelectCategory }: HeaderProps) {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { user, logout, setIsAuthModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // 1. Top Announcement Bar - changes every 3 seconds (Website Only)
  const announcements = [
    {
      id: "offer-35",
      text: "Unlock upto 35% OFF on orders > ₹849. Shop Now!",
      hasIcon: false,
    },
    {
      id: "fraud-alert",
      text: "Beware of Fraud Calls: Pay Only Via Our Official Website",
      hasIcon: true,
    },
    {
      id: "coupon-20",
      text: "FLAT 20% OFF on All Face Creams | Code: FLAT20",
      hasIcon: false,
    },
    {
      id: "free-shipping",
      text: "Free Express Shipping On All Orders Above ₹499",
      hasIcon: false,
    },
  ];

  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
        setIsFading(false);
      }, 300);
    }, 3000);

    return () => clearInterval(timer);
  }, [announcements.length]);

  // 2. Typewriter search phrases
  const searchPhrases = [
    "Search For Face Cream...",
    "Search For Ceramide Barrier...",
    "Search For 10% Vitamin C...",
    "Search For Hydra Water Gel...",
    "Search For SPF 50 Day Cream...",
    "Search For Retinol Night Cream...",
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = searchPhrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentPlaceholder.length < fullText.length) {
        timeout = setTimeout(() => {
          setCurrentPlaceholder(fullText.slice(0, currentPlaceholder.length + 1));
        }, 85);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (currentPlaceholder.length > 0) {
        timeout = setTimeout(() => {
          setCurrentPlaceholder(fullText.slice(0, currentPlaceholder.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % searchPhrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentPlaceholder, isDeleting, phraseIndex]);

  const menuCategories = [
    { id: "all", name: "All Face Creams", icon: "✨" },
    { id: "barrier", name: "Ceramide Barrier Creams", icon: "🛡️" },
    { id: "brightening", name: "Vitamin C Radiance Creams", icon: "🍊" },
    { id: "hydra", name: "Hydra Water Burst Gels", icon: "💧" },
    { id: "anti-acne", name: "Salicylic Blemish Creams", icon: "🌿" },
    { id: "night-repair", name: "Peptide & Retinol Night Creams", icon: "🌙" },
    { id: "sun-cream", name: "SPF 50 Day Face Creams", icon: "☀️" },
  ];

  const currentAnnouncement = announcements[announcementIndex];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111827] text-white shadow-md">
      {/* 1. Top Notice Announcement Bar */}
      <div className="bg-[#FFF4E5] border-b border-[#FEE2C3] px-2 py-1.5 text-center text-[11px] sm:text-xs font-semibold text-[#8C3A00] flex items-center justify-center gap-1.5 w-full h-8 overflow-hidden select-none">
        <div
          className={`flex items-center justify-center gap-1.5 truncate transition-all duration-300 transform ${
            isFading ? "opacity-0 -translate-y-1.5" : "opacity-100 translate-y-0"
          }`}
        >
          {currentAnnouncement.hasIcon && (
            <ShieldCheck className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
          )}
          <span className="truncate tracking-wide">
            {currentAnnouncement.text}
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Left: Hamburger + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-1.5 text-zinc-300 hover:text-white transition"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Brand Logo */}
            <a href="#" className="flex items-center">
              <span className="font-extrabold text-base sm:text-xl tracking-[0.18em] text-white uppercase">
                INNOVIST
              </span>
            </a>
          </div>

          {/* Center: Search Bar Trigger with Dynamic Typewriter Effect */}
          <div className="flex-1 min-w-0 max-w-md mx-1 sm:mx-3">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center gap-2 px-3 py-1.5 sm:py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-700/80 rounded-xl sm:rounded-full text-xs transition-all shadow-inner group overflow-hidden"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 shrink-0 transition-colors" />
              <div className="truncate flex items-center text-[11px] sm:text-xs text-zinc-300 font-normal">
                <span>{currentPlaceholder}</span>
                <span className="inline-block w-[2px] h-3 bg-amber-400 ml-0.5 animate-pulse" />
              </div>
            </button>
          </div>

          {/* Right: User Icon & Cart Bag Icon */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* User Account / Profile */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                aria-label="Account options"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 text-zinc-300 hover:text-white transition flex items-center justify-center text-xs overflow-hidden"
              >
                {user ? (
                  <UserAvatar user={user} className="w-full h-full rounded-xl" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-zinc-900 rounded-2xl shadow-xl border border-zinc-100 p-4 z-50 text-xs">
                  {user ? (
                    <>
                      <div className="pb-3 border-b border-zinc-100 mb-3 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                          <UserAvatar user={user} className="w-full h-full rounded-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-zinc-900 truncate">{user.name}</p>
                          <p className="text-zinc-500 text-[10px] truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-zinc-700 pt-1">
                        <div className="py-1.5 px-2 rounded-lg hover:bg-zinc-50 cursor-pointer flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Package className="w-3.5 h-3.5 text-zinc-400" />
                            My Orders
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setAccountMenuOpen(false);
                          }}
                          className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center justify-between transition"
                        >
                          <span className="flex items-center gap-2">
                            <LogOut className="w-3.5 h-3.5 text-rose-500" />
                            Sign Out
                          </span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pb-3 border-b border-zinc-100 mb-3">
                        <p className="font-bold text-sm text-zinc-900">Welcome to Innovist</p>
                        <p className="text-zinc-500 text-[11px] mt-0.5">
                          Sign in with Google to save orders & routines
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full py-2.5 px-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition text-center mb-2 flex items-center justify-center gap-2 shadow-xs"
                      >
                        <span>Sign In with Google</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag / Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping cart"
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 text-zinc-300 hover:text-white transition flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-zinc-950 text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Quick Category Subnav */}
        <div className="hidden lg:flex items-center gap-6 py-2 border-t border-zinc-800 text-xs font-medium text-zinc-400 overflow-x-auto no-scrollbar">
          {menuCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className="flex items-center gap-1.5 whitespace-nowrap hover:text-amber-400 transition"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white text-zinc-900 h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <span className="font-extrabold text-lg tracking-[0.2em] text-zinc-900">
                INNOVIST
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase mb-3">
                Face Cream Categories
              </p>
              <div className="space-y-1">
                {menuCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 text-zinc-800 text-xs font-semibold transition text-left"
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-zinc-100 space-y-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> FLAT 20% OFF
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Use code <strong>FLAT20</strong> during checkout.
                </p>
              </div>

              {user ? (
                <div className="p-2.5 bg-zinc-100 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-800 truncate">{user.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-rose-600"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
