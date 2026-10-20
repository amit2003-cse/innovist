# INNOVIST - Pure Face Cream E-Commerce Store

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

A high-performance, minimalist clean-beauty e-commerce frontend inspired by **Innovist**, engineered exclusively for dermatologically backed **Face Creams & Barrier Moisture** formulations.

---

## ✨ Key Features

- **🔄 3-Second Rotating Announcement Bar**:
  - Automatically cycles through seasonal offers, fraud notices, and free shipping updates every 3 seconds with smooth slide-fade transitions.
- **⌨️ Dynamic Typewriter Search Bar**:
  - Character-by-character typing and smooth backspace deletion cycling through face cream formulations with an amber blinking cursor (`|`).
- **🎯 Category & Concern Filter**:
  - Segmented toggle between **Shop By Category** and **Shop By Concern** with touch-scrollable pill icons and unclipped active rings.
- **🛍️ Slide-Over Shopping Bag Drawer**:
  - Replicates Innovist's signature shopping bag with:
    - Custom hand-drawn style empty cart illustration with sad face expression.
    - Free shipping progress bar calculator.
    - `FLAT20` coupon simulator (20% instant discount).
    - Left-side exposed backdrop allowing quick tap-to-close on mobile.
- **🔍 Instant Live Search Modal**:
  - Search face creams in real-time by active ingredients (Ceramides, Vitamin C, Hyaluronic, Retinol, Salicylic) and skin concerns.
- **🧴 Product Quick View & Routine Guide**:
  - Interactive modal displaying AM/PM incorporation routines, clinical actives, texture description, and instant cart actions.
- **📱 Mobile-First 2-Column Grid**:
  - Optimized for iPhone and Android devices with 2 products per row, star ratings, benefit tags, savings pill badges, and signature yellow `Add To Cart` buttons.
- **📚 Dermatological Skincare Journal**:
  - Modal reading experience with expert skincare advice from certified dermatologists.

---

## 🧴 Featured Face Cream Formulations

1. **Ceramide Barrier Relief Face Cream**: 5x Skin-Identical Ceramides & Oat Extract (72H Moisture)
2. **10% Vitamin C + Glucosamine Face Cream**: Kakadu Plum & Ferulic Acid (Radiance Glow)
3. **Hyaluronic Hydra Surge Gel Face Cream**: 5D Hyaluronic Acid & Birch Water (Water-burst finish)
4. **2% Salicylic + Green Tea Matte Gel Cream**: Time-release BHA (Pore unclogging & oil control)
5. **Multi-Peptide & Retinol Night Recovery Cream**: 0.2% Encapsulated Retinol & Matrixyl 3000
6. **Centella (Cica) Calming Barrier Face Cream**: 70% Centella Asiatica & Allantoin (Redness relief)
7. **SPF 50 PA++++ Invisible Hydrating Day Cream**: Broad-spectrum UV filters with zero white cast
8. **Fermented Rice Water & Niacinamide Cream**: 5% Niacinamide for Glass Skin finish

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context (`CartContext`) with LocalStorage persistence
- **Backend & Integrations (Upcoming)**:
  - MongoDB (Mongoose Schema & Models)
  - Razorpay Payment Gateway
  - Google OAuth Authentication

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18.17+ or v20+) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amit2003-cse/innovist.git
   cd innovist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
invoist/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with viewport & CartProvider
│   │   ├── page.tsx           # Main homepage layout & view orchestration
│   │   └── globals.css        # Tailwind v4 import & strict mobile containment
│   ├── components/
│   │   ├── Header.tsx         # Top 3s banner, logo, typewriter search & icons
│   │   ├── HeroBanner.tsx     # Festive glow staged podium showcase
│   │   ├── CategoryConcernFilter.tsx # Category & concern toggle pills
│   │   ├── ProductCard.tsx    # 2-column mobile face cream card
│   │   ├── FaceCreamJar.tsx   # Responsive SVG jar visualization
│   │   ├── BestSellersSection.tsx # Best seller showcase grid
│   │   ├── BrandsThatLead.tsx # 2x2 branded formulation tiles
│   │   ├── SelfCareShelf.tsx  # Categorized product shelf
│   │   ├── IngredientsSection.tsx # Clinical active ingredients breakdown
│   │   ├── JournalSection.tsx # Skincare journal blog cards & reader modal
│   │   ├── FooterAccordion.tsx# Collapsible footer with payment badges
│   │   ├── CartDrawer.tsx     # Slide-over shopping bag with empty state
│   │   ├── SearchModal.tsx    # Instant live search dialog
│   │   ├── ProductDetailModal.tsx # AM/PM routine & ingredient modal
│   │   ├── Toast.tsx          # Floating action feedback toast
│   │   └── MobileBottomNav.tsx# Mobile bottom app navigation bar
│   ├── context/
│   │   └── CartContext.tsx    # Bag state, quantities, coupon & calculations
│   └── data/
│       └── faceCreams.ts      # Structured product catalog & metadata
├── public/                    # Static assets
├── package.json
└── tsconfig.json
```

---

## 📜 License

This project is created for educational and portfolio demonstration purposes. All rights to brand trademarks and design inspiration belong to **Innovist**.
