import useAuthStore from "@/store/userAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance } from "axios";

class ApiService {
  private api: AxiosInstance;
  private baseURL = "https://tifstay-backend.onrender.com";

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("API Request:", config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log("API Response:", response.status, response.config.url);
        return response;
      },
      async (error) => {
        console.error(
          "Response Error:",
          error.response?.status,
          error.response?.data
        );

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("userData");
          // You might want to redirect to login here
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async login(email: string, password: string) {
    try {
      const response = await this.api.post("/api/auth/login", {
        email,
        password,
      });

      // Store token if returned
      if (response.data.token) {
        await AsyncStorage.setItem("authToken", response.data.token);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    profile: string
  ) {
    try {
      const response = await this.api.post("/api/auth/register", {
        name,
        email,
        password,
        profile,
      });

      // Store token if returned
      if (response.data.token) {
        await AsyncStorage.setItem("authToken", response.data.token);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  }

  async logout() {
    try {
      // Clear local storage
      await AsyncStorage.multiRemove(["authToken", "userData"]);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Logout failed" };
    }
  }

  // Get current user (example endpoint - adjust based on your API)
  async getCurrentUser() {
    try {
      const response = await this.api.get("/api/auth/me");
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get user data",
      };
    }
  }
}

export default new ApiService();
