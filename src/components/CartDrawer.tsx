"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import FaceCreamJar from "./FaceCreamJar";
import { loadRazorpayScript, RazorpayResponse } from "@/lib/razorpay";
import {
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Check,
  CreditCard,
  Banknote,
  MapPin,
  Loader2,
  AlertCircle,
  Truck
} from "lucide-react";

export default function CartDrawer() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    showToast,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delivery details
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("+91 91109 04529");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("110001");

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput) {
      applyCoupon(couponInput);
      setCouponInput("");
    }
  };

  // Main Checkout Handler supporting both Razorpay and COD
  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const customerName = name.trim() || user?.name || "Customer";
    const customerEmail = user?.email || "customer@innovist.com";
    const customerPhone = phone.trim() || "+919110904529";

    // 1. CASH ON DELIVERY (COD) FLOW
    if (paymentMethod === "cod") {
      try {
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            currency: "INR",
            paymentMethod: "cod",
            items: items.map((it) => ({
              id: it.product.id,
              name: it.product.name,
              price: it.product.price,
              quantity: it.quantity,
              size: it.product.size,
            })),
            userEmail: customerEmail,
            userName: customerName,
            subtotal,
            discountAmount,
            couponCode: appliedCoupon || "",
            shippingFee,
            shippingAddress: {
              street: address || "Default Address",
              city: "New Delhi",
              state: "Delhi",
              pincode: pincode || "110001",
              phone: customerPhone,
            },
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to place COD order");
        }

        clearCart();
        setIsCartOpen(false);
        showToast("🎉 Order Placed! Pay with cash upon delivery.");
        router.push("/orders");
      } catch (err: any) {
        console.error("COD Order error:", err);
        setErrorMessage(err.message || "Failed to process Cash on Delivery order.");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // 2. RAZORPAY STANDARD WEB CHECKOUT FLOW
    try {
      // Step 2a: Load Razorpay Checkout SDK Script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // Step 2b: Create Order on Backend (POST /api/create-order)
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          paymentMethod: "razorpay",
          items: items.map((it) => ({
            id: it.product.id,
            name: it.product.name,
            price: it.product.price,
            quantity: it.quantity,
            size: it.product.size,
          })),
          userEmail: customerEmail,
          userName: customerName,
          subtotal,
          discountAmount,
          couponCode: appliedCoupon || "",
          shippingFee,
          shippingAddress: {
            street: address || "Standard Delivery Address",
            city: "New Delhi",
            state: "Delhi",
            pincode: pincode || "110001",
            phone: customerPhone,
          },
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to initialize payment order.");
      }

      // Key ID from server response or env
      const keyId =
        orderData.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        process.env.RAZORPAY_KEY_ID ||
        "rzp_test_Tq57o2d7vWhs1N";

      // Step 2c: Open Razorpay Payment Modal
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Innovist Clean Care",
        description: `Payment for ${items.length} item(s)`,
        image: "https://innovist.com/favicon.ico",
        order_id: orderData.order_id,
        handler: async function (response: RazorpayResponse) {
          // Step 3: Backend signature verification (POST /api/verify-payment)
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment signature verification failed.");
            }

            // Success! Clear cart & navigate to orders
            clearCart();
            setIsCartOpen(false);
            showToast("🎉 Payment Successful! Your order has been placed.");
            router.push("/orders");
          } catch (verifyErr: any) {
            console.error("Verification error:", verifyErr);
            setErrorMessage(verifyErr.message || "Payment verification failed.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          address: address || "Innovist Face Care Order",
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            showToast("Payment window closed. Order was not charged.");
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      // Handle payment.failed event
      razorpayInstance.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setErrorMessage(response.error.description || "Payment failed. Please try again.");
        setIsProcessing(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error("Razorpay Checkout Error:", err);
      setErrorMessage(err.message || "An error occurred while launching Razorpay.");
      setIsProcessing(false);
    }
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Semi-transparent Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity cursor-pointer"
        onClick={() => setIsCartOpen(false)}
        aria-label="Close cart backdrop"
      />

      {/* Drawer Panel */}
      <div className="relative w-[88%] sm:w-[390px] max-w-[420px] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
        {/* 1. Header */}
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

        {/* 2. Top Banner */}
        <div className="bg-[#46403B] text-white py-2 px-3 text-center text-[10px] sm:text-xs font-bold tracking-wider uppercase shrink-0">
          Pay Online & Get Up To 125 OFF
        </div>

        {/* Free Shipping Progress Indicator */}
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
            <div className="w-full bg-amber-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(((subtotal - discountAmount) / freeShippingThreshold) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="m-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="flex-1 text-[11px] font-medium">{errorMessage}</span>
          </div>
        )}

        {/* 3. Items or Empty State */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-zinc-900">Your bag is empty</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
              Explore our best-selling face creams and build your daily clean ritual.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-6 px-6 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-zinc-800 transition"
            >
              Shop Now
            </button>
          </div>
        ) : (
          /* Item List */
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

            {/* Quick Delivery Info Toggle */}
            <div className="mt-3 bg-zinc-50 rounded-2xl border border-zinc-200 p-2.5 text-xs">
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="w-full flex items-center justify-between text-left font-bold text-zinc-800"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Delivery Address</span>
                </div>
                <span className="text-[11px] text-amber-700 font-semibold underline">
                  {showAddressForm ? "Hide" : "Edit Details"}
                </span>
              </button>

              {showAddressForm && (
                <div className="mt-2.5 space-y-2 pt-2 border-t border-zinc-200 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-zinc-500 block mb-0.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Receiver's name"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-500 block mb-0.5">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-500 block mb-0.5">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="6-digit PIN"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-zinc-500 block mb-0.5">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House / Flat / Street address"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
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
                    placeholder="Enter Coupon (e.g. FLAT20)"
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

            {/* Payment Method Selector (COD vs Razorpay) */}
            <div className="pt-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Payment Option
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
                    paymentMethod === "razorpay"
                      ? "border-black bg-zinc-900 text-white shadow-xs"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold leading-tight">Pay Online</div>
                    <div className="text-[9px] opacity-75 truncate">UPI / Cards</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
                    paymentMethod === "cod"
                      ? "border-black bg-zinc-900 text-white shadow-xs"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  <Banknote className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold leading-tight">Cash on Delivery</div>
                    <div className="text-[9px] opacity-75 truncate">Pay at Doorstep</div>
                  </div>
                </button>
              </div>
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
              disabled={isProcessing}
              className={`w-full py-2.5 px-4 rounded-full font-extrabold text-xs tracking-wide transition shadow-md flex items-center justify-center gap-1.5 transform active:scale-98 ${
                isProcessing
                  ? "bg-zinc-400 cursor-not-allowed text-white"
                  : paymentMethod === "razorpay"
                  ? "bg-black hover:bg-zinc-800 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-zinc-950"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Checkout...</span>
                </>
              ) : paymentMethod === "razorpay" ? (
                <>
                  <span>Proceed To Pay ₹{total}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Confirm Cash on Delivery • ₹{total}</span>
                  <Truck className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <p className="text-[9px] text-center text-zinc-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {paymentMethod === "razorpay"
                ? "Secure 256-bit encrypted Razorpay payment"
                : "100% Genuine products • Cash payment on delivery"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
