"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FaceCream } from "@/data/faceCreams";

export interface CartItem {
  product: FaceCream;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: FaceCream, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  couponCode: string;
  appliedCoupon: string | null;
  discountRate: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  totalItemsCount: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("FLAT20");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("innovist_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => setItems(parsed), 0);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem("innovist_cart", JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const addToCart = (product: FaceCream, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.shortName} to bag!`);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "EXTRA50" || cleanCode === "SAVE50") {
      setAppliedCoupon(cleanCode);
      showToast(`Coupon "${cleanCode}" applied! ₹50 extra discount unlocked.`);
      return true;
    } else if (cleanCode === "FLAT20" || cleanCode === "INNOVIST20" || cleanCode === "GLOW20") {
      setAppliedCoupon(cleanCode);
      showToast(`Coupon "${cleanCode}" applied! 20% discount unlocked.`);
      return true;
    } else if (cleanCode === "SAVE10") {
      setAppliedCoupon(cleanCode);
      showToast(`Coupon "${cleanCode}" applied! 10% discount unlocked.`);
      return true;
    } else {
      showToast(`Invalid coupon code. Try FLAT20 or EXTRA50.`);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed.");
  };

  const freeShippingThreshold = 499;

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const isFlat50 = appliedCoupon === "EXTRA50" || appliedCoupon === "SAVE50";
  const is10Percent = appliedCoupon === "SAVE10";
  const discountRate = isFlat50 ? 0 : is10Percent ? 0.1 : appliedCoupon ? 0.2 : 0;
  const discountAmount = isFlat50
    ? Math.min(subtotal, 50)
    : Math.round(subtotal * discountRate);

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingFee = subtotal === 0 || afterDiscount >= freeShippingThreshold ? 0 : 49;
  const total = Math.max(0, afterDiscount + shippingFee);

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - afterDiscount);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        couponCode: appliedCoupon || "",
        appliedCoupon,
        discountRate,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        totalItemsCount,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
