import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    await connectToDatabase();
    const orders = await Order.find({ userEmail: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ orders: [], error: error.message }, { status: 200 });
  }
}
