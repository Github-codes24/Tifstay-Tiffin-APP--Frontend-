import useAuthStore from "@/store/authStore";
import axios, { AxiosInstance } from "axios";

class TiffinApiService {
  private api: AxiosInstance;
  private baseURL = "https://tifstay-project-be.onrender.com";

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth tokenv
    this.api.interceptors.request.use(
      async (config) => {
        const token = useAuthStore.getState().token;
        console.log('--',token)
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
          useAuthStore.setState({ token: null, isAuthenticated: false, user: null });
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async login(email: string, password: string) {
    return this.api.post("/api/tiffinOwner/loginOwner", {
      email,
      password,
    });
  }

  async register(name: string, email: string, password: string) {
    try {
      const response = await this.api.post("/api/tiffinOwner/registerOwner", {
        name,
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
        error: error.response?.data?.message || "Registration failed. Please try again.",
      };
    }
  }

  async changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    try {
      const response = await this.api.post("/api/tiffinOwner/changeOwnerPassword", {
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
        error: error.response?.data?.message || "Password change failed. Please try again.",
      };
    }
  }

  async updateProfile(profileData: any) {
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append("name ", profileData.fullName);
      formData.append("email", profileData.email);
      formData.append("phoneNumber", profileData.phoneNumber);
      
      // Add bank details
      formData.append("bankDetails[accountNumber]", profileData.bankDetails.accountNumber);
      formData.append("bankDetails[ifscCode]", profileData.bankDetails.ifscCode);
      formData.append("bankDetails[accountType]", profileData.bankDetails.accountType);
      formData.append("bankDetails[accountHolderName]", profileData.bankDetails.accountHolderName);
      // formData.append("bankDetails[bankName]", profileData.bankDetails.bankName);
      
      // Add profile image if provided
      if (profileData.profileImage) {
        formData.append("profileImage", {
          uri: profileData.profileImage.uri,
          type: profileData.profileImage.type || "image/jpeg",
          name: profileData.profileImage.name || `profile_${Date.now()}.jpg`,
        } as any);
      }

      const response = await this.api.put("/api/tiffinOwner/updateOwnerProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log('_+_+_+_+_+_+', response)
      this.getUserProfile()
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

  async getUserProfile() {
    try {
      const response = await this.api.get("/api/tiffinOwner/getOwnerProfile");
      console.log('=======',response)
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

  async forgotPassword(email: string) { return this.api.put("/api/tiffinOwner/forgotOwnerPassword", { email }); }


  async logout() {
    try { 
      const response = await this.api.post("/api/tiffinOwner/logoutOwner");
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: "Logout failed" };
    }
  }
// In tiffinApiServices.ts
async getRequestedTiffinServicesCount() {
  return this.api.get("/api/tiffinService/getRequestedTiffinServicesCount");
}
async getTotalTiffinServicesCount() {
  return this.api.get("/api/tiffinService/getTotalTiffinServicesCount");
}
 async getAcceptedTiffinServicesCount() {
  return this.api.get("/api/tiffinService/getAcceptedTiffinServicesCount");
}
async getCancelledTiffinServicesCount() {
  return this.api.get("/api/tiffinService/getCancelledTiffinServicesCount");
}
  // Address Management APIs for Tiffin Provider
  async addAddress(addressData: {
    address: string;
    street: string;
    postCode: string;
    label: "home" | "work";
  }) {
    try {
      const response = await this.api.post("/api/tiffinOwner/address/addAddress", addressData);
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
      const response = await this.api.get("/api/tiffinOwner/address/getAddress");
      console.log('-=-=-=-=',response)
      return {
        success: true,
        data: response.data,
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
      const response = await this.api.get(`/api/tiffinOwner/address/getAddress`);
      console.log('@@@@@@@------',response)
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
    label: "homw" | "work";
  }) {
    try {
      const response = await this.api.put(`/api/tiffinOwner/address/editAddress`, addressData);
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
      const response = await this.api.put(`/api/tiffinOwner/address/deleteAddress`);
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
  // Add to your existing tiffinApiService class

async sendMessageToAdmin(message: string) {
  try {
    const response = await this.api.post("/api/message/sendMessage", {
      message,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send message",
    };
  }
}

async getTiffinProviderPreviousChat() {
  try {
    const response = await this.api.get("/api/message/getTiffinProviderPreviousChat");
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to load messages",
    };
  }
}
  
  async getAllTiffinSrvices(
      page: number = 1,
      limit: number = 10
    ): Promise<any> {
      try {
        const response = await this.api.get(
          `/api/tiffinService/getTiffinServicesByOwner`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return {
          success: true,
          data: response.data,
        };
      } catch (error: any) {
        console.error("Get All Hostel Services Error:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Failed to fetch hostel services.",
        };
      }
    }
}

export default new TiffinApiService();