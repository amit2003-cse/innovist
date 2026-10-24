"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  ExternalLink,
  Edit2,
  Check,
  X,
  Printer,
  ChevronDown,
  RefreshCw,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CreditCard,
  Banknote
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Tracking Number Editing State
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/admin/orders", window.location.origin);
      if (selectedStatus !== "all") url.searchParams.set("status", selectedStatus);
      if (searchQuery.trim()) url.searchParams.set("search", searchQuery.trim());

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSaveTracking = async (orderId: string) => {
    if (!trackingInput.trim()) return;
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          trackingNumber: trackingInput.trim(),
          courierPartner: "Delhivery Express",
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? { ...o, trackingNumber: trackingInput.trim(), courierPartner: "Delhivery Express" }
              : o
          )
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev: any) => ({
            ...prev,
            trackingNumber: trackingInput.trim(),
            courierPartner: "Delhivery Express",
          }));
        }
      }
    } catch (err) {
      console.error("Failed to update tracking:", err);
    } finally {
      setUpdatingOrderId(null);
      setEditingTrackingId(null);
      setTrackingInput("");
    }
  };

  const statuses = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending COD" },
    { id: "paid", label: "Prepaid (Paid)" },
    { id: "shipped", label: "Shipped / In Transit" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    delivered: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Orders & Fulfillments Console
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage incoming orders, dispatch tracking numbers, and update delivery statuses.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#151922] border border-zinc-800 rounded-3xl p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Phone, Customer Name, or PIN..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs transition"
          >
            Search
          </button>
        </form>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {statuses.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  isActive
                    ? "bg-zinc-100 text-zinc-950 shadow-xs"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List Container */}
      <div className="bg-[#151922] border border-zinc-800 rounded-3xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
          <span>Found <strong>{orders.length}</strong> orders</span>
          <span className="font-mono text-[10px]">Realtime DB Sync</span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-zinc-400 font-mono text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
            <span>Loading orders from database...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs space-y-2">
            <Package className="w-10 h-10 mx-auto text-zinc-600" />
            <p className="font-bold text-sm text-zinc-400">No orders found</p>
            <p className="text-[11px]">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {orders.map((ord) => {
              const orderId = String(ord._id || ord.id || "").slice(-8).toUpperCase();
              const isCod = ord.paymentMethod === "cod";
              const addr = ord.shippingAddress || {};
              const fullStreet = [addr.flatBuilding, addr.streetArea, addr.street, addr.landmark]
                .filter(Boolean)
                .join(", ");
              const dateFormatted = ord.createdAt
                ? new Date(ord.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recent";

              const isUpdating = updatingOrderId === ord._id;

              return (
                <div
                  key={ord._id}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3 hover:border-zinc-700 transition"
                >
                  {/* Top Line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-sm text-amber-400">
                        #{orderId}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">{dateFormatted}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                        {isCod ? "Cash on Delivery" : "Razorpay Online"}
                      </span>
                    </div>

                    {/* Status Dropdown Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">Status:</span>
                      <select
                        disabled={isUpdating}
                        value={ord.status || "pending"}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border bg-zinc-950 focus:outline-none cursor-pointer uppercase tracking-wider ${
                          statusColors[ord.status || "pending"]
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {/* Customer Info */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase">Customer</p>
                      <p className="font-bold text-white text-sm">
                        {addr.fullName || ord.userName || "Customer"}
                      </p>
                      <p className="text-zinc-400 font-mono flex items-center gap-1 text-[11px]">
                        <Phone className="w-3 h-3 text-amber-500" />
                        <span>{addr.phone || "No phone"}</span>
                      </p>
                      <p className="text-zinc-400 font-mono flex items-center gap-1 text-[11px] truncate">
                        <Mail className="w-3 h-3 text-blue-400" />
                        <span>{addr.email || ord.userEmail}</span>
                      </p>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase">Destination</p>
                      <p className="text-zinc-300 leading-relaxed text-[11px]">
                        {fullStreet || "Standard Street Address"}
                      </p>
                      <p className="text-zinc-400 font-semibold text-[11px]">
                        {addr.city || "New Delhi"}, {addr.state || "Delhi"} -{" "}
                        <strong className="text-white font-mono">{addr.pincode || "110001"}</strong>
                      </p>
                    </div>

                    {/* Order Financials & Tracking */}
                    <div className="space-y-1.5 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold">
                          Total Amount:
                        </span>
                        <span className="text-base font-black text-white">₹{ord.totalAmount}</span>
                      </div>

                      {/* Courier Tracking Assigner */}
                      <div className="pt-1 border-t border-zinc-800">
                        {editingTrackingId === ord._id ? (
                          <div className="flex gap-1.5 pt-1">
                            <input
                              type="text"
                              value={trackingInput}
                              onChange={(e) => setTrackingInput(e.target.value)}
                              placeholder="e.g. DELH8392019"
                              className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-white flex-1"
                            />
                            <button
                              onClick={() => handleSaveTracking(ord._id)}
                              className="px-2 py-1 bg-amber-500 text-black rounded-lg text-xs font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingTrackingId(null)}
                              className="p-1 text-zinc-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1 text-zinc-400 truncate">
                              <Truck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="font-mono text-zinc-300 truncate">
                                {ord.trackingNumber || "No Tracking AWB"}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingTrackingId(ord._id);
                                setTrackingInput(ord.trackingNumber || "");
                              }}
                              className="text-[10px] text-amber-400 hover:underline font-bold shrink-0 ml-1"
                            >
                              {ord.trackingNumber ? "Edit" : "+ Assign"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items Ordered Quick View */}
                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-zinc-400 text-[11px] truncate">
                      <Package className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">
                        {ord.items?.map((it: any) => `${it.name} (x${it.quantity || 1})`).join(", ") ||
                          "Face Cream"}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition shrink-0 ml-2"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Full Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-[#151922] border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="font-extrabold text-base text-white">Order Details & Receipt</h3>
                <p className="text-[10px] text-zinc-400 font-mono">
                  ID: #{String(selectedOrder._id).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status & Payment Badge */}
            <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-2xl border border-zinc-800 text-xs">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">Status</span>
                <span className="font-extrabold text-amber-400 uppercase text-xs">
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">Payment</span>
                <span className="font-bold text-white text-xs">
                  {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid Razorpay"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">Amount</span>
                <span className="font-black text-emerald-400 text-sm">
                  ₹{selectedOrder.totalAmount}
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 text-xs space-y-1">
              <p className="font-bold text-white text-xs">Shipping Address</p>
              <p className="text-zinc-300 font-semibold">
                {selectedOrder.shippingAddress?.fullName || selectedOrder.userName} &bull;{" "}
                <span className="text-zinc-400 font-mono">
                  {selectedOrder.shippingAddress?.phone}
                </span>
              </p>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {[
                  selectedOrder.shippingAddress?.flatBuilding,
                  selectedOrder.shippingAddress?.streetArea,
                  selectedOrder.shippingAddress?.street,
                  selectedOrder.shippingAddress?.landmark,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-zinc-400 text-[11px]">
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{" "}
                <strong className="text-white font-mono">
                  {selectedOrder.shippingAddress?.pincode}
                </strong>
              </p>
            </div>

            {/* Items Ordered Table */}
            <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 space-y-2 text-xs">
              <p className="font-bold text-white text-xs">Items ({selectedOrder.items?.length})</p>
              <div className="divide-y divide-zinc-800">
                {selectedOrder.items?.map((it: any, i: number) => (
                  <div key={i} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-zinc-200">{it.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Qty: {it.quantity} &bull; Size: {it.size || "50 ml"}
                      </p>
                    </div>
                    <span className="font-black text-white text-xs">
                      ₹{(it.price || 0) * (it.quantity || 1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Print & Action Footer */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
