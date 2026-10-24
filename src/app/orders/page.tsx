"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import FooterAccordion from "@/components/FooterAccordion";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";
import UserAvatar from "@/components/UserAvatar";
import { lookupPincode } from "@/lib/pincode";
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
  Coins,
  Printer,
  MessageSquare,
  Home,
  Briefcase,
  Trash2,
  Edit2,
  ShieldCheck,
  Check,
  X,
  Sparkles
} from "lucide-react";

export default function OrdersPage() {
  const { user, logout, setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "icash" | "referrals" | "addresses">("orders");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Addresses State
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    flatBuilding: "",
    streetArea: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    addressType: "Home",
  });

  // Invoice / Tracking Modal State
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<any | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<any | null>(null);

  // Load Saved Addresses
  useEffect(() => {
    try {
      const stored = localStorage.getItem("innovist_saved_addresses");
      if (stored) {
        setSavedAddresses(JSON.parse(stored));
      } else {
        const single = localStorage.getItem("innovist_shipping_address");
        if (single) {
          setSavedAddresses([JSON.parse(single)]);
        }
      }
    } catch (e) {
      console.error("Error reading saved addresses:", e);
    }
  }, []);

  // Fetch Orders (combines Server API + Local Guest Orders)
  useEffect(() => {
    async function loadOrders() {
      setLoadingOrders(true);
      let localOrders: any[] = [];
      try {
        const localStr = localStorage.getItem("innovist_recent_orders");
        if (localStr) {
          localOrders = JSON.parse(localStr);
        }
      } catch (err) {
        console.error("Failed to parse local orders:", err);
      }

      let serverOrders: any[] = [];
      if (user?.email) {
        try {
          const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
          const data = await res.json();
          if (data.orders && Array.isArray(data.orders)) {
            serverOrders = data.orders;
          }
        } catch (e) {
          console.error("Failed to fetch server orders:", e);
        }
      }

      // Merge and deduplicate by _id or id
      const orderMap = new Map<string, any>();
      [...localOrders, ...serverOrders].forEach((ord) => {
        const key = ord._id || ord.id || ord.orderId;
        if (key && !orderMap.has(key)) {
          orderMap.set(key, ord);
        }
      });

      const merged = Array.from(orderMap.values()).sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      setOrders(merged);
      setLoadingOrders(false);
    }

    loadOrders();
  }, [user?.email]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.pincode) return;

    const updated = [addressForm, ...savedAddresses];
    setSavedAddresses(updated);
    try {
      localStorage.setItem("innovist_saved_addresses", JSON.stringify(updated));
      localStorage.setItem("innovist_shipping_address", JSON.stringify(addressForm));
    } catch (err) {
      console.error(err);
    }
    setShowAddressModal(false);
    setAddressForm({
      fullName: "",
      phone: "",
      email: "",
      flatBuilding: "",
      streetArea: "",
      landmark: "",
      pincode: "",
      city: "",
      state: "",
      addressType: "Home",
    });
  };

  const handleDeleteAddress = (index: number) => {
    const updated = savedAddresses.filter((_, i) => i !== index);
    setSavedAddresses(updated);
    try {
      localStorage.setItem("innovist_saved_addresses", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePincodeLookup = async (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setAddressForm((prev) => ({ ...prev, pincode: clean }));
    if (clean.length === 6) {
      const info = await lookupPincode(clean);
      if (info) {
        setAddressForm((prev) => ({
          ...prev,
          city: info.city,
          state: info.state,
        }));
      }
    }
  };

  const faqs = [
    {
      q: "How do I track my order?",
      a: "Once your face cream order is dispatched, you will receive an automated SMS and WhatsApp update with your live tracking URL (Delhivery Express). You can also click the Track Order button right from this page.",
    },
    {
      q: "How do I cancel my order?",
      a: "You can cancel your order within 3 hours of placing it before the batch has been packaged and handed over to our delivery partner. Simply tap Cancel Order or message our 24/7 WhatsApp helpdesk at +91 74885 74616.",
    },
    {
      q: "How to modify my order?",
      a: "If you need to change your delivery address, phone number, or cream variant, please reach out to our support team before order dispatch.",
    },
    {
      q: "How do I return my order?",
      a: "We offer a 7-day hassle-free replacement policy for items that arrive damaged or defective. Simply share a quick unboxing video with our support team to receive an instant replacement.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] selection:bg-amber-200 selection:text-amber-900 pb-8">
      {/* 1. Header with Rotating Top Banner */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Container */}
      <main className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 space-y-5">
        {/* User Profile Header Card */}
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
                  {user.email || "+91 91109 04529"}
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
          <div className="bg-white rounded-3xl p-5 border border-zinc-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold mb-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Guest Session Active</span>
              </div>
              <h2 className="font-extrabold text-base sm:text-lg text-zinc-950">
                Innovist Customer Portal
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Viewing recent orders and saved delivery addresses for this device.
              </p>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition shrink-0 shadow-xs"
            >
              Sign In with Google
            </button>
          </div>
        )}

        {/* Horizontal Navigation Tabs */}
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
            <span>My Orders ({orders.length})</span>
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
            <span>Addresses ({savedAddresses.length})</span>
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
        </div>

        {/* Tab 1: Orders List */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            {loadingOrders ? (
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 text-center space-y-2">
                <p className="text-zinc-600 font-semibold text-xs">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
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
              orders.map((order) => {
                const orderId = String(order.orderId || order._id || order.id || "INV-001")
                  .slice(-8)
                  .toUpperCase();
                const itemsCount =
                  order.items?.reduce((s: number, it: any) => s + (it.quantity || 1), 0) || 1;
                const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                const productName =
                  firstItem?.name || order.productName || "Ceramide Barrier Relief Face Cream";
                const totalAmount = order.totalAmount || order.price || 499;
                const isPaid = order.status === "paid" || order.paymentMethod === "razorpay";
                const isCod = order.paymentMethod === "cod";
                const statusLabel = isPaid
                  ? "Prepaid & Confirmed"
                  : isCod
                  ? "COD Confirmed"
                  : "Order Confirmed";
                const dateFormatted = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Today";

                const addr = order.shippingAddress || {};
                const fullStreet = [addr.flatBuilding, addr.streetArea, addr.street, addr.landmark]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <div
                    key={order._id || order.id || order.orderId}
                    className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-3.5"
                  >
                    {/* Order Top Bar */}
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-100">
                      <div>
                        <span className="font-extrabold text-zinc-900">Order #{orderId}</span>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{dateFormatted}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                        {statusLabel}
                      </span>
                    </div>

                    {/* Product Summary */}
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                        🧴
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                          {productName}
                        </h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {itemsCount > 1
                            ? `${firstItem?.size || "50 ml"} + ${itemsCount - 1} more items`
                            : `${firstItem?.size || "50 ml"} • Qty: ${firstItem?.quantity || 1}`}
                        </p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-black text-xs sm:text-sm text-zinc-900">
                            ₹{totalAmount}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            ({isCod ? "Cash on Delivery" : "Razorpay Online"})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address Summary (P0 Requirement) */}
                    <div className="bg-zinc-50/90 rounded-2xl p-3 border border-zinc-200/80 text-[11px] text-zinc-600 space-y-1">
                      <div className="flex items-center justify-between font-bold text-zinc-800">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>Delivery Address:</span>
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {addr.phone || "+91 91109 04529"}
                        </span>
                      </div>
                      <p className="text-zinc-700 leading-snug">
                        <strong>{addr.fullName || "Customer"}</strong> &bull;{" "}
                        {fullStreet || "Standard Street Address"},{" "}
                        {addr.city || "New Delhi"}, {addr.state || "Delhi"} -{" "}
                        <strong>{addr.pincode || "110001"}</strong>
                      </p>
                    </div>

                    {/* Notification Confirmation Pill */}
                    <div className="flex items-center gap-2 text-[10px] text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        WhatsApp & SMS updates dispatched to{" "}
                        <strong>{addr.phone || "+91 91109 04529"}</strong>
                      </span>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                        <Truck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Est: {order.estimatedDelivery || "2-3 Business Days"}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveInvoiceOrder(order)}
                          className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 font-bold text-[11px] text-zinc-700 transition flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                        <button
                          onClick={() => setActiveTrackingOrder(order)}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-[11px] text-white transition flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses (P0 Requirement) */}
        {activeTab === "addresses" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-zinc-900">Saved Addresses</h3>
                <p className="text-xs text-zinc-500">
                  Manage delivery addresses for faster 1-click checkout
                </p>
              </div>

              <button
                onClick={() => setShowAddressModal(true)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {savedAddresses.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-2xl">
                  📍
                </div>
                <h4 className="font-bold text-sm text-zinc-900">No Saved Addresses</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Addresses used during checkout will automatically be saved here.
                </p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="mt-2 px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs"
                >
                  Add Your Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr, idx) => {
                  const full = [addr.flatBuilding, addr.streetArea, addr.street, addr.landmark]
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-2xs space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-bold text-[10px] uppercase flex items-center gap-1">
                          {addr.addressType === "Work" ? (
                            <Briefcase className="w-3 h-3" />
                          ) : (
                            <Home className="w-3 h-3" />
                          )}
                          <span>{addr.addressType || "Home"}</span>
                        </span>

                        <button
                          onClick={() => handleDeleteAddress(idx)}
                          className="p-1 text-zinc-400 hover:text-rose-600 transition"
                          aria-label="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-zinc-900">{addr.fullName}</h4>
                        <p className="text-[11px] text-zinc-500">{addr.phone}</p>
                      </div>

                      <p className="text-xs text-zinc-600 leading-relaxed">
                        {full || "Standard Street Address"}, {addr.city}, {addr.state} -{" "}
                        <strong>{addr.pincode}</strong>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: iCash Balance */}
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

        {/* Tab 4: Referrals */}
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

        {/* FAQs Section */}
        <section className="space-y-3 pt-2">
          <div className="text-center pb-2">
            <h2 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">FAQs</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Find answers to commonly asked questions</p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              const pastelBgs = [
                "bg-rose-50/50 hover:bg-rose-50",
                "bg-emerald-50/50 hover:bg-emerald-50",
                "bg-amber-50/50 hover:bg-amber-50",
                "bg-purple-50/50 hover:bg-purple-50",
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

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-zinc-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-extrabold text-base text-zinc-950">Add Shipping Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                  Receiver Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm((p) => ({ ...p, fullName: e.target.value }))
                  }
                  placeholder="Full Name"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-zinc-600 block mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="10-digit mobile"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) => handlePincodeLookup(e.target.value)}
                    placeholder="6-digit PIN"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                  Flat, House No., Building Name *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.flatBuilding}
                  onChange={(e) =>
                    setAddressForm((p) => ({ ...p, flatBuilding: e.target.value }))
                  }
                  placeholder="e.g. Flat 402, Green Park"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                  Street, Area, Locality *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.streetArea}
                  onChange={(e) =>
                    setAddressForm((p) => ({ ...p, streetArea: e.target.value }))
                  }
                  placeholder="e.g. 100ft Road, Indiranagar"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-zinc-600 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, city: e.target.value }))
                    }
                    placeholder="City"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-600 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, state: e.target.value }))
                    }
                    placeholder="State"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2 rounded-xl border border-zinc-200 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      {activeInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-zinc-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div>
                <h3 className="font-extrabold text-base text-zinc-950">Tax Invoice Receipt</h3>
                <p className="text-[10px] text-zinc-400">
                  Order #{String(activeInvoiceOrder._id || activeInvoiceOrder.id || "").slice(-8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setActiveInvoiceOrder(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <p className="font-bold text-zinc-800">Innovist Skin Care Laboratories Ltd.</p>
                <p className="text-[10px] text-zinc-400">GSTIN: 07AAACI1234F1Z8 &bull; Delhi Hub</p>
              </div>

              <div className="border border-zinc-100 rounded-2xl p-3 space-y-1">
                <p className="font-bold text-zinc-900">Billed & Shipped To:</p>
                <p className="text-zinc-600">
                  {activeInvoiceOrder.shippingAddress?.fullName || activeInvoiceOrder.userName}
                </p>
                <p className="text-zinc-500 text-[11px]">
                  {activeInvoiceOrder.shippingAddress?.phone} &bull;{" "}
                  {activeInvoiceOrder.shippingAddress?.city},{" "}
                  {activeInvoiceOrder.shippingAddress?.state}
                </p>
              </div>

              <div className="border border-zinc-100 rounded-2xl p-3 space-y-1.5">
                <div className="flex justify-between font-bold text-zinc-900 border-b pb-1">
                  <span>Item</span>
                  <span>Amount</span>
                </div>
                {activeInvoiceOrder.items?.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-[11px] text-zinc-600">
                    <span>
                      {it.name} &times; {it.quantity || 1}
                    </span>
                    <span>₹{(it.price || 0) * (it.quantity || 1)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-black text-xs text-zinc-900 pt-1 border-t">
                  <span>Grand Total</span>
                  <span>₹{activeInvoiceOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {activeTrackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div>
                <h3 className="font-extrabold text-base text-zinc-950">Shipment Tracking</h3>
                <p className="text-[10px] text-zinc-400">
                  AWB: {activeTrackingOrder.trackingNumber || "DELH839210492"} &bull; Delhivery Express
                </p>
              </div>
              <button
                onClick={() => setActiveTrackingOrder(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <h4 className="font-bold text-zinc-900">Order Confirmed</h4>
                  <p className="text-[10px] text-zinc-400">Fresh barrier formulation queued</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-amber-400 animate-pulse"></div>
                  <h4 className="font-bold text-zinc-900">Packaging at Clean Lab</h4>
                  <p className="text-[10px] text-zinc-400">Sterilized sealing in progress</p>
                </div>

                <div className="relative opacity-50">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-zinc-300"></div>
                  <h4 className="font-bold text-zinc-600">Handed to Courier (Delhivery)</h4>
                  <p className="text-[10px] text-zinc-400">Expected transit departure</p>
                </div>

                <div className="relative opacity-50">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-zinc-300"></div>
                  <h4 className="font-bold text-zinc-600">Delivered to Doorstep</h4>
                  <p className="text-[10px] text-zinc-400">
                    Est: {activeTrackingOrder.estimatedDelivery || "2-3 Business Days"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTrackingOrder(null)}
              className="w-full py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Footer & Popups */}
      <FooterAccordion />
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
      <Toast />
    </div>
  );
}
