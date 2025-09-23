import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import apiService from "../services/apiService";

interface User {
  id: string;
  name: string;
  email: string;
  profile: "tiffin_provider" | "hostel_owner";
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasSeenSplash: boolean;

  // Actions
  login: (email: string, password: string) => Promise<any>;
  register: (
    name: string,
    email: string,
    password: string,
    profile: string
  ) => Promise<any>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
  setUser: (user: User) => void;
  setSplashSeen: () => Promise<void>;
  checkSplashStatus: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hasSeenSplash: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.login(email, password);

      if (response.success) {
        const userData = response.data.data?.user;
        const token = response.data?.data?.token;

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
    name: string,
    email: string,
    password: string,
    profile: string
  ) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.register(
        name,
        email,
        password,
        profile
      );

      if (response.success) {
        const userData = response.data.user || response.data;
        const token = response.data.token;

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

  logout: async () => {
    set({ isLoading: true });

    try {
      await apiService.logout();

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
        const response = await apiService.getCurrentUser();
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
}));

export default useAuthStore;
