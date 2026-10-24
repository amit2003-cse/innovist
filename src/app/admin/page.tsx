"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Banknote
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalRevenue = stats?.totalRevenue || 0;
  const prepaidRevenue = stats?.prepaidRevenue || 0;
  const codRevenue = stats?.codRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const statusCounts = stats?.statusCounts || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Operations & Revenue Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time telemetry for dermatological face cream orders, fulfillment & revenue.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#151922] border border-zinc-800 rounded-3xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Total Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">₹{totalRevenue}</h3>
            <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1.5">
              <span>Avg Order: ₹{stats?.averageOrderValue || 0}</span>
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-emerald-400" />
              Prepaid: ₹{prepaidRevenue}
            </span>
            <span className="text-zinc-400 flex items-center gap-1">
              <Banknote className="w-3 h-3 text-amber-400" />
              COD: ₹{codRevenue}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#151922] border border-zinc-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">{totalOrders}</h3>
            <p className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Active pipeline</span>
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Paid: {statusCounts.paid || 0}</span>
            <span>COD: {statusCounts.pending || 0}</span>
          </div>
        </div>

        {/* Pending Fulfillment */}
        <div className="bg-[#151922] border border-zinc-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Action Required
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {(statusCounts.pending || 0) + (statusCounts.paid || 0)}
            </h3>
            <p className="text-[10px] text-zinc-400 mt-1">Orders awaiting packaging or courier dispatch</p>
          </div>
          <div className="pt-2 border-t border-zinc-800/80">
            <Link
              href="/admin/orders"
              className="text-[11px] text-amber-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>Process Shipments</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Delivered / Completed */}
        <div className="bg-[#151922] border border-zinc-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Delivered Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {statusCounts.delivered || 0}
            </h3>
            <p className="text-[10px] text-zinc-400 mt-1">Successfully fulfilled to customer doorsteps</p>
          </div>
          <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400">
            <span>In Transit: {statusCounts.shipped || 0}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#151922] border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-base text-white">Recent Customer Orders</h2>
            <p className="text-xs text-zinc-400">Latest incoming orders across India</p>
          </div>

          <Link
            href="/admin/orders"
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">
            <p>No customer orders in database yet.</p>
            <p className="text-[11px] mt-1">Place a test order on the storefront to test live tracking!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {recentOrders.map((ord) => {
                  const idStr = String(ord._id || ord.id || "").slice(-8).toUpperCase();
                  const isCod = ord.paymentMethod === "cod";
                  const status = ord.status || "pending";

                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    delivered: "bg-teal-500/10 text-teal-300 border-teal-500/20",
                    cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                  };

                  return (
                    <tr key={ord._id || ord.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-3 font-mono font-bold text-amber-400">#{idStr}</td>
                      <td className="py-3">
                        <p className="font-bold text-white">{ord.userName || "Customer"}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">
                          {ord.shippingAddress?.phone || ord.userEmail}
                        </p>
                      </td>
                      <td className="py-3 text-zinc-300">
                        {ord.items?.length || 1} item(s)
                      </td>
                      <td className="py-3 font-bold text-white">₹{ord.totalAmount}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                          {isCod ? "COD" : "Razorpay Online"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                            statusColors[status] || "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href="/admin/orders"
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold transition inline-flex items-center gap-1"
                        >
                          <span>Manage</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/orders"
          className="p-5 rounded-3xl bg-[#151922] border border-zinc-800 hover:border-zinc-700 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-amber-400 transition">
                Orders & Shipments Console
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Update delivery status, assign Delhivery AWB tracking numbers, and view customer addresses.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition" />
        </Link>

        <Link
          href="/admin/products"
          className="p-5 rounded-3xl bg-[#151922] border border-zinc-800 hover:border-zinc-700 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition">
                Face Creams Catalog
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                View all 8 clinical barrier formulations, stock status, and pricing.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition" />
        </Link>
      </div>
    </div>
  );
}
