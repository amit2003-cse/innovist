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

  const containerClasses = isSm
    ? "h-16 w-16 sm:h-20 sm:w-20"
    : isLg
    ? "h-44 w-44 sm:h-60 sm:w-60"
    : "h-32 w-32 sm:h-36 sm:w-36";

  const isTube = product.productType === "tube";
  const primaryColor = product.jarColor || "#B91C1C";

  if (isTube) {
    // Cosmetic Tube Render (Exact to Screenshot 1 Face Wash & Screenshot 2 Retinol Tube)
    return (
      <div className={`relative flex items-center justify-center select-none ${containerClasses} max-w-full`}>
        {/* Soft Background Swatch / Pedestal */}
        <div
          className="absolute -inset-1 rounded-full blur-md opacity-25 -z-10"
          style={{ backgroundColor: primaryColor }}
        />

        <svg
          viewBox="0 0 200 220"
          className="w-full h-full drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`tubeGrad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="30%" stopColor={primaryColor} />
              <stop offset="85%" stopColor={primaryColor} />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id={`pedestalGrad-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E5DFD5" />
              <stop offset="100%" stopColor="#C8BEB2" />
            </linearGradient>
          </defs>

          {/* 3D Pedestal Block */}
          <ellipse cx="100" cy="198" rx="64" ry="12" fill="#000000" opacity="0.12" />
          <path
            d="M 38 185 L 162 185 L 152 205 L 48 205 Z"
            fill={`url(#pedestalGrad-${product.id})`}
            opacity="0.7"
          />

          {/* Cosmetic Texture Swatch Splash in Background */}
          <path
            d="M 120 40 Q 170 60 160 120 Q 150 160 120 170 Q 130 110 120 40 Z"
            fill={primaryColor}
            opacity="0.18"
          />

          {/* Squeeze Tube Body */}
          <path
            d="M 68 35 L 132 35 C 134 70 126 145 120 165 L 80 165 C 74 145 66 70 68 35 Z"
            fill={`url(#tubeGrad-${product.id})`}
            stroke="#E5E7EB"
            strokeWidth="0.8"
          />

          {/* Tube Top Sealed Crimp */}
          <path
            d="M 66 32 L 134 32 L 133 38 L 67 38 Z"
            fill={primaryColor}
            opacity="0.95"
            stroke="#000000"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
          {/* Crimp textured ridges */}
          <line x1="74" y1="32" x2="74" y2="38" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4" />
          <line x1="86" y1="32" x2="86" y2="38" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4" />
          <line x1="100" y1="32" x2="100" y2="38" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4" />
          <line x1="114" y1="32" x2="114" y2="38" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4" />
          <line x1="126" y1="32" x2="126" y2="38" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4" />

          {/* Tube White Label */}
          <rect
            x="76"
            y="65"
            width="48"
            height="68"
            rx="4"
            fill="#FFFFFF"
            opacity="0.96"
            stroke="#E5E7EB"
            strokeWidth="0.5"
          />

          {/* Brand Logo on Label */}
          <text
            x="100"
            y="78"
            textAnchor="middle"
            fontSize="6"
            fontWeight="900"
            letterSpacing="0.8"
            fill="#111827"
            fontFamily="system-ui, sans-serif"
          >
            INNOVIST
          </text>
          <line x1="84" y1="81" x2="116" y2="81" stroke="#E5E7EB" strokeWidth="0.6" />

          {/* Product Active Badge */}
          <rect x="80" y="85" width="40" height="9" rx="2" fill={primaryColor} opacity="0.15" />
          <text
            x="100"
            y="92"
            textAnchor="middle"
            fontSize="4.8"
            fontWeight="800"
            fill={primaryColor}
            fontFamily="system-ui, sans-serif"
          >
            {product.category === "face-wash" ? "FACE WASH" : "NIGHT CREAM"}
          </text>

          {/* Active % Text */}
          <text
            x="100"
            y="106"
            textAnchor="middle"
            fontSize="5.2"
            fontWeight="900"
            fill="#111827"
            fontFamily="system-ui, sans-serif"
          >
            {product.shortName.slice(0, 14)}
          </text>
          <text
            x="100"
            y="114"
            textAnchor="middle"
            fontSize="4"
            fontWeight="600"
            fill="#6B7280"
            fontFamily="system-ui, sans-serif"
          >
            {product.size}
          </text>

          {/* Tube Cap / Base Stand */}
          <rect
            x="79"
            y="165"
            width="42"
            height="18"
            rx="3"
            fill="#FFFFFF"
            stroke="#D1D5DB"
            strokeWidth="1"
          />
          <line x1="79" y1="172" x2="121" y2="172" stroke="#E5E7EB" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  // Cosmetic Jar Render (For Barrier Creams & Hydra Gels)
  return (
    <div className={`relative flex items-center justify-center select-none ${containerClasses} max-w-full`}>
      {/* Background Soft Glow */}
      <div
        className="absolute -inset-1 rounded-full blur-md opacity-25 -z-10"
        style={{ backgroundColor: primaryColor }}
      />

      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`jarGrad-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F9FAFB" />
          </linearGradient>
          <linearGradient id={`capGrad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 3D Pedestal Base */}
        <ellipse cx="100" cy="180" rx="60" ry="10" fill="#000000" opacity="0.14" />
        <ellipse cx="100" cy="177" rx="55" ry="8" fill="#E2DDD5" opacity="0.6" />

        {/* Jar Body */}
        <rect
          x="44"
          y="78"
          width="112"
          height="88"
          rx="18"
          fill={`url(#jarGrad-${product.id})`}
          stroke="#E5E7EB"
          strokeWidth="1.5"
        />

        {/* Gloss highlight */}
        <path
          d="M 52 86 Q 50 120 54 152"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Metallic Collar */}
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

        {/* Jar Cap / Lid */}
        <path
          d="M 48 42 C 48 35 52 32 60 32 L 140 32 C 148 32 152 35 152 42 L 152 68 L 48 68 Z"
          fill={primaryColor}
        />
        <path
          d="M 48 42 C 48 35 52 32 60 32 L 140 32 C 148 32 152 35 152 42 L 152 68 L 48 68 Z"
          fill={`url(#capGrad-${product.id})`}
        />

        {/* Brand Label on Jar */}
        <rect
          x="56"
          y="96"
          width="88"
          height="56"
          rx="8"
          fill="#FFFFFF"
          stroke="#F3F4F6"
          strokeWidth="1"
        />

        {/* Label Content */}
        <text
          x="100"
          y="110"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="900"
          letterSpacing="1"
          fill="#111827"
          fontFamily="system-ui, sans-serif"
        >
          INNOVIST
        </text>

        <rect x="68" y="116" width="64" height="11" rx="2.5" fill={primaryColor} opacity="0.15" />
        <text
          x="100"
          y="124"
          textAnchor="middle"
          fontSize="5.2"
          fontWeight="800"
          fill={primaryColor}
          fontFamily="system-ui, sans-serif"
        >
          {product.shortName.slice(0, 16)}
        </text>

        <text
          x="100"
          y="138"
          textAnchor="middle"
          fontSize="5"
          fontWeight="700"
          fill="#6B7280"
          fontFamily="system-ui, sans-serif"
        >
          {product.size}
        </text>
      </svg>
    </div>
  );
}
