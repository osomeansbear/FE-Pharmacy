import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 1. Define the User type based on your API response
export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  role: "PATIENT" | "PHARMACIST" | "INVENTORY_MANAGER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

// 2. Define the interface for State & Actions
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
}

// 3. Create the Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial State
      user: null,
      token: null,
      isAuthenticated: false,

      // Action: Login
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Action: Logout
      logout: () => {
        // set({
        //   user: null,
        //   token: null,
        //   isAuthenticated: false,
        // });
        // Optional: clear local storage if you want to be thorough
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage", // unique name for the key in localStorage
      storage: createJSONStorage(() => localStorage), // defaults to localStorage, but good to be explicit
    },
  ),
);
