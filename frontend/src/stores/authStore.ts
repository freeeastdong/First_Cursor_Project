import { create } from "zustand";
import type { User } from "../types";
import * as authService from "../services/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  login: async (username, password) => {
    await authService.login(username, password);
    const user = await authService.getMe();
    set({ user });
  },

  register: async (username, email, password) => {
    await authService.register(username, email, password);
    const user = await authService.getMe();
    set({ user });
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, loading: false });
        return;
      }
      const user = await authService.getMe();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null });
  },
}));
