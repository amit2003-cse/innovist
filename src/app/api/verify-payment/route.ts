import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json(
        { error: "RAZORPAY_KEY_SECRET is not configured on server" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    // Check for missing fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are all required",
        },
        { status: 400 }
      );
    }

    // STEP 3: Generate expected HMAC-SHA256 signature
    const signaturePayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(signaturePayload)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature. Payment verification failed.",
        },
        { status: 400 }
      );
    }

    // Update the order in database if available
    let updatedOrder = null;
    try {
      await connectToDatabase();
      updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: "paid",
          paymentId: razorpay_payment_id,
        },
        { new: true }
      );
    } catch (dbError) {
      console.warn("DB update during payment verification warning:", dbError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        orderId: updatedOrder?._id?.toString() || razorpay_order_id,
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/verify-payment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to verify payment",
      },
      { status: 500 }
    );
  }
}
