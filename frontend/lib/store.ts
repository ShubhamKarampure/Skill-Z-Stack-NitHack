import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "institute" | "employer" | "admin";
  walletAddress: string;
  companyName?: string; // Optional for employer
  studentData?: any; // Optional specific data
  instituteData?: any;
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

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "skill-z-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
