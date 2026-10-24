import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  productId: string;
  name: string;
  shortName: string;
  category: "face-wash" | "face-cream";
  concern: string;
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
  productType: "tube" | "jar";
  benefits: string[];
  keyIngredients: string[];
  keyIngredientSummary: string;
  skinType: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    productId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    category: { type: String, required: true, enum: ["face-wash", "face-cream"], index: true },
    concern: { type: String, required: true, index: true },
    subtitle: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    saveAmount: { type: Number, default: 0 },
    flatOfferPrice: { type: Number, required: true },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: String, default: "500+ Reviews" },
    isBestSeller: { type: Boolean, default: false },
    tag: { type: String },
    productType: { type: String, enum: ["tube", "jar"], default: "tube" },
    benefits: [{ type: String }],
    keyIngredients: [{ type: String }],
    keyIngredientSummary: { type: String },
    skinType: { type: String },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
