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
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.login(email, password);
      console.log("Login response from API :", JSON.stringify(response));

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
}));

export default useAuthStore;
