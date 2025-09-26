import useAuthStore from "@/store/authStore";
import axios, { AxiosInstance } from "axios";

class ApiService {
  private api: AxiosInstance;
  // private baseURL = "https://tifstay-backend.onrender.com";
  private baseURL = "https://tifstay-project-be.onrender.com";

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
          useAuthStore.setState({ token: null, isAuthenticated: false, user: null, });
          // You might want to redirect to login here
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async login(email: string, password: string) {
    return this.api.post("/api/hostelOwner/loginOwner", {
        email,
        password,
      });
  }

  async register(fullName: string, email: string, password: string) {
    try {
      const response = await this.api.post("/api/hostelOwner/registerOwner", {
        fullName,
        email,
        password,
      });

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
  async forgotPassword(email: string) { return this.api.post("/api/hostelOwner/forgotOwnerPassword", { email }); }
  async verifyOtp(email: string, otp: string) {
    return this.api.post("/api/hostelOwner/verifyOwnerOtp", { email, otp });
  }
  async resetPassword(token: string, password: string) { return this.api.post("/api/hostelOwner/resetOwnerPassword", { token, password }); }
  async changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    try {
      const response = await this.api.post("/api/hostelOwner/changeOwnerPassword", {
        oldPassword,
        newPassword,
        confirmPassword,
      });
  
      return {
        success: true,
        data: response.data,
        message: response.data?.message || "Password changed successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Password change failed. Please try again.",
      };
    }
  }
  async updateProfile(profileData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImage?: any;
    bankDetails: {
      accountNumber: string;
      ifscCode: string;
      accountType: string;
      accountHolderName: string;
      bankName: string;
    };
  }) {
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append("fullName", profileData.fullName);
      formData.append("email", profileData.email);
      formData.append("phoneNumber", profileData.phoneNumber);
      
      // Add bank details
      formData.append("bankDetails[accountNumber]", profileData.bankDetails.accountNumber);
      formData.append("bankDetails[ifscCode]", profileData.bankDetails.ifscCode);
      formData.append("bankDetails[accountType]", profileData.bankDetails.accountType);
      formData.append("bankDetails[accountHolderName]", profileData.bankDetails.accountHolderName);
      formData.append("bankDetails[bankName]", profileData.bankDetails.bankName);
      
      // Add profile image if provided
      if (profileData.profileImage) {
        formData.append("profileImage", {
          uri: profileData.profileImage.uri,
          type: profileData.profileImage.type || "image/jpeg",
          name: profileData.profileImage.name || `profile_${Date.now()}.jpg`,
        } as any);
      }
  
      const response = await this.api.put("/api/hostelOwner/updateOwnerProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update profile",
      };
    }
  }


// Address Management APIs
async addAddress(addressData: {
  address: string;
  street: string;
  postCode: string;
  label: "Home" | "Work";
}) {
  try {
    const response = await this.api.post("/api/hostelOwner/address/addAddress", addressData);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add address",
    };
  }
}

async getAllAddresses() {
  try {
    const response = await this.api.get("/api/hostelOwner/address/getAllAddresses");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch addresses",
    };
  }
}

async getAddressById(addressId: string) {
  try {
    const response = await this.api.get(`/api/hostelOwner/address/getAddress/${addressId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch address",
    };
  }
}

async editAddress(addressId: string, addressData: {
  address: string;
  street: string;
  postCode: string;
  label: "Home" | "Work";
}) {
  try {
    const response = await this.api.put(`/api/hostelOwner/address/editAddress/${addressId}`, addressData);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update address",
    };
  }
}

async deleteAddress(addressId: string) {
  try {
    const response = await this.api.delete(`/api/hostelOwner/address/deleteAddress/${addressId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete address",
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

      const token = useAuthStore.getState().token;

      const response = await this.api.post("/api/hostels", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        success: true,
        data: response,
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

  async getHostelList() {
    try {
      const response = await this.api.get("/api/hostels");
      console.log("Hostel List:", response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Get Hostel List Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get hostel list.",
      };
    }
  }

  async logout() {
    try {
     const response = await this.api.post("/api/hostelOwner/logoutOwner");
     return {success:true,data:response.data};
    } catch (error: any) {
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

  async getUserProfile() {
    try {
      const response = await this.api.get("api/hostelOwner/getOwnerProfile");
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
