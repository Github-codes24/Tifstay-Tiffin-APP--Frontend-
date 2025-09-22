// services/apiService.tsx
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

  // Create Hostel Listing
  async createHostelListing(hostelData: any) {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("name", hostelData.hostelName);
      formData.append(
        "hostelType",
        hostelData.hostelType === "boys"
          ? "Boys Hostel"
          : hostelData.hostelType === "girls"
          ? "Girls Hostel"
          : hostelData.hostelType === "coed"
          ? "Co-ed Hostel"
          : "Boys Hostel"
      );
      formData.append("description", hostelData.description);

      // Pricing as JSON string
      const pricingData = [
        {
          type: "monthly",
          price: hostelData.monthlyPrice,
          securityDeposit: hostelData.securityDeposit,
          offer: hostelData.offers || "",
        },
      ];
      formData.append("pricing", JSON.stringify(pricingData));

      // Rooms as JSON string
      const roomsData = [
        {
          roomNo: hostelData.roomNo,
          noOfBeds: 3, // You might want to add this as a field
          details: hostelData.roomDetails,
        },
      ];
      formData.append("rooms", JSON.stringify(roomsData));

      // Facilities as comma-separated string
      const facilitiesList = Object.entries(hostelData.amenities || {})
        .filter(([key, value]) => value)
        .map(([key]) => {
          const facilityMap: { [key: string]: string } = {
            wifi: "Wifi",
            meals: "Mess",
            security: "Security",
            studyHall: "Study Hall",
            commonTV: "Common TV",
            cctv: "CCTV",
            acRooms: "AC Rooms",
            laundry: "Laundry",
          };
          return facilityMap[key] || key;
        });
      formData.append("facilities", facilitiesList.join(", "));

      // Rules
      formData.append("rules", hostelData.rulesText || "");

      // Location as JSON string
      const locationData = {
        area: hostelData.location || hostelData.nearbyLandmarks || "",
        fullAddress: hostelData.fullAddress || "",
      };
      formData.append("location", JSON.stringify(locationData));

      // Contact as JSON string
      const contactData = {
        phone: hostelData.phoneNumber || "",
        whatsapp: hostelData.whatsappNumber || "",
      };
      formData.append("contact", JSON.stringify(contactData));

      // Photos (if any) - combine room photos and hostel photos
      const allPhotos = [
        ...(hostelData.roomPhotos || []),
        ...(hostelData.photos || []),
      ];
      if (allPhotos.length > 0) {
        allPhotos.forEach((photo: any) => {
          if (photo.uri) {
            formData.append("photos", {
              uri: photo.uri,
              type: photo.type || "image/jpeg",
              name: photo.name || `photo_${Date.now()}.jpg`,
            } as any);
          }
        });
      }

      // Make request with multipart/form-data
      const response = await this.api.post("/api/hostels", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Create Hostel Error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to create hostel listing.",
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
