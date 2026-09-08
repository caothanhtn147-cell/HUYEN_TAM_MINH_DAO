'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'public' | 'vip' | 'sovereign_admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  credits: number;
  isMasterAdmin: boolean;
  deviceId: string;
  firstVisited: string;
}

interface AuthContextType {
  user: UserProfile;
  setRole: (role: UserRole) => void;
  topUpCredits: (amount: number) => void;
  deductCredits: (amount: number) => boolean;
  unlockSovereignMaster: () => void;
}

const getOrCreateDeviceId = (): string => {
  if (typeof window === 'undefined') return 'HK-SOVEREIGN';
  const existing = localStorage.getItem('ht_device_footprint_id');
  if (existing) return existing;
  const newId = `HK-${Math.floor(1000 + Math.random() * 9000)}`;
  localStorage.setItem('ht_device_footprint_id', newId);
  return newId;
};

const INITIAL_PUBLIC_USER: UserProfile = {
  id: 'guest-explorer',
  name: 'Lữ Khách Càn Khôn',
  role: 'public',
  credits: 50,
  isMasterAdmin: false,
  deviceId: 'HK-INIT',
  firstVisited: new Date().toISOString().split('T')[0],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ht_user_profile');
      const devId = getOrCreateDeviceId();
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return {
            ...parsed,
            deviceId: devId,
          };
        } catch {
          // fallback
        }
      }
      return {
        ...INITIAL_PUBLIC_USER,
        deviceId: devId,
      };
    }
    return INITIAL_PUBLIC_USER;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ht_user_profile', JSON.stringify(user));
    }
  }, [user]);

  const setRole = (role: UserRole) => {
    setUser((prev) => ({
      ...prev,
      role,
      isMasterAdmin: role === 'sovereign_admin',
      name: role === 'sovereign_admin' ? 'Sư Phụ JCT' : prev.name,
      credits: role === 'sovereign_admin' ? 999999 : prev.credits,
    }));
  };

  const unlockSovereignMaster = () => {
    setRole('sovereign_admin');
  };

  const topUpCredits = (amount: number) => {
    setUser((prev) => ({ ...prev, credits: prev.credits + amount }));
  };

  const deductCredits = (amount: number): boolean => {
    if (user.isMasterAdmin) {
      // Sovereign Admin never runs out of credits
      return true;
    }
    if (user.credits >= amount) {
      setUser((prev) => ({ ...prev, credits: prev.credits - amount }));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{ user, setRole, topUpCredits, deductCredits, unlockSovereignMaster }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
