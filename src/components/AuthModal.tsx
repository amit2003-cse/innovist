"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Coins,
  ArrowRight,
  Smartphone,
  Mail,
  Loader2,
  Lock
} from "lucide-react";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithCredential,
    loginWithPhoneOrEmail,
    isLoading
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"google" | "phone">("google");
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmed = identifier.trim();
    if (!trimmed) {
      setErrorMsg("Please enter your mobile number or email");
      return;
    }

    const isEmail = trimmed.includes("@");
    const digits = trimmed.replace(/\D/g, "");

    if (!isEmail && digits.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }

    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      loginWithPhoneOrEmail(trimmed, name);
      setIsSubmitting(false);
      setIsAuthModalOpen(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-[420px] w-full shadow-2xl relative border border-zinc-200 overflow-hidden text-center animate-scale-up">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition z-20 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Promotional Header */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950 text-white p-5 pt-6 text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-rose-500/20 rounded-full blur-xl pointer-events-none" />

          {/* Member Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/25 to-yellow-500/25 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-2">
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            <span>Unlock 500 iCash Coins (₹50 Value)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Welcome to Innovist
          </h2>
          <p className="text-[11px] text-zinc-300 mt-1 max-w-xs mx-auto">
            Sign in to access saved routines, express checkout &amp; real-time order tracking.
          </p>

          {/* Sign In Method Segmented Tabs */}
          <div className="mt-4 grid grid-cols-2 gap-1.5 p-1 bg-zinc-800/80 rounded-2xl border border-zinc-700/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab("phone");
                setErrorMsg("");
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "phone"
                  ? "bg-amber-400 text-zinc-950 shadow-xs"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile / Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("google");
                setErrorMsg("");
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "google"
                  ? "bg-amber-400 text-zinc-950 shadow-xs"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google 1-Tap</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Mobile Number / Email Instant Sign In */}
        <div className="p-5 text-left">
          {activeTab === "phone" ? (
            <form onSubmit={handleManualLogin} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="+91 98765 43210 or name@email.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 bg-white text-xs font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                    autoFocus
                  />
                  <Smartphone className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 bg-white text-xs font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold animate-fade-in">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-black text-amber-300 font-black text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to My Account</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-[10px] text-zinc-400">
                  ⚡ No password required &bull; Instant OTP / Profile verification
                </span>
              </div>
            </form>
          ) : (
            /* Tab 2: Google 1-Tap Sign In */
            <div className="py-3 space-y-4">
              <div className="flex justify-center min-h-[46px]">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span>Connecting Google session...</span>
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      if (credentialResponse.credential) {
                        loginWithCredential(credentialResponse.credential);
                      }
                    }}
                    onError={() => {
                      setErrorMsg("Google sign in was cancelled or closed.");
                    }}
                    theme="filled_black"
                    size="large"
                    shape="pill"
                    text="signin_with"
                    width="300"
                  />
                )}
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold text-center animate-fade-in">
                  {errorMsg}
                </p>
              )}

              <p className="text-[11px] text-zinc-500 text-center">
                Securely logs you in with your verified Google account in 1 tap.
              </p>
            </div>
          )}

          {/* Member Benefits Grid */}
          <div className="mt-4 pt-3.5 border-t border-zinc-100 grid grid-cols-2 gap-2 text-[11px] text-zinc-700">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 font-semibold text-amber-950">
              <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>500 iCash Coins</span>
            </div>

            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60 font-semibold text-emerald-950">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>FLAT 20% OFF</span>
            </div>

            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-blue-50/70 border border-blue-200/60 font-semibold text-blue-950">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Saved Addresses</span>
            </div>

            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-purple-50/70 border border-purple-200/60 font-semibold text-purple-950">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Live Tracking</span>
            </div>
          </div>

          <p className="text-[9.5px] text-zinc-400 text-center mt-3 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-zinc-400" />
            <span>256-bit SSL encrypted &bull; We never share your data</span>
          </p>
        </div>
      </div>
    </div>
  );
}
