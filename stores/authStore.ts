import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 1. Define the User type based on your API response
export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  role: "PATIENT" | "ADMIN";
  createdAt?: string;
  updatedAt?: string;
}

// 2. Define the interface for State & Actions
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

// 3. Create the Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial State
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,

      // Action: Login
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          hasHydrated: true,
        });
      },

      setUser: (user) => {
        set((state) => ({
          user,
          token: state.token,
          isAuthenticated: !!state.token,
          hasHydrated: true,
        }));
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },

      // Action: Logout
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          hasHydrated: true,
        });
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("token");
      },
    }),
    {
      name: "auth-storage", // unique name for the key in localStorage
      storage: createJSONStorage(() => localStorage), // defaults to localStorage, but good to be explicit
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
