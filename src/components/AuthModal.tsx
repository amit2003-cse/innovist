"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { X, Sparkles, ShieldCheck, Heart } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithCredential, isLoading } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-zinc-100 text-center">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="mt-2 mb-4">
          <span className="text-xl font-black tracking-[0.2em] text-zinc-900 uppercase">
            INNOVIST
          </span>
          <p className="text-[10px] font-bold tracking-widest text-amber-600 uppercase mt-0.5">
            Clean • Science • Face Care
          </p>
        </div>

        <h3 className="text-base font-extrabold text-zinc-900 tracking-tight">
          Sign In to Innovist
        </h3>
        <p className="text-xs text-zinc-500 mt-1 mb-5">
          Unlock personalized face cream routines, order history & exclusive member offers.
        </p>

        {/* Google OAuth Button Container */}
        <div className="flex justify-center my-4 min-h-[44px]">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
              <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span>Connecting to database...</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  loginWithCredential(credentialResponse.credential);
                }
              }}
              onError={() => {
                console.error("Google Login Failed");
              }}
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
              width="280"
            />
          )}
        </div>

        {/* Perks Checklist */}
        <div className="space-y-2 text-left pt-4 mt-2 border-t border-zinc-100 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Instant FLAT 20% OFF coupon applied</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Save your favorite skin barrier creams</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Secure authentication & encrypted data</span>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 mt-5">
          By signing in, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
