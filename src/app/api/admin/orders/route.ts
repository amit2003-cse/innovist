import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { isAdminEmail } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminEmail = searchParams.get("adminEmail");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Verify admin access
    if (adminEmail && !isAdminEmail(adminEmail)) {
      return NextResponse.json(
        { error: "Unauthorized access: Not an admin email" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const query: any = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { userName: regex },
        { userEmail: regex },
        { "shippingAddress.phone": regex },
        { "shippingAddress.fullName": regex },
        { razorpayOrderId: regex },
        { trackingNumber: regex },
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    console.error("Admin GET Orders Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, trackingNumber, courierPartner, adminEmail } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required for updating." },
        { status: 400 }
      );
    }

    if (adminEmail && !isAdminEmail(adminEmail)) {
      return NextResponse.json(
        { error: "Unauthorized access: Admin authorization required." },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (trackingNumber !== undefined) updateFields.trackingNumber = trackingNumber;
    if (courierPartner !== undefined) updateFields.courierPartner = courierPartner;

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updated,
    });
  } catch (error: any) {
    console.error("Admin PATCH Order Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
