export interface FaceCream {
  id: string;
  name: string;
  shortName: string;
  category: "face-wash" | "face-cream";
  concern:
    | "Acne & Clogged Pores"
    | "Dry & Damaged Barrier"
    | "Dullness & Dark Spots"
    | "Fine Lines & Ageing"
    | "Dehydrated Skin"
    | "Redness & Sensitivity";
  subtitle: string;
  size: string;
  price: number;
  originalPrice: number;
  saveAmount: number;
  flatOfferPrice: number;
  rating: number;
  reviewsCount: string;
  isBestSeller: boolean;
  tag?: "Best Seller" | "Trending" | "Aqua";
  tagColor?: string;
  productType: "tube" | "jar";
  benefits: string[];
  keyIngredients: string[];
  keyIngredientSummary: string;
  skinType: string;
  howToUse: {
    am: string;
    pm: string;
  };
  texture: string;
  accentColor: string;
  badgeBg: string;
  jarColor: string;
}

export const FACE_CREAMS: FaceCream[] = [
  // 1. 2% Salicylic Acid Face Wash (Exact from Screenshot 1)
  {
    id: "salicylic-acid-face-wash",
    name: "2% Salicylic Acid Face Wash",
    shortName: "Salicylic Face Wash",
    category: "face-wash",
    concern: "Acne & Clogged Pores",
    subtitle: "for Acne & Oil Control - 100 ml",
    size: "100 ml",
    price: 254,
    originalPrice: 299,
    saveAmount: 45,
    flatOfferPrice: 166,
    rating: 4.8,
    reviewsCount: "652 Reviews",
    isBestSeller: true,
    tag: "Best Seller",
    productType: "tube",
    benefits: [
      "Fades Acne & Acne Marks",
      "Removes Excess Oil & Dirt",
      "Controls Excess Oil Production",
    ],
    keyIngredients: ["2% Salicylic Acid (BHA)", "Green Tea Extract", "Zinc PCA"],
    keyIngredientSummary: "Time-release 2% BHA clears clogged sebum deep within pores.",
    skinType: "Oily, Acne-Prone & Combination Skin",
    howToUse: {
      am: "Lather a dime-sized amount with water, gently massage in circular motions for 60 seconds, then rinse.",
      pm: "Use as step 1 in your evening double-cleanse routine to wash away pollution and SPF.",
    },
    texture: "Purifying clear gel with micro-foaming lather",
    accentColor: "from-rose-50 to-red-100",
    badgeBg: "bg-red-700",
    jarColor: "#B91C1C",
  },

  // 2. Gentle Exfoliating Face Scrub & Wash (Exact from Screenshot 1)
  {
    id: "exfoliating-face-scrub",
    name: "Gentle Exfoliating Face Scrub",
    shortName: "Exfoliating Scrub",
    category: "face-wash",
    concern: "Dullness & Dark Spots",
    subtitle: "for Blackheads & Tan Removal - 100 ml",
    size: "100 ml",
    price: 297,
    originalPrice: 349,
    saveAmount: 52,
    flatOfferPrice: 202,
    rating: 4.9,
    reviewsCount: "897 Reviews",
    isBestSeller: true,
    tag: "Best Seller",
    productType: "tube",
    benefits: [
      "Fades Tan & Sun Spots",
      "Removes Blackheads & Impurities",
      "Improves Uneven Skin Tone",
    ],
    keyIngredients: ["Cellulose Micro-Spheres", "2% Lactic Acid (AHA)", "Walnut-Free Base"],
    keyIngredientSummary: "Non-abrasive natural micro-exfoliants dissolve dead keratin cells.",
    skinType: "All Skin Types & Sun-Damaged Skin",
    howToUse: {
      am: "Gently buff over damp forehead, nose and chin 2-3 times weekly.",
      pm: "Follow with Ceramide Face Cream to replenish cellular lipids.",
    },
    texture: "Creamy whipped cleanser with ultra-fine melting beads",
    accentColor: "from-amber-50 to-orange-100",
    badgeBg: "bg-amber-600",
    jarColor: "#EA580C",
  },

  // 3. Ceramide Hydrating Gentle Face Wash
  {
    id: "ceramide-hydrating-face-wash",
    name: "Ceramide Hydrating Barrier Face Wash",
    shortName: "Ceramide Face Wash",
    category: "face-wash",
    concern: "Dry & Damaged Barrier",
    subtitle: "with 1% Hyaluronic Acid & Oat Extract - 100 ml",
    size: "100 ml",
    price: 269,
    originalPrice: 329,
    saveAmount: 60,
    flatOfferPrice: 189,
    rating: 4.8,
    reviewsCount: "1.2K Reviews",
    isBestSeller: false,
    tag: "Aqua",
    productType: "tube",
    benefits: [
      "Repairs Skin Moisture Barrier",
      "Non-Stripping Gentle Cleanse",
      "24H Hydration & pH Balanced",
    ],
    keyIngredients: ["5x Skin-Identical Ceramides", "1% Hyaluronic Acid", "Colloidal Oat"],
    keyIngredientSummary: "Sulfate-free lotion wash protects natural skin lipid matrix.",
    skinType: "Dry, Compromised & Flaking Skin",
    howToUse: {
      am: "Massage onto dry or wet face, rinse gently with lukewarm water.",
      pm: "Perfect calming cleanse after outdoor environmental exposure.",
    },
    texture: "Milky lotion emulsion with zero foam tightness",
    accentColor: "from-sky-50 to-cyan-100",
    badgeBg: "bg-sky-800",
    jarColor: "#0284C7",
  },

  // 4. 10% Vitamin C Radiance Face Wash
  {
    id: "vitamin-c-radiance-face-wash",
    name: "10% Vitamin C Radiance Face Wash",
    shortName: "Vitamin C Face Wash",
    category: "face-wash",
    concern: "Dullness & Dark Spots",
    subtitle: "with 2% Glucosamine for Glowing Skin - 100 ml",
    size: "100 ml",
    price: 279,
    originalPrice: 349,
    saveAmount: 70,
    flatOfferPrice: 198,
    rating: 4.7,
    reviewsCount: "573 Reviews",
    isBestSeller: false,
    tag: "Trending",
    productType: "tube",
    benefits: [
      "Reduces Melanin Production by 2.5x",
      "Fades Dark Spots & Hyperpigmentation",
      "Brightens Dull & Tired Skin",
    ],
    keyIngredients: ["10% 3-O-Ethyl Ascorbic Acid", "2% Acetyl Glucosamine", "Kakadu Plum"],
    keyIngredientSummary: "Gold-standard non-oxidizing Vitamin C boosts radiant clarity.",
    skinType: "Dull, Uneven & Hyperpigmented Skin",
    howToUse: {
      am: "Start your morning radiance ritual with a 60-second gentle wash.",
      pm: "Rinses away dulling surface oxidation before nightly serums.",
    },
    texture: "Zesty citrus water-gel with gentle cloud lather",
    accentColor: "from-yellow-50 to-amber-100",
    badgeBg: "bg-amber-500",
    jarColor: "#EAB308",
  },

  // 5. 0.1% Retinol Night Cream (Exact from Screenshot 2!)
  {
    id: "retinol-night-face-cream",
    name: "0.1% Retinol Night Cream with Aloe Vera",
    shortName: "Retinol Night Cream",
    category: "face-cream",
    concern: "Fine Lines & Ageing",
    subtitle: "For Fine Lines & Wrinkles - 30 gm",
    size: "30 gm",
    price: 449,
    originalPrice: 599,
    saveAmount: 150,
    flatOfferPrice: 332,
    rating: 4.6,
    reviewsCount: "135 Reviews",
    isBestSeller: false,
    tag: "Trending",
    productType: "tube",
    benefits: [
      "Reduces Fine Lines & Wrinkles",
      "Stimulates Cellular Collagen Renewal",
      "Aloe Vera Deep Hydration Base",
    ],
    keyIngredients: ["0.1% Pure Encapsulated Retinol", "Aloe Barbadensis Leaf Juice", "Matrixyl 3000"],
    keyIngredientSummary: "Time-released micro-encapsulated retinol minimizes irritation while smoothing wrinkles.",
    skinType: "Normal, Combination & Mature Skin",
    howToUse: {
      am: "Not recommended for AM use. Always apply SPF 50 the next morning.",
      pm: "Apply a pea-sized amount onto clean, dry skin after evening serums. Use 2-3 nights weekly.",
    },
    texture: "Silky pink velvet cream that melts weightlessly into skin",
    accentColor: "from-pink-50 to-fuchsia-100",
    badgeBg: "bg-fuchsia-600",
    jarColor: "#D946EF",
  },

  // 6. Ceramide Barrier Relief Face Cream
  {
    id: "ceramide-barrier-cream",
    name: "Ceramide Barrier Relief Face Cream",
    shortName: "Ceramide Barrier Cream",
    category: "face-cream",
    concern: "Dry & Damaged Barrier",
    subtitle: "with 5x Skin-Identical Ceramides & Oat - 50 ml",
    size: "50 ml",
    price: 399,
    originalPrice: 499,
    saveAmount: 100,
    flatOfferPrice: 289,
    rating: 4.9,
    reviewsCount: "3.2K Reviews",
    isBestSeller: true,
    tag: "Best Seller",
    productType: "jar",
    benefits: [
      "72H Moisture Barrier Lock",
      "Calms Redness & Flaking Irritation",
      "Lightweight Non-Greasy Finish",
    ],
    keyIngredients: ["5x Bio-Ceramides (NP, AP, EOP, NS, AS)", "Colloidal Oatmeal", "Phospholipids"],
    keyIngredientSummary: "Replenishes exact 3:1:1 physiological lipid ratio to seal moisture gaps.",
    skinType: "Very Dry, Flaky, Compromised Barrier",
    howToUse: {
      am: "Apply a nickel-sized amount as the last step before sunscreen.",
      pm: "Warm between fingertips and press into skin for overnight barrier recovery.",
    },
    texture: "Rich buttery cream that absorbs cleanly without sticky sheen",
    accentColor: "from-amber-50 to-orange-100",
    badgeBg: "bg-amber-700",
    jarColor: "#D97706",
  },

  // 7. 5D Hyaluronic Hydra Surge Gel Face Cream
  {
    id: "hyaluronic-hydra-gel",
    name: "5D Hyaluronic Hydra Surge Gel Face Cream",
    shortName: "Hyaluronic Hydra Gel",
    category: "face-cream",
    concern: "Dehydrated Skin",
    subtitle: "with Birch Water for Dehydrated Skin - 50 ml",
    size: "50 ml",
    price: 379,
    originalPrice: 499,
    saveAmount: 120,
    flatOfferPrice: 272,
    rating: 4.8,
    reviewsCount: "2.1K Reviews",
    isBestSeller: false,
    tag: "Aqua",
    productType: "jar",
    benefits: [
      "100H Instant Water-Burst Plumping",
      "Oil-Free Cooling Gel Texture",
      "Clinically Restores Skin Elasticity",
    ],
    keyIngredients: ["5D Multi-Molecular Hyaluronic Acid", "Birch Sap Water", "Polyglutamic Acid"],
    keyIngredientSummary: "5 molecular weights of Hyaluronic Acid quench all 5 layers of the epidermis.",
    skinType: "Dehydrated, Oily, Combination & Humid Climates",
    howToUse: {
      am: "Smooth over damp face for an all-day water-burst bounce.",
      pm: "Layer generously as an overnight sleeping hydra mask.",
    },
    texture: "Weightless aquamarine water-gel with instant cooling sensation",
    accentColor: "from-sky-50 to-blue-100",
    badgeBg: "bg-sky-800",
    jarColor: "#0284C7",
  },

  // 8. 2% Salicylic Acid Matte Gel Face Cream
  {
    id: "salicylic-matte-gel-cream",
    name: "2% Salicylic Acid Matte Gel Face Cream",
    shortName: "Salicylic Matte Cream",
    category: "face-cream",
    concern: "Acne & Clogged Pores",
    subtitle: "for Acne Prone & Oily Skin - 50 ml",
    size: "50 ml",
    price: 359,
    originalPrice: 449,
    saveAmount: 90,
    flatOfferPrice: 259,
    rating: 4.7,
    reviewsCount: "850 Reviews",
    isBestSeller: true,
    tag: "Best Seller",
    productType: "jar",
    benefits: [
      "Unclogs Congested Pores",
      "Controls Excess Sebum & Shine",
      "Calms Active Acne Lesions",
    ],
    keyIngredients: ["2% Encapsulated Salicylic Acid", "Green Tea Epigallocatechin", "Zinc PCA"],
    keyIngredientSummary: "Lipid-soluble BHA dissolves pore-clogging plugs while zinc inhibits acne bacteria.",
    skinType: "Active Breakouts, Open Pores & Excess Sebum",
    howToUse: {
      am: "Dot on T-zone and oily patches for an all-day velvet-matte finish.",
      pm: "Apply all over face to prevent overnight sebum buildup.",
    },
    texture: "Translucent green quick-break matte gel",
    accentColor: "from-emerald-50 to-teal-100",
    badgeBg: "bg-emerald-700",
    jarColor: "#059669",
  },

  // 9. 10% Vitamin C + Glucosamine Face Cream
  {
    id: "vitamin-c-glow-cream",
    name: "10% Vitamin C + Glucosamine Face Cream",
    shortName: "Vitamin C Face Cream",
    category: "face-cream",
    concern: "Dullness & Dark Spots",
    subtitle: "with Kakadu Plum & Ferulic Acid - 50 ml",
    size: "50 ml",
    price: 419,
    originalPrice: 549,
    saveAmount: 130,
    flatOfferPrice: 299,
    rating: 4.8,
    reviewsCount: "1.5K Reviews",
    isBestSeller: true,
    tag: "Best Seller",
    productType: "jar",
    benefits: [
      "Fades Stubborn Dark Spots",
      "Boosts Skin Radiance & Glow",
      "Potent Antioxidant Daily Shield",
    ],
    keyIngredients: ["10% 3-O-Ethyl Ascorbic Acid", "1% Acetyl Glucosamine", "Australian Kakadu Plum"],
    keyIngredientSummary: "Synergistic antioxidant complex fades post-acne marks and inhibits tyrosinase.",
    skinType: "Hyperpigmented, Sun-Tanned, Uneven Skin Tone",
    howToUse: {
      am: "Massage into face & neck before sunscreen for 2x antioxidant photo-protection.",
      pm: "Use nightly after cleansing to accelerate cellular radiance renewal.",
    },
    texture: "Whipped golden citrus soufflé with a velvety radiant finish",
    accentColor: "from-yellow-50 to-amber-100",
    badgeBg: "bg-amber-600",
    jarColor: "#EAB308",
  },

  // 10. Centella (Cica 70%) Calming Barrier Face Cream
  {
    id: "centella-calming-cream",
    name: "Centella (Cica 70%) Calming Face Cream",
    shortName: "Centella Calming Cream",
    category: "face-cream",
    concern: "Redness & Sensitivity",
    subtitle: "with Allantoin for Sensitive & Red Skin - 50 ml",
    size: "50 ml",
    price: 429,
    originalPrice: 549,
    saveAmount: 120,
    flatOfferPrice: 309,
    rating: 4.8,
    reviewsCount: "620 Reviews",
    isBestSeller: false,
    tag: "Trending",
    productType: "jar",
    benefits: [
      "Reduces Redness & Flush by 62%",
      "Repairs Compromised Skin Barrier",
      "Zero Fragrance Hypoallergenic Base",
    ],
    keyIngredients: ["70% Centella Asiatica Extract", "Madecassoside", "Allantoin"],
    keyIngredientSummary: "Clinical Asiaticoside soothes reactive mast cells and lowers visible capillary flushing.",
    skinType: "Reactive, Rosacea-Prone & Irritated Skin",
    howToUse: {
      am: "Pat onto flushed cheeks and irritated zones for instant cooling comfort.",
      pm: "Layer generously after clinical exfoliants or peeling treatments.",
    },
    texture: "Balm-to-cream soothing cushion with zero stinging",
    accentColor: "from-emerald-50 to-green-100",
    badgeBg: "bg-emerald-600",
    jarColor: "#10B981",
  },
];

