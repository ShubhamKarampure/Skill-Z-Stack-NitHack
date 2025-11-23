import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Define specific sub-types for better type safety
interface InstituteData {
  isAccredited: boolean;
  isRegistered: boolean;
  isSuspended?: boolean;
  accreditationDate?: string;
  [key: string]: any; // Allows for other fields without breaking TS
}

export interface User {
  id: string; // The frontend usually expects 'id'
  _id?: string; // MongoDB often returns '_id', keeping both handles mapping issues
  name: string;
  email: string;
  role: "student" | "institute" | "employer" | "admin";
  walletAddress?: string; // Optional, might not be connected yet

  // specific role data
  instituteData?: InstituteData;
  studentData?: any;
  employerData?: any;
  companyName?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      // This merges new data (like isAccredited) into the existing user object
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "skill-z-storage", // The key in localStorage
      storage: createJSONStorage(() => localStorage), // Persist to browser storage
    }
  )
);
