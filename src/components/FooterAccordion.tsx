"use client";

import React, { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

export default function FooterAccordion() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    formulations: true,
    concerns: false,
    science: false,
    knowMore: false,
    findUs: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const footerGroups = [
    {
      key: "formulations",
      title: "Face Cream Formulations",
      links: [
        "Ceramide Barrier Relief Cream",
        "10% Vitamin C Radiance Cream",
        "Hyaluronic Hydra Surge Gel Cream",
        "2% Salicylic Blemish Control Gel",
        "Multi-Peptide & Retinol Night Cream",
        "SPF 50 PA++++ Invisible Day Cream",
        "Fermented Rice Water Glass Skin Cream",
      ],
    },
    {
      key: "concerns",
      title: "Skin Concerns",
      links: [
        "Damaged Skin Barrier",
        "Dullness & Dark Spot Radiance",
        "Dehydrated Oily Skin",
        "Acne & Clogged Pores",
        "Fine Lines & Collagen Loss",
        "Flushed & Reactive Skin",
      ],
    },
    {
      key: "science",
      title: "Clean Dermatological Science",
      links: [
        "Bio-Identical Ceramide Ratio 3:1:1",
        "Optimal pH Formulations (5.2 - 5.8)",
        "Zero Fragrance & Essential Oils",
        "100% Non-Comedogenic Clinical Testing",
        "Ingredients Glossary",
      ],
    },
    {
      key: "knowMore",
      title: "Know More",
      links: [
        "About Innovist Face Care",
        "Contact Our Dermatologist Team",
        "Shipping & COD Policies",
        "7-Day Satisfaction Guarantee",
        "Privacy Policy & Terms",
      ],
    },
    {
      key: "findUs",
      title: "Find Us On",
      links: [
        "Instagram (@innovist_facecare)",
        "YouTube (Innovist Skincare Lab)",
        "Twitter / X (@InnovistCare)",
        "LinkedIn (Innovist Derma Labs)",
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#111827] text-white pt-8 pb-10 mt-8 border-t border-zinc-800 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Brand Science Banner (Clean Science & Dermat Tested Formulations) */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-zinc-700/80 mb-8 shadow-xl text-center">
          <h2 className="text-xl sm:text-3xl font-black tracking-[0.2em] text-white">
            INNOVIST
          </h2>
          <p className="text-[11px] sm:text-sm font-bold tracking-widest text-amber-400 mt-1 uppercase">
            Clean • Transparent • Science
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
            Clinically validated face creams formulated with bio-compatible actives. 100% cruelty-free, fragrance-free, and dermatologically tested.
          </p>
        </div>

        {/* Accordion Lists (Collapsible on mobile, Grid on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-8 pb-8 border-b border-zinc-800">
          {footerGroups.map((group) => {
            const isOpen = openSections[group.key];
            return (
              <div key={group.key} className="border-b md:border-b-0 border-zinc-800/80 pb-2.5 md:pb-0">
                <button
                  onClick={() => toggleSection(group.key)}
                  className="w-full flex items-center justify-between text-left py-1.5 md:py-0 md:mb-3 focus:outline-none"
                >
                  <span className="text-xs sm:text-sm font-bold text-zinc-200 tracking-wide">
                    {group.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform md:hidden ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`space-y-1.5 mt-1.5 md:mt-0 ${
                    isOpen ? "block" : "hidden md:block"
                  }`}
                >
                  {group.links.map((link, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="block text-[11px] sm:text-xs text-zinc-400 hover:text-amber-400 transition leading-snug"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Secure Payment Badges (Matches Innovist Screenshot 4) */}
        <div className="pt-6 pb-4 text-center">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Secure Payment Options
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm mx-auto">
            {["UPI", "RuPay", "VISA", "Mastercard", "Net Banking", "Razorpay"].map(
              (method, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-300 shadow-2xs"
                >
                  {method}
                </span>
              )
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[10px] sm:text-xs text-zinc-500 pt-3 border-t border-zinc-800/80">
          <p>© 2026 Innovist Face Care Pvt. Ltd. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
