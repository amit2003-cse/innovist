"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Package,
  MapPin,
  Truck,
  MessageSquare,
  Mail,
  Printer,
  ArrowRight,
  X,
  Sparkles
} from "lucide-react";

export interface ConfirmedOrderData {
  orderId: string;
  totalAmount: number;
  paymentMethod: "razorpay" | "cod";
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    email?: string;
    flatBuilding?: string;
    streetArea?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt?: string;
}

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ConfirmedOrderData | null;
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  order,
}: OrderConfirmationModalProps) {
  const router = useRouter();

  if (!isOpen || !order) return null;

  const displayOrderId = order.orderId.startsWith("INV-")
    ? order.orderId
    : `INV-${order.orderId.slice(-6).toUpperCase()}`;

  const fullStreet = [order.shippingAddress.flatBuilding, order.shippingAddress.streetArea, order.shippingAddress.landmark]
    .filter(Boolean)
    .join(", ");

  const handleGoToOrders = () => {
    onClose();
    router.push("/orders");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 text-center relative shrink-0">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg text-emerald-600 mb-2.5 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Order Confirmed!</h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-sm mx-auto">
            Thank you for choosing Innovist. Your fresh barrier care formulation has been queued for packaging.
          </p>

          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-black/20 text-xs font-mono font-bold tracking-wider">
            <span>Order ID:</span>
            <span className="text-amber-300 font-extrabold">{displayOrderId}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Real-time Notification Dispatch Alerts */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Instant Confirmation Dispatched</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-800">
              <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded-xl border border-emerald-100">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  WhatsApp to <strong>{order.shippingAddress.phone}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded-xl border border-emerald-100">
                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  Email receipt to <strong>{order.shippingAddress.email || "Registered ID"}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Stepper / Timeline */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Estimated Doorstep Delivery</span>
              </div>
              <span className="text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full text-[10px]">
                {order.estimatedDelivery || "2-3 Business Days"}
              </span>
            </div>

            {/* Stepper Dots */}
            <div className="grid grid-cols-4 gap-1 text-center pt-1">
              <div className="space-y-1">
                <div className="h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-emerald-800 block">Confirmed</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-semibold text-zinc-600 block">Packaging</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-zinc-200 rounded-full"></div>
                <span className="text-[10px] font-medium text-zinc-400 block">In Transit</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-zinc-200 rounded-full"></div>
                <span className="text-[10px] font-medium text-zinc-400 block">Delivered</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="border border-zinc-200 rounded-2xl p-3.5 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-zinc-900">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                <span>Shipping To</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid Online"}
              </span>
            </div>

            <p className="font-bold text-zinc-900 text-xs">
              {order.shippingAddress.fullName} &bull;{" "}
              <span className="text-zinc-500 font-normal">{order.shippingAddress.phone}</span>
            </p>

            <p className="text-zinc-600 text-[11px] leading-relaxed">
              {fullStreet}
              {fullStreet ? ", " : ""}
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              <strong>{order.shippingAddress.pincode}</strong>
            </p>
          </div>

          {/* Ordered Items List */}
          <div className="border border-zinc-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-zinc-600" />
                <span>Items ({order.items.reduce((s, it) => s + it.quantity, 0)})</span>
              </div>
              <span className="font-black text-sm">₹{order.totalAmount}</span>
            </div>

            <div className="divide-y divide-zinc-100 max-h-36 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-zinc-900 truncate text-[11px]">{item.name}</p>
                    <p className="text-[10px] text-zinc-400">
                      Qty: {item.quantity} &bull; {item.size || "50 ml"}
                    </p>
                  </div>
                  <span className="font-bold text-zinc-800 text-xs shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 shrink-0 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="py-2.5 px-3 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 font-bold text-xs text-zinc-800 flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={handleGoToOrders}
              type="button"
              className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <span>Track in Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-full text-center text-xs font-semibold text-zinc-500 hover:text-zinc-800 py-1"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
