"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import FaceCreamJar from "./FaceCreamJar";
import OrderConfirmationModal, { ConfirmedOrderData } from "./OrderConfirmationModal";
import { loadRazorpayScript, RazorpayResponse } from "@/lib/razorpay";
import { lookupPincode } from "@/lib/pincode";
import { FACE_CREAMS, FaceCream } from "@/data/faceCreams";
import TrustBadges from "./TrustBadges";
import {
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ArrowRight,
  Check,
  CreditCard,
  Banknote,
  MapPin,
  Loader2,
  AlertCircle,
  Truck,
  Home,
  Briefcase,
  Flame,
  Zap,
  Clock,
  ShoppingBag,
  X,
  ShieldCheck,
  Tag
} from "lucide-react";

export default function CartDrawer() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    addToCart,
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
  const [checkoutStep, setCheckoutStep] = useState<"bag" | "shipping">("bag");

  // Reset step to bag if cart becomes empty
  useEffect(() => {
    if (items.length === 0) {
      setCheckoutStep("bag");
    }
  }, [items.length]);

  // 15-Minute Persistent Cart Reservation Timer (CRO Feature 1)
  const [cartSecondsLeft, setCartSecondsLeft] = useState(15 * 60);

  useEffect(() => {
    if (items.length === 0) return;

    try {
      const storedExpiry = localStorage.getItem("innovist_cart_reserve_expiry");
      const now = Date.now();
      let targetTime = storedExpiry ? parseInt(storedExpiry, 10) : 0;

      if (!targetTime || targetTime <= now) {
        targetTime = now + 15 * 60 * 1000;
        localStorage.setItem("innovist_cart_reserve_expiry", targetTime.toString());
      }

      const updateTimer = () => {
        const remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
        setCartSecondsLeft(remaining);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } catch (e) {
      console.error(e);
    }
  }, [items.length]);

  // 10-Minute Prepaid/UPI Priority Dispatch Timer (CRO Feature 1)
  const [prepaidSecondsLeft, setPrepaidSecondsLeft] = useState(10 * 60);

  useEffect(() => {
    try {
      const storedPrepaid = localStorage.getItem("innovist_prepaid_timer_expiry");
      const now = Date.now();
      let targetTime = storedPrepaid ? parseInt(storedPrepaid, 10) : 0;

      if (!targetTime || targetTime <= now) {
        targetTime = now + 10 * 60 * 1000;
        localStorage.setItem("innovist_prepaid_timer_expiry", targetTime.toString());
      }

      const updateTimer = () => {
        const remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
        setPrepaidSecondsLeft(remaining);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Confirmed Order Modal State
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrderData | null>(null);

  // Rich Delivery Address State
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [flatBuilding, setFlatBuilding] = useState("");
  const [streetArea, setStreetArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("110001");
  const [city, setCity] = useState("New Delhi");
  const [state, setState] = useState("Delhi");
  const [addressType, setAddressType] = useState<"Home" | "Work">("Home");
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState("1-2 Business Days");
  const [formValidationErrors, setFormValidationErrors] = useState<Record<string, string>>({});

  // Load saved address from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("innovist_shipping_address");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.flatBuilding) setFlatBuilding(parsed.flatBuilding);
        if (parsed.streetArea) setStreetArea(parsed.streetArea);
        if (parsed.landmark) setLandmark(parsed.landmark);
        if (parsed.pincode) setPincode(parsed.pincode);
        if (parsed.city) setCity(parsed.city);
        if (parsed.state) setState(parsed.state);
        if (parsed.addressType) setAddressType(parsed.addressType);
        if (parsed.deliveryEstimate) setDeliveryEstimate(parsed.deliveryEstimate);
      } else if (user) {
        if (user.name) setFullName(user.name);
        if (user.email) setEmail(user.email);
      }
    } catch (e) {
      console.error("Error reading saved address:", e);
    }
  }, [user]);

  // Sync user details if user signs in later
  useEffect(() => {
    if (user?.name && !fullName) setFullName(user.name);
    if (user?.email && (!email || email === "customer@innovist.com")) setEmail(user.email);
  }, [user]);

  // Handle PIN code change with auto-resolution
  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(val);

    if (val.length === 6) {
      setIsLookingUpPin(true);
      try {
        const info = await lookupPincode(val);
        if (info) {
          setCity(info.city);
          setState(info.state);
          setDeliveryEstimate(info.estimatedDays);
          setFormValidationErrors((prev) => {
            const copy = { ...prev };
            delete copy.pincode;
            return copy;
          });
        }
      } catch (err) {
        console.error("Pincode lookup error:", err);
      } finally {
        setIsLookingUpPin(false);
      }
    }
  };

  const validateAddress = (): boolean => {
    const errors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = "Please enter receiver's full name";
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!flatBuilding.trim() && !streetArea.trim()) {
      errors.flatBuilding = "Please enter Flat/House No. or Street details";
    }

    if (!pincode || pincode.length !== 6) {
      errors.pincode = "Enter a valid 6-digit PIN code";
    }

    if (!city.trim()) {
      errors.city = "City is required";
    }

    if (!state.trim()) {
      errors.state = "State is required";
    }

    setFormValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput) {
      applyCoupon(couponInput);
      setCouponInput("");
    }
  };

  // Helper to persist order to localStorage for immediate guest visibility in My Orders
  const persistOrderLocally = (orderRecord: any) => {
    try {
      const existingStr = localStorage.getItem("innovist_recent_orders");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [orderRecord, ...existing.filter((o: any) => o._id !== orderRecord._id)];
      localStorage.setItem("innovist_recent_orders", JSON.stringify(updated));

      // Also save address
      const addrToSave = {
        fullName,
        phone,
        email,
        flatBuilding,
        streetArea,
        landmark,
        pincode,
        city,
        state,
        addressType,
        deliveryEstimate,
      };
      localStorage.setItem("innovist_shipping_address", JSON.stringify(addrToSave));

      // Save to saved addresses list
      const savedAddrsStr = localStorage.getItem("innovist_saved_addresses");
      const savedAddrs = savedAddrsStr ? JSON.parse(savedAddrsStr) : [];
      const isAlready = savedAddrs.some(
        (a: any) => a.pincode === pincode && a.flatBuilding === flatBuilding
      );
      if (!isAlready) {
        localStorage.setItem(
          "innovist_saved_addresses",
          JSON.stringify([addrToSave, ...savedAddrs])
        );
      }
    } catch (e) {
      console.warn("Could not persist order locally:", e);
    }
  };

  // Helper to fire notification dispatch API
  const dispatchOrderNotification = async (orderId: string) => {
    try {
      await fetch("/api/order-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          totalAmount: total,
          paymentMethod,
          items: items.map((it) => ({
            name: it.product.name,
            quantity: it.quantity,
            price: it.product.price,
          })),
          shippingAddress: {
            fullName,
            phone,
            email,
            flatBuilding,
            streetArea,
            landmark,
            city,
            state,
            pincode,
          },
        }),
      });
    } catch (err) {
      console.error("Failed to dispatch order notification:", err);
    }
  };

  // Main Checkout Handler
  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!validateAddress()) {
      setShowAddressForm(true);
      setErrorMessage("Please complete your delivery address details before checking out.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const shippingAddressPayload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      flatBuilding: flatBuilding.trim(),
      streetArea: streetArea.trim(),
      landmark: landmark.trim(),
      street: `${flatBuilding.trim()} ${streetArea.trim()}`.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      addressType,
    };

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
            userEmail: email,
            userName: fullName,
            subtotal,
            discountAmount,
            couponCode: appliedCoupon || "",
            shippingFee,
            shippingAddress: shippingAddressPayload,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to place COD order");
        }

        const newOrderId = data.orderId || `INV-${Date.now().toString().slice(-6)}`;

        const orderObj: ConfirmedOrderData = {
          orderId: newOrderId,
          totalAmount: total,
          paymentMethod: "cod",
          items: items.map((it) => ({
            id: it.product.id,
            name: it.product.name,
            price: it.product.price,
            quantity: it.quantity,
            size: it.product.size,
          })),
          shippingAddress: shippingAddressPayload,
          trackingNumber: `DELH${Math.floor(100000000 + Math.random() * 900000000)}`,
          estimatedDelivery: deliveryEstimate || "2-3 Business Days",
          createdAt: new Date().toISOString(),
        };

        // Persist locally & trigger notifications
        persistOrderLocally({
          _id: newOrderId,
          ...orderObj,
          userEmail: email,
          userName: fullName,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
        dispatchOrderNotification(newOrderId);

        clearCart();
        setConfirmedOrder(orderObj);
        showToast("🎉 Order Confirmed! Cash payment upon delivery.");
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
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

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
          userEmail: email,
          userName: fullName,
          subtotal,
          discountAmount,
          couponCode: appliedCoupon || "",
          shippingFee,
          shippingAddress: shippingAddressPayload,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to initialize payment order.");
      }

      const keyId =
        orderData.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        process.env.RAZORPAY_KEY_ID ||
        "rzp_live_TrhchmaNWAgiMV";

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Innovist Clean Care",
        description: `Payment for ${items.length} item(s)`,
        image: "https://innovist.com/favicon.ico",
        order_id: orderData.order_id,
        handler: async function (response: RazorpayResponse) {
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

            const successOrderId = verifyData.orderId || orderData.order_id;
            const orderObj: ConfirmedOrderData = {
              orderId: successOrderId,
              totalAmount: total,
              paymentMethod: "razorpay",
              items: items.map((it) => ({
                id: it.product.id,
                name: it.product.name,
                price: it.product.price,
                quantity: it.quantity,
                size: it.product.size,
              })),
              shippingAddress: shippingAddressPayload,
              trackingNumber: `DELH${Math.floor(100000000 + Math.random() * 900000000)}`,
              estimatedDelivery: deliveryEstimate || "2-3 Business Days",
              createdAt: new Date().toISOString(),
            };

            // Persist locally & trigger notifications
            persistOrderLocally({
              _id: successOrderId,
              ...orderObj,
              userEmail: email,
              userName: fullName,
              status: "paid",
              paymentId: response.razorpay_payment_id,
              createdAt: new Date().toISOString(),
            });
            dispatchOrderNotification(successOrderId);

            clearCart();
            setConfirmedOrder(orderObj);
            showToast("🎉 Payment Successful! Your order has been placed.");
          } catch (verifyErr: any) {
            console.error("Verification error:", verifyErr);
            setErrorMessage(verifyErr.message || "Payment verification failed.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        notes: {
          address: `${flatBuilding} ${streetArea}, ${city}, ${state} - ${pincode}`,
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

  // 1-Click In-Cart Upsell ("Frequently Paired Together" - CRO Feature 4)
  const cartItemIds = new Set(items.map((it) => it.product.id));
  const hasFaceWash = items.some((it) => it.product.category === "face-wash");
  const upsellProducts = FACE_CREAMS.filter((p) => !cartItemIds.has(p.id))
    .sort((a, b) => {
      if (hasFaceWash && a.category === "face-cream") return -1;
      if (!hasFaceWash && a.category === "face-wash") return -1;
      return 0;
    })
    .slice(0, 2);

  // If order confirmation is active, render the modal even if drawer is closed
  if (!isCartOpen && !confirmedOrder) return null;

  return (
    <>
      {/* Order Confirmation Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          isOpen={!!confirmedOrder}
          order={confirmedOrder}
          onClose={() => {
            setConfirmedOrder(null);
            setIsCartOpen(false);
          }}
        />
      )}

      {/* Main Drawer (if isCartOpen is true) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Semi-transparent Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity cursor-pointer"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart backdrop"
          />

          {/* Drawer Panel */}
          <div className="relative w-[92%] sm:w-[410px] max-w-[430px] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
            {/* Header */}
            <div className="h-13 px-4 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
              {checkoutStep === "bag" ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 leading-tight">Your Shopping Bag</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCheckoutStep("bag");
                      setErrorMessage(null);
                    }}
                    aria-label="Back to bag"
                    className="p-1 -ml-1 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition flex items-center gap-1 font-bold text-xs"
                  >
                    <ChevronLeft className="w-4 h-4 text-zinc-800" />
                    <span>Bag</span>
                  </button>
                  <span className="text-zinc-300">/</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="text-zinc-900 font-extrabold">Delivery & Payment</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
                className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message Alert (Shown if an error occurs) */}
            {errorMessage && (
              <div className="mx-3 mt-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fade-in shrink-0">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Empty State */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 mb-3 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-9 h-9" />
                </div>
                <h3 className="font-black text-sm text-zinc-900 tracking-tight">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-[220px]">
                  Explore dermatologist-formulated face creams & cleansers!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs transition shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : checkoutStep === "bag" ? (
              /* ================== STEP 1: SHOPPING BAG ================== */
              <>
                {/* 1. Unified Urgency Ribbon */}
                <div className="bg-gradient-to-r from-amber-500/15 to-amber-500/10 border-b border-amber-500/25 px-3 py-1.5 flex items-center justify-between text-[11px] text-amber-950 font-bold shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse shrink-0" />
                    <span>Cart Reserved:</span>
                    <span className="font-mono bg-amber-500/20 text-amber-950 px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider">
                      {String(Math.floor(cartSecondsLeft / 60)).padStart(2, "0")}:{String(cartSecondsLeft % 60).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-900 font-extrabold bg-amber-200/50 px-2 py-0.5 rounded-full">
                    ⚡ Same-Day Dispatch
                  </span>
                </div>

                {/* 2. Free Delivery Progress Bar */}
                <div className="px-3.5 py-2.5 bg-amber-50/70 border-b border-amber-200/60 text-xs shrink-0">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-amber-950">
                    {amountNeededForFreeShipping === 0 ? (
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>🎉 You unlocked <strong>FREE Delivery</strong>!</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>
                          Add <strong className="text-zinc-950">₹{amountNeededForFreeShipping}</strong> more for <strong>FREE Delivery</strong>
                        </span>
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-500 font-mono font-bold">
                      {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
                    </span>
                  </div>
                  <div className="w-full bg-amber-200/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        amountNeededForFreeShipping === 0
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-amber-500 to-amber-600"
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* 3. Scrollable Bag Content */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                  {/* Cart Items */}
                  <div className="space-y-2.5">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2.5 rounded-2xl border border-zinc-200 bg-white shadow-2xs hover:border-zinc-300 transition"
                      >
                        <div
                          onClick={() => {
                            setIsCartOpen(false);
                            router.push(`/products/${product.id}`);
                          }}
                          className="cursor-pointer shrink-0"
                        >
                          <FaceCreamJar product={product} size="sm" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-[12px] text-zinc-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-[10px] text-zinc-500">{product.size}</p>

                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xs font-black text-zinc-900">
                              ₹{product.price * quantity}
                            </span>
                            <span className="text-[10px] text-zinc-400 line-through">
                              ₹{product.originalPrice * quantity}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Adjuster */}
                        <div className="flex items-center gap-1 bg-zinc-100 rounded-xl p-1 shrink-0">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-5 h-5 rounded-lg bg-white text-zinc-800 flex items-center justify-center hover:bg-zinc-200 transition shadow-2xs"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-[11px] font-bold px-1.5">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-5 h-5 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center hover:bg-amber-500 transition shadow-2xs"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          aria-label="Remove item"
                          className="p-1.5 text-zinc-400 hover:text-rose-600 transition shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* 1-Click Upsell */}
                  {upsellProducts.length > 0 && (
                    <div className="bg-gradient-to-b from-amber-50/50 to-white rounded-2xl border border-amber-200/70 p-3 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-900">
                            Frequently Paired Together
                          </h4>
                        </div>
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          1-Click Add
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {upsellProducts.slice(0, 1).map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between gap-2.5 p-2 bg-white rounded-xl border border-zinc-200 shadow-2xs"
                          >
                            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                              <FaceCreamJar product={p} size="sm" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-extrabold text-[11px] text-zinc-900 truncate">{p.name}</div>
                              <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-xs font-black text-zinc-900">₹{p.price}</span>
                                <span className="text-[9px] text-zinc-400 line-through">₹{p.originalPrice}</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                addToCart(p, 1);
                                showToast(`Added ${p.name} to cart!`);
                              }}
                              className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 text-[10px] font-black rounded-lg transition shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Promo Code Box */}
                  <div className="bg-white rounded-2xl border border-zinc-200 p-3 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Offers & Coupons</span>
                    </div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px]">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            Coupon <strong>{appliedCoupon}</strong> Applied (20% OFF)
                          </span>
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
                          className="flex-1 px-2.5 py-1.5 text-xs rounded-xl border border-zinc-300 focus:outline-none uppercase bg-zinc-50 focus:bg-white font-mono"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* 4. Step 1 Sticky Bottom Summary & Proceed CTA */}
                <div className="p-3.5 border-t border-zinc-200 bg-white space-y-2.5 shrink-0 shadow-lg">
                  <div className="space-y-1 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-zinc-900">₹{subtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Coupon Savings ({appliedCoupon})</span>
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
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setCheckoutStep("shipping");
                    }}
                    className="w-full py-3 px-4 rounded-full bg-zinc-950 hover:bg-black text-white font-extrabold text-xs tracking-wide transition shadow-md flex items-center justify-between cursor-pointer active:scale-98"
                  >
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[10px] text-zinc-400 font-medium">Order Total</span>
                      <span className="text-sm font-black">₹{total}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  <div className="pt-0.5">
                    <TrustBadges variant="compact" />
                  </div>
                </div>
              </>
            ) : (
              /* ================== STEP 2: SHIPPING & PAYMENT ================== */
              <>
                {/* Step 2 Order Summary Header Pill */}
                <div className="px-3.5 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-medium">{totalItemsCount} Items</span>
                    <span className="text-zinc-300">•</span>
                    <span className="font-black text-zinc-900 text-sm">₹{total}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutStep("bag");
                      setErrorMessage(null);
                    }}
                    className="text-[11px] text-amber-700 font-bold hover:underline"
                  >
                    Review Bag
                  </button>
                </div>

                {/* Scrollable Shipping Form & Payment Details */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
                  {/* Delivery Address Form Card */}
                  <div className="bg-white rounded-2xl border border-zinc-200 p-3.5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-zinc-900 text-xs">
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Delivery Address</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                        <Truck className="w-3 h-3 text-amber-700" />
                        <span>{deliveryEstimate}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* Name & Phone */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                            Receiver&apos;s Name *
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              if (formValidationErrors.fullName) {
                                setFormValidationErrors((p) => ({ ...p, fullName: "" }));
                              }
                            }}
                            placeholder="Full Name"
                            className={`w-full px-2.5 py-1.5 rounded-xl border bg-white text-xs ${
                              formValidationErrors.fullName
                                ? "border-rose-400 bg-rose-50/30"
                                : "border-zinc-300 focus:border-black"
                            }`}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                            10-Digit Mobile *
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (formValidationErrors.phone) {
                                setFormValidationErrors((p) => ({ ...p, phone: "" }));
                              }
                            }}
                            placeholder="Mobile Number"
                            className={`w-full px-2.5 py-1.5 rounded-xl border bg-white text-xs ${
                              formValidationErrors.phone
                                ? "border-rose-400 bg-rose-50/30"
                                : "border-zinc-300 focus:border-black"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Email for Receipts */}
                      <div>
                        <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                          Email (for Tracking & Invoice) *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs focus:border-black"
                        />
                      </div>

                      {/* Flat / Building */}
                      <div>
                        <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                          Flat, House No., Building Name *
                        </label>
                        <input
                          type="text"
                          value={flatBuilding}
                          onChange={(e) => {
                            setFlatBuilding(e.target.value);
                            if (formValidationErrors.flatBuilding) {
                              setFormValidationErrors((p) => ({ ...p, flatBuilding: "" }));
                            }
                          }}
                          placeholder="e.g. Flat 302, Green View"
                          className={`w-full px-2.5 py-1.5 rounded-xl border bg-white text-xs ${
                            formValidationErrors.flatBuilding
                              ? "border-rose-400 bg-rose-50/30"
                              : "border-zinc-300 focus:border-black"
                          }`}
                        />
                      </div>

                      {/* Street / Locality */}
                      <div>
                        <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                          Street, Area, Locality *
                        </label>
                        <input
                          type="text"
                          value={streetArea}
                          onChange={(e) => setStreetArea(e.target.value)}
                          placeholder="e.g. 5th Main, Sector 4"
                          className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs focus:border-black"
                        />
                      </div>

                      {/* PIN Code, City, State */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-bold text-zinc-600">PIN *</label>
                            {isLookingUpPin && (
                              <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-600" />
                            )}
                          </div>
                          <input
                            type="text"
                            maxLength={6}
                            value={pincode}
                            onChange={handlePincodeChange}
                            placeholder="6-digit PIN"
                            className={`w-full px-2.5 py-1.5 rounded-xl border bg-white text-xs font-mono font-bold ${
                              formValidationErrors.pincode
                                ? "border-rose-400 bg-rose-50/30"
                                : "border-zinc-300 focus:border-black"
                            }`}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-600 block mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
                            className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs focus:border-black"
                          />
                        </div>
                      </div>

                      {/* Save As Tag */}
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          Address Type
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setAddressType("Home")}
                            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                              addressType === "Home"
                                ? "bg-zinc-900 text-white"
                                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                            }`}
                          >
                            <Home className="w-3 h-3" />
                            <span>Home</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddressType("Work")}
                            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                              addressType === "Work"
                                ? "bg-zinc-900 text-white"
                                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                            }`}
                          >
                            <Briefcase className="w-3 h-3" />
                            <span>Work</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector Card */}
                  <div className="bg-white rounded-2xl border border-zinc-200 p-3.5 space-y-2.5 shadow-2xs">
                    <label className="text-xs font-bold text-zinc-900 block">
                      Choose Payment Method
                    </label>

                    {/* Priority Dispatch Banner for Online Payment */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-600 fill-emerald-500 shrink-0" />
                        <div>
                          <div className="font-extrabold text-emerald-950 leading-tight">
                            Pay Online for Priority Dispatch!
                          </div>
                          <div className="text-[10px] text-emerald-800">
                            Guaranteed priority same-day packing
                          </div>
                        </div>
                      </div>
                      <div className="font-mono bg-emerald-700 text-white px-2 py-0.5 rounded-md font-black text-[10px] shrink-0 tracking-wider">
                        {String(Math.floor(prepaidSecondsLeft / 60)).padStart(2, "0")}:{String(prepaidSecondsLeft % 60).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("razorpay")}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                          paymentMethod === "razorpay"
                            ? "border-black bg-zinc-950 text-white shadow-xs"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        <CreditCard className="w-4 h-4 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold leading-tight">Pay Online</div>
                          <div className="text-[9px] opacity-75 truncate">UPI / Cards / Netbanking</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                          paymentMethod === "cod"
                            ? "border-black bg-zinc-950 text-white shadow-xs"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        <Banknote className="w-4 h-4 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold leading-tight">Cash on Delivery</div>
                          <div className="text-[9px] opacity-75 truncate">Standard Courier</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2 Sticky Bottom Pay Button */}
                <div className="p-3.5 border-t border-zinc-200 bg-white space-y-2.5 shrink-0 shadow-lg">
                  <div className="space-y-1 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-zinc-900">₹{subtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Coupon Savings ({appliedCoupon})</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery</span>
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

                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 rounded-full font-extrabold text-xs tracking-wide transition shadow-md flex items-center justify-center gap-1.5 transform active:scale-98 cursor-pointer ${
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
                        <span>Processing Order...</span>
                      </>
                    ) : paymentMethod === "razorpay" ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
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

                  <div className="pt-0.5">
                    <TrustBadges variant="compact" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
