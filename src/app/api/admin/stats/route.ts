import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { isAdminEmail } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminEmail = searchParams.get("adminEmail");

    if (adminEmail && !isAdminEmail(adminEmail)) {
      return NextResponse.json(
        { error: "Unauthorized access: Not an admin email" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const allOrders = await Order.find().sort({ createdAt: -1 }).lean();

    let totalRevenue = 0;
    let prepaidRevenue = 0;
    let codRevenue = 0;
    const statusCounts: Record<string, number> = {
      pending: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    allOrders.forEach((ord) => {
      const amt = Number(ord.totalAmount) || 0;
      totalRevenue += amt;

      if (ord.paymentMethod === "cod") {
        codRevenue += amt;
      } else {
        prepaidRevenue += amt;
      }

      const st = ord.status || "pending";
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    const averageOrderValue =
      allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: allOrders.length,
        totalRevenue,
        prepaidRevenue,
        codRevenue,
        averageOrderValue,
        statusCounts,
      },
      recentOrders: allOrders.slice(0, 5),
    });
  } catch (error: any) {
    console.error("Admin GET Stats Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate stats" },
      { status: 500 }
    );
  }
}
