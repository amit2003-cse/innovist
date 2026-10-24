"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { isAdminEmail, ADMIN_EMAILS } from "@/lib/adminAuth";
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  KeyRound,
  CheckCircle2,
  Loader2
} from "lucide-react";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  process.env.GOOGLE_CLIENT_ID ||
  "439593796565-5t183h1r9oaphtahj3bv2q2gn0t94iv9.apps.googleusercontent.com";

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in as admin, auto-redirect
  useEffect(() => {
    try {
      const stored = localStorage.getItem("innovist_admin_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isAdminEmail(parsed?.email)) {
          router.replace("/admin");
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!credentialResponse?.credential) {
        throw new Error("No Google credential received.");
      }

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.user) {
        throw new Error(data.message || "Failed to authenticate with Google.");
      }

      const userEmail = data.user.email;

      // Verify Whitelist
      if (!isAdminEmail(userEmail)) {
        setErrorMessage(
          `Access Denied: The account (${userEmail}) is not authorized. Admin access is strictly limited to authorized administrators.`
        );
        setIsLoading(false);
        return;
      }

      // Store verified admin session
      const adminRecord = {
        ...data.user,
        role: "admin",
        isAdmin: true,
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem("innovist_admin_user", JSON.stringify(adminRecord));
      setSuccessMessage(`Welcome, ${data.user.name || "Administrator"}! Redirecting to Dashboard...`);

      setTimeout(() => {
        router.push("/admin");
      }, 800);
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      setErrorMessage(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Direct Selection for Whitelisted Admins (Smooth developer & client access)
  const handleQuickAdminLogin = (email: string, name: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    const adminRecord = {
      id: `admin-${Date.now()}`,
      name,
      email,
      role: "admin",
      isAdmin: true,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem("innovist_admin_user", JSON.stringify(adminRecord));
    setSuccessMessage(`Logged in as ${email}. Redirecting...`);

    setTimeout(() => {
      router.push("/admin");
    }, 600);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-[#0F1117] text-zinc-100 flex flex-col justify-between p-4 sm:p-8 selection:bg-amber-500 selection:text-black">
        {/* Top Bar */}
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Storefront</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Admin Gateway v2.4</span>
          </div>
        </div>

        {/* Central Auth Card */}
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Branding Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Innovist Admin Portal
              </h1>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Sign in with an authorized Google Administrator account to manage orders, catalog & fulfillments.
              </p>
            </div>

            {/* Error / Success Alerts */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="font-bold">{successMessage}</p>
              </div>
            )}

            {/* Google OAuth Login Button */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-center w-full">
                {isLoading ? (
                  <div className="py-3 px-6 rounded-2xl bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Verifying Administrator Token...</span>
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setErrorMessage("Google Sign-In failed or was closed.")}
                    theme="filled_black"
                    shape="pill"
                    size="large"
                    text="signin_with"
                    width="100%"
                  />
                )}
              </div>
            </div>

            {/* Whitelist Badges */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Whitelisted Admin Emails</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">2 Configured</span>
              </div>

              <div className="space-y-1.5">
                {ADMIN_EMAILS.map((email) => (
                  <button
                    key={email}
                    onClick={() =>
                      handleQuickAdminLogin(
                        email,
                        email.startsWith("abhishek") ? "Abhishek Kumar" : "Amit Kumar"
                      )
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 hover:bg-zinc-800 border border-zinc-800 text-left transition group text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-mono text-zinc-300 group-hover:text-white truncate">
                        {email}
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition shrink-0">
                      Sign In &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-zinc-500 max-w-sm mx-auto">
          Innovist Clinical Face Creams & Barrier Moisture &bull; Internal Administration Console
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
