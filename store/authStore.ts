import { Hostel } from "@/types/hostel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
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
  checkAuthStatus: () => Promise<void>;
  setUser: (user: User) => void;
  setSplashSeen: () => Promise<void>;
  checkSplashStatus: () => Promise<void>;
  getHostelList: () => Promise<any>;
  getUserProfile: (type: "hostel_owner" | "tiffin_provider") => Promise<any>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hostelList: [],
  isLoading: false,
  error: null,
  hasSeenSplash: false,
  checkAuthStatus: async () => {
    try {
      const [token, userDataString] = await Promise.all([
        AsyncStorage.getItem("authToken"),
        AsyncStorage.getItem("userData"),
      ]);

      if (token && userDataString) {
        const userData = JSON.parse(userDataString);
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
        });

        // Optionally verify token with backend
        const response = await hostelApiService.getCurrentUser();
        if (response.success) {
          set({ user: response.data });
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  setUser: (user: User) => set({ user }),

  setSplashSeen: async () => {
    try {
      await AsyncStorage.setItem("hasSeenSplash", "true");
      set({ hasSeenSplash: true });
    } catch (error) {
      console.error("Error setting splash seen status:", error);
    }
  },

  checkSplashStatus: async () => {
    try {
      const hasSeenSplash = await AsyncStorage.getItem("hasSeenSplash");
      set({ hasSeenSplash: hasSeenSplash === "true" });
    } catch (error) {
      console.error("Error checking splash status:", error);
      set({ hasSeenSplash: false });
    }
  },
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

        // Store both in AsyncStorage
        if (userData) {
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
        }
        if (token) {
          await AsyncStorage.setItem("authToken", token);
        }

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

        // Store user data in AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        if (token) {
          await AsyncStorage.setItem("authToken", token);
        }

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
      await hostelApiService.logout();

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      AsyncStorage.removeItem("authToken");
      AsyncStorage.removeItem("userData");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
