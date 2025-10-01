import useAuthStore from "@/store/authStore";
import { CreateHostelServiceData, Room } from "@/types/hostel";
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

  async logout() {
    try {
     const response = await this.api.post("/api/hostelOwner/logoutOwner");
     return {success:true,data:response.data};
    } catch (error: any) {
      return { success: false, error: "Logout failed" };
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
// In hostelApiService.ts, replace the createHostelService method:

async createHostelService(data: CreateHostelServiceData) {
  try {
    const formData = new FormData();

    // Basic fields - as TEXT not JSON
    formData.append("hostelName", data.hostelName);
    formData.append("hostelType", data.hostelType);
    formData.append("description", data.description);
    formData.append("securityDeposit", data.securityDeposit.toString());
    
    // Offers
    if (data.offers) {
      formData.append("offers", data.offers);
    }

    // Complex objects as JSON strings
    formData.append("location", JSON.stringify(data.location));
    formData.append("contactInfo", JSON.stringify(data.contactInfo));
    formData.append("rooms", JSON.stringify(data.rooms));
    formData.append("facilities", JSON.stringify(data.facilities));
    formData.append("pricing", JSON.stringify(data.pricing));
    
    // Rules and policies
    formData.append("rulesAndPolicies", data.rulesAndPolicies);

    // Hostel photos
    if (data.hostelPhotos && data.hostelPhotos.length > 0) {
      data.hostelPhotos.forEach((photo: any, index: number) => {
        if (photo.uri) {
          formData.append("hostelPhotos", {
            uri: photo.uri,
            type: photo.type || "image/jpeg",
            name: photo.name || `hostel_photo_${index}.jpg`,
          } as any);
        }
      });
    }

    // Room photos
    if (data.roomPhotos && data.roomPhotos.length > 0) {
      data.roomPhotos.forEach((photo: any, index: number) => {
        if (photo.uri) {
          formData.append("roomPhotos_0", {
            uri: photo.uri,
            type: photo.type || "image/jpeg",
            name: photo.name || `room_photo_${index}.jpg`,
          } as any);
        }
      });
    }

    console.log("FormData prepared for API");

    const response = await this.api.post("/api/hostelService/createHostelService", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Create Hostel Service Error:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create hostel service.",
    };
  }
}

  async getAllHostelServices() {
    try {
      const response = await this.api.get("https://tifstay-project-be.onrender.com/api/hostelService/getHostelServicesByOwner", {
        headers: {
          
          "Content-Type": "application/json",
        },
      });

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

  async getHostelServiceById(hostelServiceId: string) {
    try {
      const response = await this.api.get(
        `/api/hostelService/getHostelServiceById/${hostelServiceId}`,
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
      console.error("Get Hostel Service By ID Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch hostel service details.",
      };
    }
  }

  async updateHostelService(hostelServiceId: string, data: CreateHostelServiceData & { rooms: (Room & { isNewRoom?: boolean })[] }) {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("hostelName", data.hostelName);
      formData.append("hostelType", data.hostelType);
      formData.append("description", data.description);

      // Pricing as JSON string
      formData.append("pricing", JSON.stringify(data.pricing));

      // Security deposit
      formData.append("securityDeposit", data.securityDeposit.toString());

      // Offers
      if (data.offers) {
        formData.append("offers", data.offers);
      }

      // Rooms as JSON string (including isNewRoom flag and _id for existing rooms)
      formData.append("rooms", JSON.stringify(data.rooms));

      // Facilities as JSON string
      formData.append("facilities", JSON.stringify(data.facilities));

      // Location as JSON string
      formData.append("location", JSON.stringify(data.location));

      // Contact info as JSON string
      formData.append("contactInfo", JSON.stringify(data.contactInfo));

      // Rules and policies
      formData.append("rulesAndPolicies", data.rulesAndPolicies);

      // Hostel photos
      if (data.hostelPhotos && data.hostelPhotos.length > 0) {
        data.hostelPhotos.forEach((photo: any, index: number) => {
          if (photo.uri) {
            formData.append("hostelPhotos", {
              uri: photo.uri,
              type: photo.type || "image/jpeg",
              name: photo.name || `hostel_photo_${index}_${Date.now()}.jpg`,
            } as any);
          }
        });
      }

      // Room photos (if any)
      if (data.roomPhotos && data.roomPhotos.length > 0) {
        data.roomPhotos.forEach((photo: any, index: number) => {
          if (photo.uri) {
            formData.append("roomPhotos", {
              uri: photo.uri,
              type: photo.type || "image/jpeg",
              name: photo.name || `room_photo_${index}_${Date.now()}.jpg`,
            } as any);
          }
        });
      }

      const response = await this.api.put(
        `/api/hostelService/updateHostelService/${hostelServiceId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Update Hostel Service Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update hostel service.",
      };
    }
  }

  async deleteHostelService(hostelServiceId: string) {
    try {
      const response = await this.api.delete(
        `/api/hostelService/deleteHostelService/${hostelServiceId}`,
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
      console.error("Delete Hostel Service Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete hostel service.",
      };
    }
  }

  async deleteRoomPhotos(hostelServiceId: string, roomId: string, photoUrls: string[]) {
    try {
      const response = await this.api.delete(
        `/api/hostelService/deleteRoomPhotos/${hostelServiceId}/${roomId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            photoUrls: photoUrls,
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Delete Room Photos Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete room photos.",
      };
    }
  }

 //privacy policy and term & condition

async getPrivacyPolicy() {
  try {
    const response = await this.api.get("/api/privacyPolicy/getPrivacyPolicy");
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get privacy policy",
    };
  }
}

async getTermAndCondition() {
  try {
    const response = await this.api.get("/api/termAndCondition/getTermAndCondition");
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get term and condition",
    };
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

}

export default new ApiService();
