"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "public" | "vip" | "sovereign_admin";

interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  credits: number;
  isMasterAdmin: boolean;
}

interface AuthContextType {
  user: UserProfile;
  setRole: (role: UserRole) => void;
  topUpCredits: (amount: number) => void;
  deductCredits: (amount: number) => boolean;
}

const DEFAULT_USER: UserProfile = {
  id: "user-sovereign-jct",
  name: "Sư Phụ JCT",
  role: "sovereign_admin",
  credits: 100,
  isMasterAdmin: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ht_user_profile");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ht_user_profile", JSON.stringify(user));
    }
  }, [user]);

  const setRole = (role: UserRole) => {
    setUser((prev) => ({
      ...prev,
      role,
      isMasterAdmin: role === "sovereign_admin",
    }));
  };

  const topUpCredits = (amount: number) => {
    setUser((prev) => ({ ...prev, credits: prev.credits + amount }));
  };

  const deductCredits = (amount: number): boolean => {
    if (user.credits >= amount) {
      setUser((prev) => ({ ...prev, credits: prev.credits - amount }));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, setRole, topUpCredits, deductCredits }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
