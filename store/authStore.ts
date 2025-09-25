import { Hostel } from "@/types/hostel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import hostelApiService from "../services/hostelApiService";
import tiffinApiService from "../services/tiffinApiServices";

interface User {
  id: string;
  fullName: string;
  email: string;
  hostelList: Hostel[];
  profileImage: string;
  bankDetails: {
    accountType: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasSeenSplash: boolean;
  hostelList: Hostel[];
  userServiceType: "hostel_owner" | "tiffin_provider";
  // Actions
  login: (
    email: string,
    password: string,
    type: "hostel_owner" | "tiffin_provider"
  ) => Promise<any>;
  register: (
    name: string,
    email: string,
    password: string,
    profile: "hostel_owner" | "tiffin_provider"
  ) => Promise<any>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
  setSplashSeen: () => void;
  getHostelList: () => Promise<any>;
  getUserProfile: (type: "hostel_owner" | "tiffin_provider") => Promise<any>;
  setUserServiceType: (type: "hostel_owner" | "tiffin_provider") => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hostelList: [],
  isLoading: false,
  error: null,
  hasSeenSplash: false,
  userServiceType: "hostel_owner",
  setUser: (user: User) => set({ user }),

  setSplashSeen: () => set({ hasSeenSplash: true }),

  login: async (
    email: string,
    password: string,
    type: "hostel_owner" | "tiffin_provider"
  ) => {
    set({ isLoading: true, error: null });

    try {
      let response;

      if (type === "hostel_owner") {
        response = await hostelApiService.login(email, password);
      } else {
        response = await tiffinApiService.login(email, password);
      }

      if (response.success) {
        const userData = type === "hostel_owner" ? response.data?.hostelOwner : response.data?.tiffinProvider;
        const token = response.data?.token;

        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true };
      } else {
        set({
          isLoading: false,
          error: response.error,
        });
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Login failed",
      });
      return { success: false, error: error.message };
    }
  },

  register: async (
    fullName: string,
    email: string,
    password: string,
    profile: "hostel_owner" | "tiffin_provider"
  ) => {
    set({ isLoading: true, error: null });

    try {
      let response;
      if (profile === "hostel_owner") {
        response = await hostelApiService.register(fullName, email, password);
      } else {
        response = await tiffinApiService.register(fullName, email, password);
      }

      if (response.success) {
        const userData = profile === "hostel_owner" ? response.data?.hostelOwner : response.data?.tiffinProvider;
        const token = response.data?.token;

        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true };
      } else {
        set({
          isLoading: false,
          error: response.error,
        });
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Registration failed",
      });
      return { success: false, error: error.message };
    }
  },

  getUserProfile: async (type: "hostel_owner" | "tiffin_provider") => {
    set({ isLoading: true });

    try {
      let response;
      if (type === "hostel_owner") {
        response = await hostelApiService.getUserProfile();
      } else {
        response = await tiffinApiService.getUserProfile();
      }
      console.log("User Profile:", response.data);
      if (response.success) {
        set({
          user: response.data?.hostelOwner,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        set({
          isLoading: false,
          error: response.error,
        });
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch user profile",
      });
      return { success: false, error: error.message };
    }
  },

  getHostelList: async () => {
    set({ isLoading: true });

    try {
      const response = await hostelApiService.getHostelList();

      if (response.success) {
        set({
          hostelList: response.data?.data,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        set({
          isLoading: false,
          error: response.error,
        });
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch hostel list",
      });
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      hostelApiService.logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  setUserServiceType: (type: "hostel_owner" | "tiffin_provider") =>
    set({ userServiceType: type }),
}), {
  name: 'auth-storage',
  storage: createJSONStorage(() => AsyncStorage),
}) );

export default useAuthStore;
