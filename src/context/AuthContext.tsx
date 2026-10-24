"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  loginWithCredential: (credential: string) => Promise<boolean>;
  loginWithPhoneOrEmail: (identifier: string, name?: string) => boolean;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "439593796565-5t183h1r9oaphtahj3bv2q2gn0t94iv9.apps.googleusercontent.com";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("innovist_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          setUser(parsed);
          setIsLoading(false);
        }, 0);
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setIsLoading(false), 0);
  }, []);

  const loginWithCredential = async (credential: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("innovist_user", JSON.stringify(data.user));
        setIsAuthModalOpen(false);
        return true;
      } else {
        console.error("Auth response error:", data.message);
        return false;
      }
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhoneOrEmail = (identifier: string, name?: string): boolean => {
    const clean = identifier.trim();
    if (!clean) return false;
    const isEmail = clean.includes("@");
    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: name?.trim() || (isEmail ? clean.split("@")[0] : `Customer ${clean.slice(-4)}`),
      email: isEmail ? clean : `${clean.replace(/\D/g, "")}@customer.innovist.com`,
    };
    setUser(newUser);
    localStorage.setItem("innovist_user", JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("innovist_user");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider
        value={{
          user,
          isLoading,
          loginWithCredential,
          loginWithPhoneOrEmail,
          logout,
          isAuthModalOpen,
          setIsAuthModalOpen,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
