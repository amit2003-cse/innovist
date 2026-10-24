import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface IOrder extends Document {
  userEmail: string;
  userName: string;
  userId?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: "razorpay" | "cod";
  shippingAddress?: {
    fullName?: string;
    email?: string;
    street?: string;
    flatBuilding?: string;
    streetArea?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  };
  trackingNumber?: string;
  courierPartner?: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, default: "50 ml" },
});

const OrderSchema = new Schema<IOrder>(
  {
    userEmail: { type: String, required: true, lowercase: true, index: true },
    userName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      default: "razorpay",
    },
    shippingAddress: {
      fullName: String,
      email: String,
      street: String,
      flatBuilding: String,
      streetArea: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    trackingNumber: { type: String },
    courierPartner: { type: String, default: "Delhivery Express" },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
