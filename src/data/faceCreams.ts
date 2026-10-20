export interface FaceCream {
  id: string;
  name: string;
  shortName: string;
  category: "barrier" | "brightening" | "hydra" | "anti-acne" | "night-repair" | "sun-cream";
  concern: "Dry & Damaged Barrier" | "Dullness & Dark Spots" | "Dehydrated Skin" | "Acne & Clogged Pores" | "Fine Lines & Ageing" | "Redness & Sensitivity";
  subtitle: string;
  size: string;
  price: number;
  originalPrice: number;
  saveAmount: number;
  flatOfferPrice: number;
  rating: number;
  reviewsCount: string;
  isBestSeller: boolean;
  tag?: string;
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
  {
    id: "ceramide-barrier-cream",
    name: "Ceramide Barrier Relief Face Cream",
    shortName: "Ceramide Barrier Cream",
    category: "barrier",
    concern: "Dry & Damaged Barrier",
    subtitle: "5x Skin-Identical Ceramides & Oat Extract - 50 ml",
    size: "50 ml",
    price: 449,
    originalPrice: 599,
    saveAmount: 150,
    flatOfferPrice: 359,
    rating: 4.8,
    reviewsCount: "1.4K Reviews",
    isBestSeller: true,
    tag: "Best Seller",
    benefits: [
      "72-Hour Deep Barrier Moisture",
      "Restores Compromised Lipid Layer",
      "Non-Greasy Whipped Texture"
    ],
    keyIngredients: ["Ceramide NP, AP, EOP", "Colloidal Oat", "Centella Asiatica", "Cholesterol"],
    keyIngredientSummary: "Skin-identical lipid matrix that seals microscopic barrier cracks",
    skinType: "Dry, Compromised, Sensitive & Normal Skin",
    howToUse: {
      am: "Apply a pea-sized amount after cleanser and serum. Follow with SPF.",
      pm: "Gently press 2 pumps onto face and neck as the final sealing step."
    },
    texture: "Rich velvety whipped soufflé that absorbs instantly",
    accentColor: "from-amber-100 to-orange-50",
    badgeBg: "bg-rose-600",
    jarColor: "#F59E0B"
  },
  {
    id: "vit-c-radiance-cream",
    name: "10% Vitamin C + Glucosamine Face Cream",
    shortName: "10% Vitamin C Glow Cream",
    category: "brightening",
    concern: "Dullness & Dark Spots",
    subtitle: "Kakadu Plum, Acetyl Glucosamine & Ferulic - 50 ml",
    size: "50 ml",
    price: 499,
    originalPrice: 649,
    saveAmount: 150,
    flatOfferPrice: 399,
    rating: 4.9,
    reviewsCount: "890 Reviews",
    isBestSeller: true,
    tag: "Top Rated",
    benefits: [
      "Fades Dark Spots & Sun Damage",
      "Noticeable Glow in 14 Days",
      "Boosts Collagen & Firmness"
    ],
    keyIngredients: ["10% 3-O-Ethyl Ascorbic Acid", "Acetyl Glucosamine", "Kakadu Plum", "Ferulic Acid"],
    keyIngredientSummary: "Ultra-stable clinical Vitamin C that doesn't oxidize or sting",
    skinType: "Dull, Uneven Skin & Hyperpigmentation",
    howToUse: {
      am: "Ideal morning cream. Apply evenly before mineral/chemical sunscreen.",
      pm: "Can be alternated with hydrating barrier creams."
    },
    texture: "Lightweight citrus-infused sorbet cream",
    accentColor: "from-amber-100 to-yellow-50",
    badgeBg: "bg-amber-600",
    jarColor: "#EAB308"
  },
  {
    id: "hyalu-hydra-gel-cream",
    name: "Hyaluronic Hydra Surge Gel Face Cream",
    shortName: "Hyaluronic Hydra Water Gel",
    category: "hydra",
    concern: "Dehydrated Skin",
    subtitle: "Multi-Molecular Hyaluronic & Birch Water - 50 g",
    size: "50 g",
    price: 399,
    originalPrice: 549,
    saveAmount: 150,
    flatOfferPrice: 319,
    rating: 4.7,
    reviewsCount: "1.2K Reviews",
    isBestSeller: true,
    tag: "Fan Favorite",
    benefits: [
      "100-Hour Oil-Free Water Burst",
      "Instantly Plumps Fine Dehydration Lines",
      "Zero Pore-Clogging Feel"
    ],
    keyIngredients: ["5D Hyaluronic Acid", "Birch Sap Juice", "Panthenol (B5)", "Polyglutamic Acid"],
    keyIngredientSummary: "Multi-depth hydration matrix that pulls moisture 5 layers deep",
    skinType: "Oily, Combination & Dehydrated Skin",
    howToUse: {
      am: "Massage onto damp skin for an instant refreshing burst.",
      pm: "Layer under sleeping mask or use solo for glass-like finish."
    },
    texture: "Translucent cloud water-burst gel",
    accentColor: "from-sky-100 to-blue-50",
    badgeBg: "bg-sky-600",
    jarColor: "#0EA5E9"
  },
  {
    id: "salicylic-blemish-cream",
    name: "2% Salicylic + Green Tea Matte Gel Cream",
    shortName: "2% Salicylic Blemish Cream",
    category: "anti-acne",
    concern: "Acne & Clogged Pores",
    subtitle: "Micro-encapsulated BHA & Zinc PCA - 50 ml",
    size: "50 ml",
    price: 429,
    originalPrice: 579,
    saveAmount: 150,
    flatOfferPrice: 343,
    rating: 4.8,
    reviewsCount: "940 Reviews",
    isBestSeller: false,
    tag: "Dermat Tested",
    benefits: [
      "Clears Active Blemishes & Whiteheads",
      "8-Hour Oil-Control Matte Finish",
      "Calms Redness & Post-Acne Marks"
    ],
    keyIngredients: ["2% Pure Salicylic Acid", "Zinc PCA", "Organic Green Tea Extract", "Niacinamide 2%"],
    keyIngredientSummary: "Time-release BHA gently unclogs pores without flaking or dryness",
    skinType: "Acne-prone, Oily & Reactive Skin",
    howToUse: {
      am: "Dot on T-zone or entire face after cleansing.",
      pm: "Use as primary night treatment on breakout zones."
    },
    texture: "Refreshing non-comedogenic matte gel lotion",
    accentColor: "from-emerald-100 to-teal-50",
    badgeBg: "bg-emerald-600",
    jarColor: "#10B981"
  },
  {
    id: "retinol-peptide-night-cream",
    name: "Multi-Peptide & Retinol Night Recovery Cream",
    shortName: "Peptide & Retinol Night Cream",
    category: "night-repair",
    concern: "Fine Lines & Ageing",
    subtitle: "0.2% Encapsulated Retinol & Matrixyl 3000 - 50 ml",
    size: "50 ml",
    price: 599,
    originalPrice: 799,
    saveAmount: 200,
    flatOfferPrice: 479,
    rating: 4.9,
    reviewsCount: "2.1K Reviews",
    isBestSeller: true,
    tag: "Anti-Ageing Winner",
    benefits: [
      "Visibly Smooths Crow's Feet & Lines",
      "Stimulates Overnight Cellular Renewal",
      "Strengthens Skin Density & Elasticity"
    ],
    keyIngredients: ["Encapsulated Retinol 0.2%", "Copper Tripeptide-1", "Matrixyl Synthe'6", "Bakuchiol"],
    keyIngredientSummary: "Buffered encapsulated retinol that bypasses the irritation phase",
    skinType: "Mature, Aging, Normal & Dull Skin",
    howToUse: {
      am: "Do not use in AM. Always wear SPF the following morning.",
      pm: "Warm between fingertips and gently press into face and neck before sleep."
    },
    texture: "Decadent cocooning night elixir cream",
    accentColor: "from-purple-100 to-indigo-50",
    badgeBg: "bg-purple-700",
    jarColor: "#8B5CF6"
  },
  {
    id: "cica-calming-relief-cream",
    name: "Centella (Cica) Calming Barrier Face Cream",
    shortName: "Cica Calming Relief Cream",
    category: "barrier",
    concern: "Redness & Sensitivity",
    subtitle: "70% Centella Asiatica & Allantoin - 50 ml",
    size: "50 ml",
    price: 459,
    originalPrice: 599,
    saveAmount: 140,
    flatOfferPrice: 367,
    rating: 4.8,
    reviewsCount: "680 Reviews",
    isBestSeller: false,
    tag: "Hypoallergenic",
    benefits: [
      "Instantly Calms Itchiness & Heat Flushes",
      "Reduces Facial Redness by 62%",
      "Safe for Eczema & Rosacea Prone Skin"
    ],
    keyIngredients: ["Madecassoside", "Centella Extract 70%", "Allantoin", "Squalane"],
    keyIngredientSummary: "Korean cica complex specifically formulated to soothe heated inflammation",
    skinType: "Ultra-sensitive, Flushed & Rosacea-prone Skin",
    howToUse: {
      am: "Apply generously whenever skin feels irritated, dry or sensitized.",
      pm: "Reapply an extra layer over cheekbones and sensitized patches."
    },
    texture: "Soft cooling herbal balm-cream",
    accentColor: "from-lime-100 to-emerald-50",
    badgeBg: "bg-emerald-700",
    jarColor: "#059669"
  },
  {
    id: "spf50-hydra-day-cream",
    name: "SPF 50 PA++++ Invisible Hydrating Day Cream",
    shortName: "SPF 50 Hydra Day Face Cream",
    category: "sun-cream",
    concern: "Dullness & Dark Spots",
    subtitle: "UVA/UVB Broad Spectrum & Hyaluronic Acid - 50 g",
    size: "50 g",
    price: 499,
    originalPrice: 649,
    saveAmount: 150,
    flatOfferPrice: 399,
    rating: 4.9,
    reviewsCount: "3.2K Reviews",
    isBestSeller: true,
    tag: "Sunscreen + Cream",
    benefits: [
      "Zero White Cast & Lightweight Absorbing",
      "12-Hour Moisture + SPF 50 Defense",
      "Blue Light & Pollution Shield"
    ],
    keyIngredients: ["Tinosorb M & S", "Hyaluronic Acid", "Niacinamide 2%", "Vitamin E"],
    keyIngredientSummary: "New-generation hybrid sun filters wrapped in a dewy face cream base",
    skinType: "All Skin Types, Perfectly Primes Under Makeup",
    howToUse: {
      am: "Use as your 2-in-1 morning moisturizer and sunscreen. Reapply every 3-4 hours outdoors.",
      pm: "Wash off with evening cleanser."
    },
    texture: "Effortless fluid lotion with a soft natural glow finish",
    accentColor: "from-amber-100 to-orange-50",
    badgeBg: "bg-amber-500",
    jarColor: "#F59E0B"
  },
  {
    id: "rice-water-niacinamide-cream",
    name: "Fermented Rice Water & Niacinamide Cream",
    shortName: "Rice Water Glass Skin Cream",
    category: "brightening",
    concern: "Dullness & Dark Spots",
    subtitle: "5% Niacinamide & Fermented Rice Broth - 50 ml",
    size: "50 ml",
    price: 439,
    originalPrice: 569,
    saveAmount: 130,
    flatOfferPrice: 351,
    rating: 4.7,
    reviewsCount: "810 Reviews",
    isBestSeller: false,
    tag: "Glass Skin",
    benefits: [
      "Delivers Luminous Glass-Skin Radiance",
      "Minimizes Enlarged Skin Pores",
      "Evens Out Stubborn Blotchy Discoloration"
    ],
    keyIngredients: ["Fermented Rice Water", "5% Pure Niacinamide", "Licorice Root Extract", "Arbutin"],
    keyIngredientSummary: "Natural amino acids and rice ceramides that refine rough texture",
    skinType: "Combination, Normal & Uneven Texture Skin",
    howToUse: {
      am: "Pat onto face and neck until fully absorbed.",
      pm: "Generously massage in circular motions."
    },
    texture: "Silky milky pudding cream",
    accentColor: "from-rose-100 to-pink-50",
    badgeBg: "bg-pink-600",
    jarColor: "#EC4899"
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Creams", icon: "✨" },
  { id: "barrier", name: "Barrier Creams", icon: "🛡️" },
  { id: "brightening", name: "Brightening (Vit C)", icon: "🍊" },
  { id: "hydra", name: "Hydra Water Gel", icon: "💧" },
  { id: "anti-acne", name: "Anti-Acne Blemish", icon: "🌿" },
  { id: "night-repair", name: "Night Renewal", icon: "🌙" },
  { id: "sun-cream", name: "Day Creams (SPF)", icon: "☀️" },
];

export const CONCERNS = [
  { id: "Dry & Damaged Barrier", name: "Dryness & Barrier", icon: "🧴" },
  { id: "Dullness & Dark Spots", name: "Dullness & Dark Spots", icon: "✨" },
  { id: "Dehydrated Skin", name: "Oil-Free Hydration", icon: "💦" },
  { id: "Acne & Clogged Pores", name: "Acne & Pores", icon: "🌱" },
  { id: "Fine Lines & Ageing", name: "Ageing & Elasticity", icon: "⏳" },
  { id: "Redness & Sensitivity", name: "Redness & Irritation", icon: "🌸" },
];

export const FORMULATION_COLLECTIONS = [
  {
    id: "ceramide-lab",
    name: "CERAMIDE LAB",
    categoryLabel: "BARRIER SCIENCE",
    description: "Multi-ceramide complexes to heal damaged skin moisture barriers.",
    highlightProduct: "Ceramide Barrier Relief Face Cream",
    bgGradient: "from-amber-50 to-orange-100",
    tagColor: "text-amber-800 bg-amber-100",
  },
  {
    id: "glow-chemist",
    name: "CHEMIST GLOW",
    categoryLabel: "CLINICAL BRIGHTENING",
    description: "Potent ethyl-ascorbic acid and ferulic acid face creams for radiance.",
    highlightProduct: "10% Vitamin C Radiance Cream",
    bgGradient: "from-purple-50 to-pink-100",
    tagColor: "text-purple-800 bg-purple-100",
  },
  {
    id: "hydra-surge",
    name: "SUN & SHIELD",
    categoryLabel: "DAILY SUN PROTECT",
    description: "Broad-spectrum SPF 50 face cream moisturizers with invisible finish.",
    highlightProduct: "SPF 50 Invisible Day Face Cream",
    bgGradient: "from-yellow-50 to-amber-100",
    tagColor: "text-amber-900 bg-yellow-200",
  },
  {
    id: "night-matrix",
    name: "DERMA NOCTURNE",
    categoryLabel: "CELLULAR REPAIR",
    description: "Micro-encapsulated peptides & bio-retinols working overnight.",
    highlightProduct: "Multi-Peptide & Retinol Night Cream",
    bgGradient: "from-slate-900 to-zinc-800",
    textColor: "text-white",
    tagColor: "text-zinc-200 bg-zinc-800 border border-zinc-700",
  }
];

export const INGREDIENT_HIGHLIGHTS = [
  {
    name: "5x Bio-Ceramides",
    role: "Lipid Matrix Reconstruction",
    desc: "Clinically seals moisture & strengthens the outer stratum corneum layer.",
    icon: "🔬",
    color: "bg-amber-50 border-amber-200 text-amber-900"
  },
  {
    name: "10% Pure 3-O-Ethyl Ascorbic",
    role: "Deep Melanin Inhibitor",
    desc: "Non-oxidizing, gold-standard Vitamin C derivative for luminous glass skin.",
    icon: "🍊",
    color: "bg-yellow-50 border-yellow-200 text-yellow-900"
  },
  {
    name: "5D Hyaluronic Multi-Weight",
    role: "Intra-Cellular Water Plumping",
    desc: "Pulls up to 1000x its weight in water deep into lower dermis layers.",
    icon: "💧",
    color: "bg-sky-50 border-sky-200 text-sky-900"
  },
  {
    name: "Centella Asiatica (Cica 70%)",
    role: "Instant Calming & Anti-Flushing",
    desc: "Soothes irritated mast cells and lowers visible redness by 62%.",
    icon: "🌿",
    color: "bg-emerald-50 border-emerald-200 text-emerald-900"
  }
];

export const JOURNAL_ARTICLES = [
  {
    id: "cream-vs-gel",
    title: "How to Pick the Right Face Cream for Your Skin: Rich Cream vs Hydra Gel",
    excerpt: "Understand your skin lipid profile. Why heavy creams can trigger breakout-prone skin and when a water gel is superior...",
    author: "Dr. Payodhi Chaturvedi",
    role: "Consultant Dermatologist",
    date: "19 Oct 2026",
    readTime: "4 min read",
    tag: "Expert Guide"
  },
  {
    id: "layering-retinol-peptides",
    title: "Can You Layer Niacinamide Face Cream with Retinol Night Formulations?",
    excerpt: "The science of pH-dependent active layering. How bio-compatible moisturizers eliminate retinol peeling and flaking...",
    author: "Dr. Ananya Sen",
    role: "Formulation Scientist",
    date: "17 Oct 2026",
    readTime: "6 min read",
    tag: "Science Talk"
  }
];
