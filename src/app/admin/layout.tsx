"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAdminEmail } from "@/lib/adminAuth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    try {
      const stored = localStorage.getItem("innovist_admin_user");
      if (!stored) {
        router.replace("/admin/login");
        return;
      }

      const parsed = JSON.parse(stored);
      if (!isAdminEmail(parsed?.email)) {
        localStorage.removeItem("innovist_admin_user");
        router.replace("/admin/login");
        return;
      }

      setAdminUser(parsed);
    } catch (e) {
      console.error("Auth check failed:", e);
      router.replace("/admin/login");
    } finally {
      setIsCheckingAuth(false);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem("innovist_admin_user");
    router.replace("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center text-zinc-400 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <span>Validating Administrator Privileges...</span>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders & Shipments", icon: Package },
    { href: "/admin/products", label: "Face Creams Catalog", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#0E1118] text-zinc-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#151922] border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-black text-xs flex items-center justify-center">
            INV
          </div>
          <span className="font-extrabold text-sm tracking-tight">Admin Console</span>
        </div>

        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300"
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 bg-[#131722] border-r border-zinc-800/90 flex flex-col justify-between p-4 transition-transform duration-200 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Logo / Title */}
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-black text-sm flex items-center justify-center shadow-md shadow-amber-500/20">
              INV
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight text-white">INNOVIST</h2>
              <p className="text-[10px] font-mono text-amber-400 font-semibold uppercase tracking-wider">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-2xl font-bold text-xs transition ${
                    isActive
                      ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>View Live Store</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">&rarr;</span>
          </Link>

          {/* Logged in Admin Card */}
          <div className="p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="font-extrabold text-xs text-white truncate">
                  {adminUser?.name || "Administrator"}
                </p>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                {adminUser?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-xl transition"
              aria-label="Logout"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