export const CATEGORIES = [
  { id: "all", name: "All Formulations", icon: "✨" },
  { id: "face-wash", name: "Face Wash", icon: "🧼" },
  { id: "face-cream", name: "Face Cream", icon: "🧴" },
];

export const CONCERNS = [
  { id: "Acne & Clogged Pores", name: "Acne & Pores", icon: "🌱" },
  { id: "Dry & Damaged Barrier", name: "Dryness & Barrier", icon: "🧴" },
  { id: "Dullness & Dark Spots", name: "Dullness & Dark Spots", icon: "✨" },
  { id: "Fine Lines & Ageing", name: "Ageing & Wrinkles", icon: "⏳" },
  { id: "Dehydrated Skin", name: "Oil-Free Hydration", icon: "💦" },
  { id: "Redness & Sensitivity", name: "Redness & Sensitivity", icon: "🌸" },
];

export const FORMULATION_COLLECTIONS = [
  {
    id: "face-wash-lab",
    name: "PURIFYING FACE WASH LAB",
    categoryLabel: "DEEP PORE CLEANSE",
    description: "Salicylic, Vitamin C & Ceramide gentle foaming face washes.",
    highlightProduct: "2% Salicylic Acid Face Wash",
    bgGradient: "from-red-50 to-rose-100",
    tagColor: "text-red-900 bg-red-100",
  },
  {
    id: "face-cream-lab",
    name: "BARRIER FACE CREAM LAB",
    categoryLabel: "MOISTURE SCIENCE",
    description: "Clinically proven Retinol, Ceramide & Hyaluronic daily creams.",
    highlightProduct: "0.1% Retinol Night Cream with Aloe Vera",
    bgGradient: "from-pink-50 to-fuchsia-100",
    tagColor: "text-fuchsia-900 bg-fuchsia-100",
  },
];

