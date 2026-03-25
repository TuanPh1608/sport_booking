import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthState } from "@/features/auth/types/auth-types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "pitch-booking-auth",
    },
  ),
);
