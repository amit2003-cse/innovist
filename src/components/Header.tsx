"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import UserAvatar from "@/components/UserAvatar";
import { isAdminEmail } from "@/lib/adminAuth";
import {
  Menu,
  X,
  Search,
  User,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  LogOut,
  Package,
  Truck,
  Crown,
  Zap,
  Sun,
  AlertCircle,
  Leaf,
  Wallet,
  Share2,
  Briefcase,
  BookOpen,
  Phone,
  ExternalLink,
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
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = (key: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
            <Link href="/" className="flex items-center">
              <span className="font-extrabold text-base sm:text-xl tracking-[0.18em] text-white uppercase hover:text-amber-400 transition">
                INNOVIST
              </span>
            </Link>
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
                        {isAdminEmail(user.email) && (
                          <Link
                            href="/admin"
                            onClick={() => setAccountMenuOpen(false)}
                            className="py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-between transition border border-amber-200/80 mb-1"
                          >
                            <span className="flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                              Admin Console
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950">
                              Admin
                            </span>
                          </Link>
                        )}
                        <Link
                          href="/orders"
                          onClick={() => setAccountMenuOpen(false)}
                          className="py-1.5 px-2 rounded-lg hover:bg-zinc-50 cursor-pointer flex items-center justify-between transition"
                        >
                          <span className="flex items-center gap-2">
                            <Package className="w-3.5 h-3.5 text-zinc-400" />
                            My Orders
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
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

      {/* Mobile Slide-Over Menu (Exact Innovist Layout) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-[84vw] max-w-[340px] bg-white text-zinc-900 h-full shadow-2xl flex flex-col z-10 overflow-hidden">
            {/* 1. Dark User Header (Matches Screenshot Exactly) */}
            <div className="bg-[#191919] text-white px-4 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User"}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover bg-white shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-white text-zinc-900 font-extrabold text-xl flex items-center justify-center shadow-xs shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white leading-tight">Hi,</p>
                  <p className="text-xs text-zinc-300 font-medium truncate max-w-[170px]">
                    {user ? (user.email || user.name || "+919110904529") : "+919110904529"}
                  </p>
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs text-amber-400 font-bold hover:underline block mt-0.5 text-left"
                    >
                      Log out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="text-xs text-amber-400 font-bold hover:underline block mt-0.5 text-left"
                    >
                      Log in / Register
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-zinc-300 hover:text-white transition rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Menu Navigation List (Scrollable) */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 text-[13px] font-semibold text-zinc-800">
              {/* Track Order */}
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <Truck className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>Track Order</span>
              </Link>

              {/* Best Sellers */}
              <Link
                href="/#bestsellers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <Crown className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>Best Sellers</span>
              </Link>

              {/* New Launches */}
              <Link
                href="/#self-care"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <Zap className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>New Launches</span>
              </Link>

              {/* Hair Care (Accordion) */}
              <div>
                <button
                  onClick={() => toggleSubmenu("hairCare")}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-[18px] h-[18px] text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                      <path d="M7 10c0 4.5 2 7 5 7s5-2.5 5-7" />
                      <path d="M6 14c-1.5 2-2 4-2 7h16c0-3-.5-5-2-7" />
                    </svg>
                    <span>Hair Care</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      expandedMenus["hairCare"] ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenus["hairCare"] && (
                  <div className="bg-zinc-50/80 px-10 py-2 space-y-2 text-xs font-medium text-zinc-600 border-t border-zinc-100">
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">All Hair Care</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Shampoos & Cleansers</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Conditioners</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Hair Masks & Serums</Link>
                  </div>
                )}
              </div>

              {/* Skin Care (Accordion) */}
              <div>
                <button
                  onClick={() => toggleSubmenu("skinCare")}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-[18px] h-[18px] text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="13" r="8" />
                      <path d="M5 9c2-2 5-3 7-3s5 1 7 3" />
                      <circle cx="9" cy="13" r="1" fill="currentColor" />
                      <circle cx="15" cy="13" r="1" fill="currentColor" />
                      <path d="M10 17c.5.5 1.5 1 2 1s1.5-.5 2-1" />
                    </svg>
                    <span>Skin Care</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      expandedMenus["skinCare"] ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenus["skinCare"] && (
                  <div className="bg-zinc-50/80 px-10 py-2 space-y-2 text-xs font-medium text-zinc-600 border-t border-zinc-100">
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Moisturizers & Face Creams</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Vitamin C Brightening Serums</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Ceramide Barrier Care</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Night Repair & Retinol</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Cleansers & Toners</Link>
                  </div>
                )}
              </div>

              {/* Sun Care (Accordion) */}
              <div>
                <button
                  onClick={() => toggleSubmenu("sunCare")}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <Sun className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                    <span>Sun Care</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      expandedMenus["sunCare"] ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenus["sunCare"] && (
                  <div className="bg-zinc-50/80 px-10 py-2 space-y-2 text-xs font-medium text-zinc-600 border-t border-zinc-100">
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Mineral Sunscreen SPF 50</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Dewy Sunscreen Gel</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Ultra Matte Finish Sunscreen</Link>
                  </div>
                )}
              </div>

              {/* Health & Wellness */}
              <Link
                href="/#wellness"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <Zap className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>Health & Wellness</span>
              </Link>

              {/* Concerns (Accordion) */}
              <div>
                <button
                  onClick={() => toggleSubmenu("concerns")}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                    <span>Concerns</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      expandedMenus["concerns"] ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenus["concerns"] && (
                  <div className="bg-zinc-50/80 px-10 py-2 space-y-2 text-xs font-medium text-zinc-600 border-t border-zinc-100">
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Dry & Damaged Barrier</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Dullness & Dark Spots</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Acne & Blemishes</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Fine Lines & Aging</Link>
                  </div>
                )}
              </div>

              {/* Ingredients (Accordion) */}
              <div>
                <button
                  onClick={() => toggleSubmenu("ingredients")}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-[18px] h-[18px] text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22v-8" />
                      <path d="M12 14a5 5 0 0 1 5-5c2 0 3 1 3 1s0 3-2 5a5 5 0 0 1-6-1z" />
                      <path d="M12 17a4 4 0 0 0-4-4c-1.5 0-2.5.8-2.5.8s0 2.2 1.5 3.7A4 4 0 0 0 12 17z" />
                    </svg>
                    <span>Ingredients</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      expandedMenus["ingredients"] ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenus["ingredients"] && (
                  <div className="bg-zinc-50/80 px-10 py-2 space-y-2 text-xs font-medium text-zinc-600 border-t border-zinc-100">
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Vitamin C</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Ceramides</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Hyaluronic Acid</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Salicylic Acid</Link>
                    <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-amber-600">Retinol & Peptides</Link>
                  </div>
                )}
              </div>

              {/* My Account */}
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <User className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>My Account</span>
              </Link>

              {/* iCash */}
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <Wallet className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>iCash</span>
              </Link>

              {/* Referrals */}
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <Share2 className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>Referrals</span>
              </Link>

              {/* Careers */}
              <Link
                href="/#careers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <Briefcase className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>Careers</span>
              </Link>

              {/* Blog */}
              <Link
                href="/#blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <BookOpen className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>Blog</span>
              </Link>

              {/* Contact us */}
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <Phone className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>Contact us</span>
              </Link>

              {/* Innovist Insider */}
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <ExternalLink className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                <span>Innovist Insider</span>
              </Link>
            </div>

            {/* 3. Bottom Banner (Matches Image 1) */}
            <div className="bg-[#EFECE6] p-4 text-center shrink-0 border-t border-zinc-200/60">
              <p className="font-extrabold text-xs text-zinc-900 tracking-tight">
                Exclusive Deals | More Savings
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5 mb-2.5">
                Download the Innovist App
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-black text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[9px] font-bold shadow-xs">
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.3 0 .58.09.82.25l13.5 8.5c.62.39.81 1.21.42 1.83-.11.18-.26.33-.42.42l-13.5 8.5c-.24.16-.52.25-.82.25-.83 0-1.5-.67-1.5-1.5z" />
                  </svg>
                  <div className="text-left leading-none">
                    <div className="text-[7px] text-zinc-400 uppercase">Get It On</div>
                    <div>Google Play</div>
                  </div>
                </div>
                <div className="bg-black text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[9px] font-bold shadow-xs">
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.62-.75 1.04-1.8 1.04-2.89 0-.15-.02-.3-.04-.44-.99.04-2.18.66-2.89 1.49-.62.71-1.16 1.76-1.16 2.87 0 .15.02.3.04.41 1.07-.03 2.19-.69 3.01-1.44z" />
                  </svg>
                  <div className="text-left leading-none">
                    <div className="text-[7px] text-zinc-400 uppercase">Download on the</div>
                    <div>App Store</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
