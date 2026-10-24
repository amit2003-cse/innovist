"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  LogOut,
  Package,
  Truck,
  Crown,
  Wallet,
  Share2,
  Phone,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  onOpenSearch: () => void;
  onSelectCategory?: (catId: string) => void;
  onSelectConcern?: (concernId: string) => void;
}

export default function Header({ onOpenSearch, onSelectCategory, onSelectConcern }: HeaderProps) {
  const router = useRouter();
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

  const handleCategoryClick = (catId: string) => {
    setMobileMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      router.push("/#bestsellers");
    }
  };

  const handleConcernClick = (concernId: string) => {
    setMobileMenuOpen(false);
    if (onSelectConcern) {
      onSelectConcern(concernId);
    } else {
      router.push("/#bestsellers");
    }
  };

  // Live Cutoff Countdown for Same-Day Dispatch (Persistent daily cutoff at 5:00 PM)
  const [dispatchCountdown, setDispatchCountdown] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(17, 0, 0, 0); // 5:00 PM cutoff
      if (now.getTime() > cutoff.getTime()) {
        cutoff.setDate(cutoff.getDate() + 1);
      }
      const diffMs = cutoff.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setDispatchCountdown(
        `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Top Announcement Bar - changes every 3.5 seconds
  const announcements = [
    {
      id: "same-day-dispatch",
      text: dispatchCountdown
        ? `⚡ Order within ${dispatchCountdown} for Same-Day Dispatch!`
        : "⚡ Order within 4 hrs for Same-Day Dispatch!",
      isUrgent: true,
      hasIcon: true,
    },
    {
      id: "coupon-20",
      text: "FLAT 20% OFF on All Face Creams & Washes | Code: FLAT20",
      isUrgent: false,
      hasIcon: false,
    },
    {
      id: "free-shipping",
      text: "Free Express Shipping On All Orders Above ₹499",
      isUrgent: false,
      hasIcon: false,
    },
    {
      id: "fraud-alert",
      text: "Beware of Fraud Calls: Pay Only Via Our Official Website",
      isUrgent: false,
      hasIcon: true,
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
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % searchPhrases.length);
        }, 300);
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
                onClick={() => {
                  if (user) {
                    setAccountMenuOpen(!accountMenuOpen);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                aria-label="Account options"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 text-zinc-300 hover:text-white transition flex items-center justify-center text-xs overflow-hidden cursor-pointer"
              >
                {user ? (
                  <UserAvatar user={user} className="w-full h-full rounded-xl" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>

              {/* Account Dropdown (Authenticated Users) */}
              {accountMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-zinc-900 rounded-2xl shadow-xl border border-zinc-100 p-4 z-50 text-xs animate-fade-in">
                  <div className="pb-3 border-b border-zinc-100 mb-3 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                      <UserAvatar user={user} className="w-full h-full rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
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
                      className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        Sign Out
                      </span>
                    </button>
                  </div>
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
            {/* 1. Member Profile Header */}
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
                  <div className="w-11 h-11 rounded-xl bg-amber-400 text-zinc-950 font-extrabold text-xl flex items-center justify-center shadow-xs shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : "I"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white leading-tight">
                    {user ? `Hi, ${user.name || "Member"}` : "Hi, Welcome to Innovist"}
                  </p>
                  <p className="text-xs text-zinc-400 font-medium truncate max-w-[170px] mt-0.5">
                    {user ? (user.email || user.name) : "Unlock Rewards & 500 iCash"}
                  </p>
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs text-amber-400 font-bold hover:underline block mt-1 text-left"
                    >
                      Log out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="text-xs text-amber-400 font-bold hover:underline block mt-1 text-left"
                    >
                      Log in / Register →
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

            {/* 2. Menu Navigation List (Scrollable - 100% Functional) */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 text-[13px] font-semibold text-zinc-800">
              {/* Admin Management (Only visible for admin) */}
              {user && isAdminEmail(user.email) && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 bg-amber-500/10 text-amber-950 hover:bg-amber-100/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-[18px] h-[18px] text-amber-600" strokeWidth={2} />
                    <span className="font-bold">Admin Management</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider bg-amber-500 text-black px-2 py-0.5 rounded font-black">
                    Live
                  </span>
                </Link>
              )}

              {/* Track Order */}
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                  <span>Track Order</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>

              {/* Best Sellers */}
              <button
                onClick={() => handleCategoryClick("all")}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-[18px] h-[18px] text-amber-600" strokeWidth={1.75} />
                  <span>Best Sellers</span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                  Top 10
                </span>
              </button>

              {/* Face Washes & Cleansers */}
              <button
                onClick={() => handleCategoryClick("face-wash")}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🫧</span>
                  <span>Face Washes & Cleansers</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              {/* Face Creams & Moisturizers */}
              <button
                onClick={() => handleCategoryClick("face-cream")}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🧴</span>
                  <span>Face Creams & Barrier Care</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              {/* Shop By Skin Concern (Accordion with real live catalog concerns) */}
              <div>
                <button
                  onClick={() => toggleSubmenu("concerns")}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-[18px] h-[18px] text-amber-600" strokeWidth={1.75} />
                    <span>Shop By Skin Concern</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      expandedMenus["concerns"] ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenus["concerns"] && (
                  <div className="bg-zinc-50/80 px-4 py-2 space-y-1 text-xs font-semibold text-zinc-700 border-t border-zinc-100">
                    {[
                      "Acne & Clogged Pores",
                      "Dry & Damaged Barrier",
                      "Dullness & Dark Spots",
                      "Fine Lines & Ageing",
                      "Dehydrated Skin",
                      "Redness & Sensitivity",
                    ].map((concern) => (
                      <button
                        key={concern}
                        onClick={() => handleConcernClick(concern)}
                        className="w-full text-left py-2 px-3 rounded-md hover:bg-amber-50 hover:text-amber-800 transition flex items-center justify-between"
                      >
                        <span>{concern}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* My Account & Past Orders */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) {
                    router.push("/orders");
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <User className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                  <span>My Account & Past Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              {/* iCash Wallet & Member Rewards */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) {
                    router.push("/orders");
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-[18px] h-[18px] text-zinc-800" strokeWidth={1.75} />
                  <span>iCash Wallet & Rewards</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  500 Coins
                </span>
              </button>

              {/* WhatsApp Live Support */}
              <a
                href="https://wa.me/917488574616?text=Hi%20Innovist%20Team%2C%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-[18px] h-[18px] text-emerald-600" strokeWidth={1.75} />
                  <span>WhatsApp Support</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  Online
                </span>
              </a>
            </div>

            {/* 3. Bottom Trust Strip */}
            <div className="bg-[#FAF9F6] p-4 text-center shrink-0 border-t border-zinc-200/80 text-[11px] text-zinc-600 space-y-1">
              <div className="flex items-center justify-center gap-2 font-bold text-zinc-900">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Innovist Direct Guarantee</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                100% Genuine Clinical Actives • Free Delivery Above ₹499 • 7-Day Replacement
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
