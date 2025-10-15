import useAuthStore from "@/store/authStore";
import { ApiResponse, CreateHostelServiceRequest, HostelServicesListResponse, UpdateHostelServiceRequest, } from "@/types/hostel";
import axios, { AxiosInstance } from "axios";

class ApiService {
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

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.error(
          "Response Error:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 401) {
          useAuthStore.setState({ token: null, isAuthenticated: false, user: null, });
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async login(email: string, password: string) {
    return this.api.post("/api/hostelOwner/loginOwner", { email, password });
  }

  async register(fullName: string, email: string, password: string) {
    try {
      const response = await this.api.post("/api/hostelOwner/registerOwner", {
        fullName,
        email,
        password,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error:  
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  }

  async forgotPassword(email: string) {
    return this.api.post("/api/hostelOwner/forgotOwnerPassword", { email });
  }

  async verifyOtp(email: string, otp: string) {
    return this.api.post("/api/hostelOwner/verifyOwnerOtp", { email, otp });
  }

  async resetPassword(token: string, password: string) {
    return this.api.post("/api/hostelOwner/resetOwnerPassword", { token, password });
  }

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
        error: error.response?.data?.message || "Password change failed. Please try again.",
      };
    }
  }

  async logout() {
    try {
      const response = await this.api.post("/api/hostelOwner/logoutOwner");
      return { success: true, data: response.data };
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
      return { success: true, data: response.data.data };
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
      return { success: true, data: response.data.data };
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
      return { success: true, data: response.data.data };
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
      return { success: true, data: response.data.data };
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
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete address",
      };
    }
  }

  async createHostelService(data: CreateHostelServiceRequest) {
    try {
      const formData = new FormData();

      formData.append("hostelName", data.hostelName);
      formData.append("hostelType", data.hostelType);
      formData.append("description", data.description);
      formData.append("securityDeposit", data.securityDeposit.toString());

      if (data.offers) {
        formData.append("offers", data.offers);
      }

      formData.append("location", JSON.stringify(data.location));
      formData.append("contactInfo", JSON.stringify(data.contactInfo));
      formData.append("rooms", JSON.stringify(data.rooms));
      formData.append("facilities", JSON.stringify(data.facilities));
      formData.append("pricing", JSON.stringify(data.pricing));
      formData.append("rulesAndPolicies", data.rulesAndPolicies);

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

      if (data.roomsWithPhotos && data.roomsWithPhotos.length > 0) {
        data.roomsWithPhotos.forEach((room: any, roomIndex: number) => {
          if (room.roomPhotos && room.roomPhotos.length > 0) {
            room.roomPhotos.forEach((photo: any) => {
              if (photo && photo.uri) {
                const fieldName = `roomPhotos_${roomIndex}`;
                formData.append(fieldName, {
                  uri: photo.uri,
                  type: photo.type || "image/jpeg",
                  name: photo.name || `room_${roomIndex}_photo_${Date.now()}.jpg`,
                } as any);
              }
            });
          }
        });
      }

      const response = await this.api.post("/api/hostelService/createHostelService", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
        },
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("❌ Create Hostel Service Error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create hostel service.",
      };
    }
  }

