"use client";

import React from "react";
import { FaceCream } from "@/data/faceCreams";

interface FaceCreamJarProps {
  product: FaceCream;
  size?: "sm" | "md" | "lg";
}

export default function FaceCreamJar({ product, size = "md" }: FaceCreamJarProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  // Responsive height and width styling to strictly fit mobile viewports
  const containerClasses = isSm
    ? "h-16 w-16 sm:h-20 sm:w-20"
    : isLg
    ? "h-40 w-40 sm:h-56 sm:w-56"
    : "h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40";

  // Accent styling based on category
  const getJarPalette = () => {
    switch (product.category) {
      case "barrier":
        return {
          cap: "#78350F",
          capGradient: "from-amber-700 to-amber-900",
          body: "#FFFBEB",
          accent: "#D97706",
          badge: "5x CERAMIDES",
          labelBg: "#FEF3C7"
        };
      case "brightening":
        return {
          cap: "#B45309",
          capGradient: "from-amber-500 to-yellow-600",
          body: "#FEFCE8",
          accent: "#EAB308",
          badge: "10% VITAMIN C",
          labelBg: "#FEF08A"
        };
      case "hydra":
        return {
          cap: "#0369A1",
          capGradient: "from-sky-500 to-cyan-600",
          body: "#F0F9FF",
          accent: "#0284C7",
          badge: "5D HYALURONIC",
          labelBg: "#BAE6FD"
        };
      case "anti-acne":
        return {
          cap: "#065F46",
          capGradient: "from-emerald-600 to-teal-800",
          body: "#ECFDF5",
          accent: "#10B981",
          badge: "2% SALICYLIC",
          labelBg: "#A7F3D0"
        };
      case "night-repair":
        return {
          cap: "#4C1D95",
          capGradient: "from-purple-800 to-indigo-950",
          body: "#FAF5FF",
          accent: "#8B5CF6",
          badge: "PEPTIDES + RETINOL",
          labelBg: "#E9D5FF"
        };
      case "sun-cream":
      default:
        return {
          cap: "#9A3412",
          capGradient: "from-amber-600 to-orange-700",
          body: "#FFF7ED",
          accent: "#F97316",
          badge: "SPF 50 PA++++",
          labelBg: "#FED7AA"
        };
    }
  };

  const palette = getJarPalette();

  return (
    <div className={`relative flex items-center justify-center select-none ${containerClasses} max-w-full`}>
      {/* Background Soft Glow */}
      <div
        className="absolute inset-0 rounded-full blur-lg opacity-30 -z-10"
        style={{ backgroundColor: palette.accent }}
      />

      {/* SVG Jar Illustration */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`capGrad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id={`jarGrad-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor={palette.body} />
          </linearGradient>
        </defs>

        {/* Shadow Under Jar */}
        <ellipse cx="100" cy="180" rx="60" ry="10" fill="#000000" opacity="0.12" />

        {/* Jar Base Container */}
        <rect
          x="42"
          y="78"
          width="116"
          height="92"
          rx="18"
          fill={`url(#jarGrad-${product.id})`}
          stroke="#E5E7EB"
          strokeWidth="1.5"
        />

        {/* Gloss highlight on jar */}
        <path
          d="M 52 86 Q 50 120 54 156"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Jar Metallic Neck */}
        <rect
          x="54"
          y="68"
          width="92"
          height="12"
          rx="3"
          fill="#E2E8F0"
          stroke="#CBD5E1"
          strokeWidth="1"
        />

        {/* Jar Lid / Cap */}
        <path
          d="M 46 42 C 46 36 50 32 58 32 L 142 32 C 150 32 154 36 154 42 L 154 68 L 46 68 Z"
          fill={palette.cap}
        />
        <path
          d="M 46 42 C 46 36 50 32 58 32 L 142 32 C 150 32 154 36 154 42 L 154 68 L 46 68 Z"
          fill={`url(#capGrad-${product.id})`}
        />
        {/* Lid Top Groove */}
        <line x1="52" y1="36" x2="148" y2="36" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.5" />

        {/* Brand Label on Jar */}
        <rect
          x="55"
          y="98"
          width="90"
          height="58"
          rx="8"
          fill="#FFFFFF"
          stroke={palette.labelBg}
          strokeWidth="1.5"
        />

        {/* Brand Title */}
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fontSize="9"
          fontWeight="800"
          letterSpacing="1.2"
          fill="#111827"
          fontFamily="system-ui, sans-serif"
        >
          INNOVIST
        </text>

        {/* Key Badge in Label */}
        <rect
          x="62"
          y="117"
          width="76"
          height="12"
          rx="3"
          fill={palette.labelBg}
        />
        <text
          x="100"
          y="126"
          textAnchor="middle"
          fontSize="6.8"
          fontWeight="700"
          fill={palette.accent}
          fontFamily="system-ui, sans-serif"
        >
          {palette.badge}
        </text>

        {/* Product Type Caption */}
        <text
          x="100"
          y="139"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="600"
          fill="#4B5563"
          fontFamily="system-ui, sans-serif"
        >
          DERMA FACE CREAM
        </text>

        {/* Volume Size */}
        <text
          x="100"
          y="149"
          textAnchor="middle"
          fontSize="6"
          fontWeight="500"
          fill="#9CA3AF"
          fontFamily="system-ui, sans-serif"
        >
          {product.size}
        </text>
      </svg>
    </div>
  );
}
