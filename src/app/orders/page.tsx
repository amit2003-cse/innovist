"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import FooterAccordion from "@/components/FooterAccordion";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";
import MobileBottomNav from "@/components/MobileBottomNav";
import UserAvatar from "@/components/UserAvatar";
import {
  Package,
  Wallet,
  Gift,
  MapPin,
  LogOut,
  Plus,
  Minus,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Coins
} from "lucide-react";

export default function OrdersPage() {
  const { user, logout, setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "icash" | "referrals" | "addresses">("orders");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sample order for demonstration if user is logged in
  const orders = user
    ? [
        {
          id: "INV-942817",
          date: "Today, 11:45 AM",
          status: "Order Confirmed",
          statusColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
          productName: "10% Vitamin C + Glucosamine Face Cream",
          variant: "50 ml (Standard)",
          price: 499,
          totalPaid: 499,
          paymentMode: "UPI / Google Pay",
          deliveryEstimate: "Tomorrow by 5:00 PM",
        },
      ]
    : [];

  const faqs = [
    {
      q: "How do I track my order?",
      a: "Once your face cream order is dispatched, you will receive an automated SMS and WhatsApp update with your live tracking URL (Shiprocket / Delhivery). You can also click the Track Order button right from this page.",
    },
    {
      q: "How do I cancel my order?",
      a: "You can cancel your order within 3 hours of placing it before the batch has been packaged and handed over to our delivery partner. Simply tap Cancel Order or message our 24/7 WhatsApp helpdesk.",
    },
    {
      q: "How to modify my order?",
      a: "If you need to change your delivery address, phone number, or cream variant, please reach out to our support team before order dispatch.",
    },
    {
      q: "How do I return my order?",
      a: "We offer a 7-day hassle-free replacement policy for items that arrive damaged or defective. Simply share a quick unboxing video with our support team to receive an instant replacement.",
    },
    {
      q: "What is an unfulfilled order?",
      a: "An unfulfilled status indicates that your payment was successfully processed, and our clean manufacturing warehouse is currently packaging your fresh face cream batch for dispatch.",
    },
    {
      q: "My order shows 'Delivered' but I haven't received it. What should I do?",
      a: "Occasionally courier partners mark orders delivered slightly before arrival. Check with family members or your reception desk. If not received within 4 hours, notify us immediately.",
    },
    {
      q: "Can I place an order on Cash on Delivery (COD)?",
      a: "Yes! Cash on Delivery is available across 19,000+ PIN codes across India on all orders between ₹299 and ₹3,000.",
    },
    {
      q: "I entered the wrong phone number/email ID in my order. How can I update it?",
      a: "Please email support@innovist.com or send a WhatsApp message with your Order ID and correct contact information prior to courier dispatch.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] selection:bg-amber-200 selection:text-amber-900 pb-20 md:pb-0">
      {/* 1. Header with Rotating Top Banner */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Container */}
      <main className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 space-y-5">
        {/* User Profile Header Card (Matches Innovist Screenshot 4 & 5) */}
        {user ? (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-amber-200 bg-amber-50 shadow-2xs flex items-center justify-center font-bold text-amber-900 text-lg">
                <UserAvatar user={user} className="w-full h-full text-base" />
              </div>
              <div className="min-w-0">
                <h1 className="font-extrabold text-base sm:text-lg text-zinc-950 truncate">
                  Hi, {user.name}
                </h1>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {user.email || "+91 9110904529"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded-full border border-orange-200 bg-orange-50/50 hover:bg-orange-100 text-orange-600 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
            >
              <span>Log out</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-zinc-950">
                Welcome to Innovist Account
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Sign in with Google to view your order history, live shipment tracking & saved addresses.
              </p>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition shrink-0 shadow-xs"
            >
              Sign In with Google
            </button>
          </div>
        )}

        {/* Horizontal Navigation Tabs (Matches Innovist Screenshot 4 & 5) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 ${
              activeTab === "orders"
                ? "bg-zinc-900 text-white shadow-2xs"
                : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
          </button>

          <button
            onClick={() => setActiveTab("icash")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 ${
              activeTab === "icash"
                ? "bg-zinc-900 text-white shadow-2xs"
                : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>iCash</span>
          </button>

          <button
            onClick={() => setActiveTab("referrals")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 ${
              activeTab === "referrals"
                ? "bg-zinc-900 text-white shadow-2xs"
                : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Referrals</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 ${
              activeTab === "addresses"
                ? "bg-zinc-900 text-white shadow-2xs"
                : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Addresses</span>
          </button>
        </div>

        {/* Promo iCash Banner (Matches Innovist Screenshot 4) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-700 shrink-0 text-2xl shadow-inner">
              💰
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-xs sm:text-sm text-zinc-950 leading-tight">
                Earn 7% iCash on your next order delivery
              </h3>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 leading-snug truncate sm:whitespace-normal">
                Valid on select coupon codes | Existing iCash expires 6 months from credit date
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition shrink-0 shadow-xs"
          >
            Order Now
          </Link>
        </div>

        {/* Tab 1: Orders List (Matches Innovist Screenshot 4) */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-zinc-200/90 text-center space-y-2">
                <p className="text-zinc-600 font-semibold text-xs sm:text-sm">
                  You haven&apos;t placed any orders yet.
                </p>
                <p className="text-[11px] text-zinc-400">
                  Explore our clinically proven face creams to start your personalized routine.
                </p>
                <div className="pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#EBB800] text-zinc-950 font-bold text-xs transition shadow-2xs"
                  >
                    <span>Browse Face Creams</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-100">
                    <div>
                      <span className="font-bold text-zinc-900">Order #{order.id}</span>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{order.date}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                      🧴
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                        {order.productName}
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{order.variant} • Qty: 1</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-black text-xs sm:text-sm text-zinc-900">₹{order.price}</span>
                        <span className="text-[10px] text-zinc-400">({order.paymentMode})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Estimated: {order.deliveryEstimate}</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 font-bold text-[11px] text-zinc-700 transition">
                        Invoice
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 font-bold text-[11px] text-white transition">
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: iCash Balance */}
        {activeTab === "icash" && (
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
              💰
            </div>
            <div>
              <span className="text-3xl font-black text-zinc-900">₹0.00</span>
              <p className="text-xs text-zinc-500 mt-1">Available iCash Balance</p>
            </div>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed">
              Earn 7% iCash cashback on every completed order. 1 iCash = ₹1 redeemable at checkout.
            </p>
          </div>
        )}

        {/* Tab 3: Referrals */}
        {activeTab === "referrals" && (
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🎁
            </div>
            <h3 className="font-extrabold text-base text-zinc-900">Invite Friends, Get ₹150</h3>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed">
              Give your friends ₹150 off their first face cream order, and get ₹150 in iCash once they make a purchase!
            </p>
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 font-mono text-xs font-bold text-zinc-800 max-w-xs mx-auto">
              INNOVIST-{user ? user.name.slice(0, 4).toUpperCase() : "CARE"}150
            </div>
          </div>
        )}

        {/* Tab 4: Addresses */}
        {activeTab === "addresses" && (
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
              📍
            </div>
            <h3 className="font-extrabold text-base text-zinc-900">Saved Addresses</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              You haven&apos;t saved any shipping addresses yet. Addresses are automatically saved upon placing an order.
            </p>
          </div>
        )}

        {/* FAQs Section (Matches Innovist Screenshot 4 & 5 Exactly) */}
        <section className="space-y-3 pt-2">
          <div className="text-center pb-2">
            <h2 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">
              FAQs
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Find answers to commonly asked questions
            </p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              const pastelBgs = [
                "bg-rose-50/50 hover:bg-rose-50",
                "bg-emerald-50/50 hover:bg-emerald-50",
                "bg-amber-50/50 hover:bg-amber-50",
                "bg-purple-50/50 hover:bg-purple-50",
                "bg-sky-50/50 hover:bg-sky-50",
                "bg-orange-50/50 hover:bg-orange-50",
                "bg-teal-50/50 hover:bg-teal-50",
                "bg-indigo-50/50 hover:bg-indigo-50",
              ];
              const bg = pastelBgs[i % pastelBgs.length];

              return (
                <div
                  key={i}
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className={`rounded-2xl border border-zinc-200/80 p-4 transition-all duration-200 cursor-pointer ${bg}`}
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
                    <p className="mt-2.5 text-xs text-zinc-600 leading-relaxed pt-2 border-t border-zinc-200/60 animate-fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer & Popups */}
      <FooterAccordion />
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
      <Toast />
      <MobileBottomNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onScrollToCategories={() => {}}
      />
    </div>
  );
}
