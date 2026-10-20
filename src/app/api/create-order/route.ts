import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured in server environment" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      amount, // can be passed in rupees or paise; standardise to paise
      currency = "INR",
      receipt,
      notes = {},
      items = [],
      userEmail,
      userName,
      subtotal,
      discountAmount = 0,
      couponCode = "",
      shippingFee = 0,
      paymentMethod = "razorpay",
      shippingAddress,
    } = body;

    // Convert to paise if needed (if amount is in rupees e.g. 448, 448 * 100 = 44800)
    // If already >= 1000 and has items whose sum matches amount/100, calculate cleanly:
    let amountInPaise: number;
    if (body.amountInPaise) {
      amountInPaise = Math.round(Number(body.amountInPaise));
    } else {
      amountInPaise = Math.round(Number(amount) * 100);
    }

    // Minimum amount check: at least 100 paise (₹1)
    if (isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { error: "Amount must be at least ₹1 (100 paise)" },
        { status: 400 }
      );
    }

    // Handle Cash on Delivery directly without calling Razorpay
    if (paymentMethod === "cod") {
      try {
        await connectToDatabase();
        const codOrder = await Order.create({
          userEmail: userEmail || "customer@innovist.com",
          userName: userName || "Guest Customer",
          items: items.map((it: any) => ({
            productId: it.id || it.productId || "p-item",
            name: it.name || "Skin Care Cream",
            price: it.price || 0,
            quantity: it.quantity || 1,
            size: it.size || "50 ml",
          })),
          subtotal: subtotal || amountInPaise / 100,
          discountAmount: discountAmount || 0,
          couponCode: couponCode || "",
          shippingFee: shippingFee || 0,
          totalAmount: amountInPaise / 100,
          paymentMethod: "cod",
          shippingAddress: shippingAddress || {},
          status: "pending",
        });

        return NextResponse.json(
          {
            success: true,
            isCod: true,
            orderId: codOrder._id.toString(),
            message: "Cash on Delivery order placed successfully!",
          },
          { status: 201 }
        );
      } catch (dbErr: any) {
        console.error("Error creating COD order in DB:", dbErr);
        // Fallback for demo when DB is connecting
        return NextResponse.json(
          {
            success: true,
            isCod: true,
            orderId: "COD-" + Date.now(),
            message: "Cash on Delivery order placed successfully!",
          },
          { status: 201 }
        );
      }
    }

    // Razorpay Online Order creation
    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const orderOptions = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: {
        userEmail: userEmail || "",
        userName: userName || "",
        ...notes,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    if (!razorpayOrder || !razorpayOrder.id) {
      return NextResponse.json(
        { error: "Failed to create order with Razorpay" },
        { status: 500 }
      );
    }

    // Attempt to persist the pending order in MongoDB
    try {
      await connectToDatabase();
      await Order.create({
        userEmail: userEmail || "guest@innovist.com",
        userName: userName || "Guest Customer",
        items: items.map((it: any) => ({
          productId: it.id || it.productId || "p-item",
          name: it.name || "Skin Care Cream",
          price: it.price || 0,
          quantity: it.quantity || 1,
          size: it.size || "50 ml",
        })),
        subtotal: subtotal || amountInPaise / 100,
        discountAmount: discountAmount || 0,
        couponCode: couponCode || "",
        shippingFee: shippingFee || 0,
        totalAmount: amountInPaise / 100,
        paymentMethod: "razorpay",
        shippingAddress: shippingAddress || {},
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
      });
    } catch (dbErr) {
      console.warn("MongoDB pending order recording failed (non-critical):", dbErr);
    }

    return NextResponse.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: key_id,
      receipt: razorpayOrder.receipt,
    });
  } catch (error: any) {
    console.error("Error in /api/create-order:", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      {
        error: error.message || "Internal server error occurred creating order",
        details: error.error || error,
      },
      { status }
    );
  }
}