  async updateHostelService(hostelServiceId: string, data: UpdateHostelServiceRequest) {
    try {
      const formData = new FormData();

      formData.append("hostelName", data.hostelName);
      formData.append("hostelType", data.hostelType);
      formData.append("description", data.description);
      formData.append("securityDeposit", data.securityDeposit.toString());

      if (data.offers) {
        formData.append("offers", data.offers);
      }

      formData.append("location", JSON.stringify(data.location));
      formData.append("contactInfo", JSON.stringify(data.contactInfo));
      formData.append("rooms", JSON.stringify(data.rooms));
      formData.append("facilities", JSON.stringify(data.facilities));
      formData.append("pricing", JSON.stringify(data.pricing));
      formData.append("rulesAndPolicies", data.rulesAndPolicies);

      // ✅ Only upload NEW hostel photos
      if (data.hostelPhotos && data.hostelPhotos.length > 0) {
        data.hostelPhotos.forEach((photo: any, index: number) => {
          if (photo.uri && !photo.isExisting) {
            formData.append("hostelPhotos", {
              uri: photo.uri,
              type: photo.type || "image/jpeg",
              name: photo.name || `hostel_photo_${index}_${Date.now()}.jpg`,
            } as any);
          }
        });
      }

      // ✅ Only upload NEW room photos
      if (data.roomsWithPhotos && data.roomsWithPhotos.length > 0) {
        data.roomsWithPhotos.forEach((room: any, roomIndex: number) => {
          if (room.roomPhotos && room.roomPhotos.length > 0) {
            room.roomPhotos.forEach((photo: any) => {
              if (photo && photo.uri && !photo.isExisting) {
                const fieldName = `roomPhotos_${roomIndex}`;
                formData.append(fieldName, {
                  uri: photo.uri,
                  type: photo.type || "image/jpeg",
                  name: photo.name || `room_${roomIndex}_photo_${Date.now()}.jpg`,
                } as any);
              }
            });
          }
        });
      }

      const response = await this.api.put(
        `/api/hostelService/updateHostelService/${hostelServiceId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("❌ Update Hostel Service Error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update hostel service.",
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

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("❌ Delete Room Photos Error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete room photos.",
      };
    }
  }

  async deleteHostelPhotos(hostelServiceId: string, photoUrls: string[]) {
    try {
      
      const response = await this.api.delete(
        `/api/hostelService/deleteHostelPhotos/${hostelServiceId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            photoUrls: photoUrls,
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("❌ Delete Hostel Photos Error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete hostel photos.",
      };
    }
  }

  async getAllHostelServices(page: number = 1, limit: number = 10): Promise<ApiResponse<HostelServicesListResponse>> {
    try {
      const response = await this.api.get(
        `/api/hostelService/getHostelServicesByOwner?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get All Hostel Services Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch hostel services.",
      };
    }
  }
  // Add this method to your ApiService class in hostelApiService.ts

async getHostelServicesList(page: number = 1, limit: number = 100) {
  try {
    const response = await this.api.get(
      `/api/hostelService/getHostelServicesList`,
      {
        params: { page, limit },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("❌ Get Hostel Services List Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch hostel services list.",
    };
  }
}

 
async getAllRoomsByHostelId(hostelId: string) {
  try {
    const response = await this.api.get(`/api/hostelService/getAllRooms/${hostelId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("❌ Get All Rooms Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch rooms.",
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
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get Hostel Service By ID Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch hostel service details.",
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
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Delete Hostel Service Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete hostel service.",
      };
    }
  }

  async getTotalHostelServicesCount() {
    return this.api.get("/api/hostelService/getTotalHostelServicesCount");
  }

  async getRequestedHostelServicesCount() {
    return this.api.get("/api/hostelService/getRequestedHostelServicesCount");
  }

  async getAcceptedHostelServicesCount() {
    return this.api.get("/api/hostelService/getAcceptedHostelServicesCount");
  }

  async getCancelledHostelServicesCount() {
    return this.api.get("/api/hostelService/getCancelledHostelServicesCount");
  }
//offline 
async updateHostelServiceOfflineStatus(payload: {
  hostelServiceIds: string[];
  offlineType: "immediate" | "scheduled";
  reason: string;
  comeBackOption: string;
}) {
  try {
    const response = await this.api.put(
      "/api/hostelService/updateHostelServiceOfflineStatus",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("❌ Update Offline Status Error:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update offline status.",
    };
  }
}

async updateHostelServiceOnlineStatus(serviceIds: string[]) {
  try {
    const response = await this.api.put(
      "/api/hostelService/updateHostelServiceOnlineStatus",
      { hostelServiceIds: serviceIds },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("❌ Update Online Status Error:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update online status.",
    };
  }
}

async getOfflineReasons(offlineType: "immediate" | "scheduled") {
  try {
    const response = await this.api.get(
      "/api/hostelService/getOfflineReasons",
      {
        params: { offlineType }, // ✅ Pass as query param
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("❌ Get Offline Reasons Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch offline reasons.",
    };
  }
}

async getComebackOptions() {
  try {
    const response = await this.api.get("/api/hostelService/getComeBackOptions");
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("❌ Get Comeback Options Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch comeback options.",
    };
  }
}
  // Privacy Policy and Terms
  async getPrivacyPolicy() {
    try {
      const response = await this.api.get("/api/hostelOwner/staticPage/get-privacy-policy");
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get privacy policy",
      };
    }
  }

  async getTermAndCondition() {
    try {
      const response = await this.api.get("/api/hostelOwner/staticPage/get-terms-and-conditions");
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get term and condition",
      };
    }
  }

  // Reviews
  async getAllReviews(page: number = 1, limit: number = 10, rating?: number) {
    try {
      let url = `/api/hostelOwner/reviews/getAllReviews?page=${page}&limit=${limit}`;
      if (rating) {
        url += `&rating=${rating}`;
      }
      const response = await this.api.get(url);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get All Reviews Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch reviews.",
      };
    }
  }

  async getReviewsByHostelId(hostelId: string, page: number = 1, limit: number = 10, rating?: string) {
    try {
      let url = `/api/hostelOwner/reviews/getReviewsByHostelId/${hostelId}?page=${page}&limit=${limit}`;
      if (rating) {
        url += `&rating=${rating}`;
      }
      const response = await this.api.get(url);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get Reviews By Hostel ID Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch hostel reviews.",
      };
    }
  }

  async getReviewsSummary() {
    try {
      const response = await this.api.get("/api/hostelOwner/reviews/getAllReviews?page=1&limit=1");
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get Reviews Summary Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch reviews summary.",
      };
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.api.get("/api/auth/me");
      return { success: true, data: response.data };
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
      return { success: true, data: response.data };
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

      formData.append("fullName", profileData.fullName);
      formData.append("email", profileData.email);
      formData.append("phoneNumber", profileData.phoneNumber);

      formData.append("bankDetails[accountNumber]", profileData.bankDetails.accountNumber);
      formData.append("bankDetails[ifscCode]", profileData.bankDetails.ifscCode);
      formData.append("bankDetails[accountType]", profileData.bankDetails.accountType);
      formData.append("bankDetails[accountHolderName]", profileData.bankDetails.accountHolderName);
      formData.append("bankDetails[bankName]", profileData.bankDetails.bankName);

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

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update profile",
      };
    }
  }
//Booking
async getBookingsByStatus(status: string) {
  try {
    const response = await this.api.get(
      `/api/hostelOwner/bookings/getBookingsByStatus`,
      {
        params: { status },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch bookings.",
    };
  }
}

async updateBookingStatus(bookingId: string, status: "Confirmed" | "Rejected") {
  try {
    const response = await this.api.put(
      `/api/hostelOwner/bookings/updateBookingStatus/${bookingId}`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || `Failed to ${status.toLowerCase()} booking.`,
    };
  }
}

async acceptBooking(bookingId: string) {
  return this.updateBookingStatus(bookingId, "Confirmed");
}

async rejectBooking(bookingId: string) {
  return this.updateBookingStatus(bookingId, "Rejected");
}

async getAllCustomerList(page: number = 1, limit: number = 10) {
  try {
    const response = await this.api.get(
      `/api/hostelOwner/customer/getAllCustomers`,
      { params: { page, limit } }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch customers.",
    };
  }
}

async getCustomerInfo(customerId: string) {
  try {
    const response = await this.api.get(
      `/api/hostelOwner/customer/getCustomerById/${customerId}`
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch customer info.",
    };
  }
}
// Chat API
async sendMessageToAdmin(message: string) {
  try {
    const response = await this.api.post("/api/message/sendMessage", { message });
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send message",
    };
  }
}

  async getHostelOwnerPreviousChat() {
    try {
      const response = await this.api.get("/api/message/getHostelOwnerPreviousChat");
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load messages",
      };
    }
  }
  //earning 
async getEarningsAnalytics() {
  try {
    const response = await this.api.get("/api/hostelOwner/earnings/analytics");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get earnings data",
    };
  }
}
async getEarningsOverview() {
    try {
      const response = await this.api.get("/api/hostelOwner/earnings/overview");
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get earnings data",
      };
    }
  }
async getEarningsHistory() {
  try {
    const response = await this.api.get("/api/hostelOwner/earnings/payoutHistory");
    return {
      success: true,
      data: response.data.data.payouts,
      pagination: response.data.data.pagination,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get earnings history",
    };
  }
}
}

export default new ApiService();
