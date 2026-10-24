"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppSupportButton() {
  const [showTooltip, setShowTooltip] = useState(true);
  const phoneNumber = "917488574616";
  const defaultMessage = encodeURIComponent(
    "Hi Innovist Team! I have a question regarding face creams and order delivery."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-end gap-2 group">
      {/* Interactive Tooltip Callout */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-zinc-800 text-xs py-2 px-3 rounded-2xl shadow-xl border border-zinc-200 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div>
            <p className="font-extrabold text-[11px] leading-tight text-zinc-900">
              Need Help? Chat with Us
            </p>
            <p className="text-[10px] text-zinc-500">+91 74885 74616 (24/7)</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="p-0.5 text-zinc-400 hover:text-zinc-600 rounded-full ml-1"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Floating WhatsApp Bubble */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp +91 7488574616"
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping opacity-75 pointer-events-none" />

        {/* WhatsApp Official SVG Logo */}
        <svg
          className="w-7 h-7 fill-current relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.507 14.307l-.009.075c-.238-.12-1.406-.693-1.624-.772-.218-.079-.377-.12-.536.12-.159.239-.615.772-.754.931-.139.159-.278.179-.516.06-.238-.12-1.006-.371-1.916-1.182-.708-.631-1.186-1.411-1.325-1.65-.139-.239-.015-.368.105-.487.108-.108.238-.278.357-.418.119-.14.159-.239.238-.398.079-.159.039-.299-.02-.418-.059-.119-.536-1.293-.734-1.771-.193-.466-.39-.402-.536-.41l-.457-.008c-.159 0-.418.06-.637.299-.218.239-.834.815-.834 1.988 0 1.173.853 2.306.972 2.466.119.16 1.679 2.564 4.068 3.593.568.245 1.012.392 1.358.502.571.182 1.091.156 1.501.095.457-.068 1.406-.575 1.604-1.132.198-.557.198-1.034.139-1.132-.06-.098-.219-.159-.457-.278zM12.012 2.002C6.49 2.002 2.01 6.48 2.01 12c0 1.96.568 3.791 1.554 5.348L2 22l4.805-1.523A9.946 9.946 0 0012.012 22c5.522 0 10.002-4.48 10.002-10 0-5.52-4.48-9.998-10.002-9.998zm0 18.225c-1.636 0-3.155-.494-4.425-1.341l-.317-.213-2.853.904.928-2.778-.234-.343a8.17 8.17 0 01-1.34-4.454c0-4.542 3.698-8.24 8.241-8.24 4.543 0 8.241 3.698 8.241 8.24 0 4.542-3.698 8.225-8.241 8.225z" />
        </svg>

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
      </a>
    </div>
  );
}