export const INGREDIENT_HIGHLIGHTS = [
  {
    name: "2% Salicylic Acid (BHA)",
    role: "Deep Pore Unclogging",
    desc: "Oil-soluble acid penetrates deep into sebaceous glands to eliminate blackheads.",
    icon: "🔬",
    color: "bg-red-50 border-red-200 text-red-900",
  },
  {
    name: "0.1% Encapsulated Retinol",
    role: "Cellular Collagen Synthesis",
    desc: "Gentle time-release retinol stimulates epidermal turnover without flaking.",
    icon: "🌸",
    color: "bg-pink-50 border-pink-200 text-pink-900",
  },
  {
    name: "5x Bio-Ceramides",
    role: "Lipid Barrier Sealing",
    desc: "Identical to human skin lipids to seal moisture and prevent TEWL.",
    icon: "🛡️",
    color: "bg-amber-50 border-amber-200 text-amber-900",
  },
  {
    name: "5D Hyaluronic Multi-Weight",
    role: "Intra-Cellular Water Plumping",
    desc: "Holds up to 1000x its weight in water deep within the dermal layers.",
    icon: "💧",
    color: "bg-sky-50 border-sky-200 text-sky-900",
  },
];

export const JOURNAL_ARTICLES = [
  {
    id: "cleanser-vs-cream",
    title: "Double-Cleanse Ritual: Why Pairing a Salicylic Wash with Ceramide Cream Clears Acne",
    excerpt: "The science of pH-balanced cleansing without stripping the vital acid mantle...",
    author: "Dr. Payodhi Chaturvedi",
    role: "Consultant Dermatologist",
    date: "24 Oct 2026",
    readTime: "4 min read",
    tag: "Clinical Routine",
  },
  {
    id: "retinol-night-routine",
    title: "How to Incorporate 0.1% Retinol Night Cream for Maximum Anti-Ageing Results",
    excerpt: "Step-by-step derm guide on layering soothing Aloe Vera with micro-retinol...",
    author: "Dr. Ananya Sen",
    role: "Formulation Scientist",
    date: "22 Oct 2026",
    readTime: "5 min read",
    tag: "Expert Guide",
  },
];
