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

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const { default: useAuthStore } = await import("@/store/authStore");
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
        return response;
      },
      async (error) => {
        console.error(
          "Response Error:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 401) {
          const { default: useAuthStore } = await import("@/store/authStore");
          useAuthStore.setState({
            token: null,
            isAuthenticated: false,
            user: null,
          });
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async login(email: string, password: string) {
    return this.api.post("/api/tiffinOwner/loginOwner", { email, password });
  }

  async register(name: string, email: string, password: string) {
    try {
      const response = await this.api.post("/api/tiffinOwner/registerOwner", {
        name,
        email,
        password,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed. Please try again.",
      };
    }
  }

  async forgotPassword(email: string) {
    return this.api.post("/api/tiffinOwner/forgotOwnerPassword", { email });
  }

  async verifyOtp(email: string, otp: string) {
    return this.api.post("/api/tiffinOwner/verifyOwnerOtp", { email, otp });
  }

  async resetPassword(token: string, password: string) {
    return this.api.post("/api/tiffinOwner/resetOwnerPassword", { token, password });
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

  async logout() {
    try {
      const response = await this.api.post("/api/tiffinOwner/logoutOwner");
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
    label: "home" | "work";
  }) {
    try {
      const response = await this.api.post("/api/tiffinOwner/address/addAddress", addressData);
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
      const response = await this.api.get("/api/tiffinOwner/address/getAllAddresses");
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
      const response = await this.api.get(`/api/tiffinOwner/address/getAddress/${addressId}`);
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
    label: "homw" | "work";
  }) {
    try {
      const response = await this.api.put(`/api/tiffinOwner/address/editAddress/${addressId}`, addressData);
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
      const response = await this.api.delete(`/api/tiffinOwner/address/deleteAddress/${addressId}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete address",
      };
    }
  }

  // Tiffin Service CRUD Operations
  async createTiffinService(data: any) {
    try {
      const formData = new FormData();

      formData.append("tiffinName", data.tiffinName);
      formData.append("tiffinType", data.tiffinType);
      formData.append("description", data.description);
      formData.append("securityDeposit", data.securityDeposit.toString());

      if (data.offers) {
        formData.append("offers", data.offers);
      }

      formData.append("location", JSON.stringify(data.location));
      formData.append("contactInfo", JSON.stringify(data.contactInfo));
      formData.append("meals", JSON.stringify(data.meals));
      formData.append("facilities", JSON.stringify(data.facilities));
      formData.append("pricing", JSON.stringify(data.pricing));
      formData.append("rulesAndPolicies", data.rulesAndPolicies);

      if (data.tiffinPhotos && data.tiffinPhotos.length > 0) {
        data.tiffinPhotos.forEach((photo: any, index: number) => {
          if (photo.uri) {
            formData.append("tiffinPhotos", {
              uri: photo.uri,
              type: photo.type || "image/jpeg",
              name: photo.name || `tiffin_photo_${index}.jpg`,
            } as any);
          }
        });
      }

      if (data.mealsWithPhotos && data.mealsWithPhotos.length > 0) {
        data.mealsWithPhotos.forEach((meal: any, mealIndex: number) => {
          if (meal.mealPhotos && meal.mealPhotos.length > 0) {
            meal.mealPhotos.forEach((photo: any) => {
              if (photo && photo.uri) {
                const fieldName = `mealPhotos_${mealIndex}`;
                formData.append(fieldName, {
                  uri: photo.uri,
                  type: photo.type || "image/jpeg",
                  name: photo.name || `meal_${mealIndex}_photo_${Date.now()}.jpg`,
                } as any);
              }
            });
          }
        });
      }

      const response = await this.api.post("/api/tiffinService/createTiffinService", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
        },
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("❌ Create Tiffin Service Error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create tiffin service.",
      };
    }
  }

  async updateTiffinService(tiffinServiceId: string, data: any) {
    try {
      const formData = new FormData();

      formData.append("tiffinName", data.tiffinName);
      formData.append("tiffinType", data.tiffinType);
      formData.append("description", data.description);
      formData.append("securityDeposit", data.securityDeposit.toString());

      if (data.offers) {
        formData.append("offers", data.offers);
      }

      formData.append("location", JSON.stringify(data.location));
      formData.append("contactInfo", JSON.stringify(data.contactInfo));
      formData.append("meals", JSON.stringify(data.meals));
      formData.append("facilities", JSON.stringify(data.facilities));
      formData.append("pricing", JSON.stringify(data.pricing));
      formData.append("rulesAndPolicies", data.rulesAndPolicies);

      // ✅ Only upload NEW tiffin photos
      if (data.tiffinPhotos && data.tiffinPhotos.length > 0) {
        data.tiffinPhotos.forEach((photo: any, index: number) => {
          if (photo.uri && !photo.isExisting) {
            formData.append("tiffinPhotos", {
              uri: photo.uri,
              type: photo.type || "image/jpeg",
              name: photo.name || `tiffin_photo_${index}_${Date.now()}.jpg`,
            } as any);
          }
        });
      }

      // ✅ Only upload NEW meal photos
      if (data.mealsWithPhotos && data.mealsWithPhotos.length > 0) {
        data.mealsWithPhotos.forEach((meal: any, mealIndex: number) => {
          if (meal.mealPhotos && meal.mealPhotos.length > 0) {
            meal.mealPhotos.forEach((photo: any) => {
              if (photo && photo.uri && !photo.isExisting) {
                const fieldName = `mealPhotos_${mealIndex}`;
                formData.append(fieldName, {
                  uri: photo.uri,
                  type: photo.type || "image/jpeg",
                  name: photo.name || `meal_${mealIndex}_photo_${Date.now()}.jpg`,
                } as any);
              }
            });
          }
        });
      }

      const response = await this.api.put(
        `/api/tiffinService/updateTiffinService/${tiffinServiceId}`,
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
      console.error("❌ Update Tiffin Service Error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update tiffin service.",
      };
    }
  }

  async deleteMealPhotos(tiffinServiceId: string, mealId: string, photoUrls: string[]) {
    try {
      const response = await this.api.delete(
        `/api/tiffinService/deleteMealPhotos/${tiffinServiceId}/${mealId}`,
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
      console.error("❌ Delete Meal Photos Error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete meal photos.",
      };
    }
  }

  async deleteTiffinPhotos(tiffinServiceId: string, photoUrls: string[]) {
    try {
      const response = await this.api.delete(
        `/api/tiffinService/deleteTiffinPhotos/${tiffinServiceId}`,
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
      console.error("❌ Delete Tiffin Photos Error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete tiffin photos.",
      };
    }
  }

  async getAllTiffinServices(page: number = 1, limit: number = 10) {
    try {
      const response = await this.api.get(
        `/api/tiffinService/getTiffinServicesByOwner?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get All Tiffin Services Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch tiffin services.",
      };
    }
  }

  async getTiffinServicesList(page: number = 1, limit: number = 100) {
    try {
      const response = await this.api.get(
        `/api/tiffinService/getTiffinServicesList`,
        {
          params: { page, limit },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("❌ Get Tiffin Services List Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch tiffin services list.",
      };
    }
  }

  async getAllMealsByTiffinId(tiffinId: string) {
    try {
      const response = await this.api.get(`/api/tiffinService/getAllMeals/${tiffinId}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("❌ Get All Meals Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch meals.",
      };
    }
  }

  async getTiffinServiceById(tiffinServiceId: string) {
    try {
      const response = await this.api.get(
        `/api/tiffinService/getTiffinServiceById/${tiffinServiceId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get Tiffin Service By ID Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch tiffin service details.",
      };
    }
  }

  async deleteTiffinService(tiffinServiceId: string) {
    try {
      const response = await this.api.delete(
        `/api/tiffinService/deleteTiffinService/${tiffinServiceId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Delete Tiffin Service Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete tiffin service.",
      };
    }
  }

  async getTotalTiffinServicesCount() {
  return this.api.get("/api/tiffinOwner/bookings/getTotalBookingsCount");
}

async getRequestedTiffinServicesCount() {
  return this.api.get("/api/tiffinOwner/bookings/getTotalPendingBookingCount");
}

async getAcceptedTiffinServicesCount() {
  return this.api.get("/api/tiffinOwner/bookings/getTotalConfirmedBookingCount");
}

async getCancelledTiffinServicesCount() {
  return this.api.get("/api/tiffinOwner/bookings/getTotalRejectedBookingCount");
}


  // Offline/Online Status Management
  async updateTiffinServiceOfflineStatus(payload: {
    tiffinServiceIds: string[];
    offlineType: "immediate" | "scheduled";
    reason: string;
    comeBackOption: string;
  }) {
    try {
      const response = await this.api.put(
        "/api/tiffinService/updateTiffinServiceOfflineStatus",
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

  async updateTiffinServiceOnlineStatus(serviceIds: string[]) {
    try {
      const response = await this.api.put(
        "/api/tiffinService/updateTiffinServiceOnlineStatus",
        { tiffinServiceIds: serviceIds },
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
        "/api/tiffinService/getOfflineReasons",
        {
          params: { offlineType },
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
      const response = await this.api.get("/api/tiffinService/getComeBackOptions");
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
      const response = await this.api.get("/api/tiffinOwner/staticPage/get-privacy-policy");
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
      const response = await this.api.get("/api/tiffinOwner/staticPage/get-terms-and-conditions");
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get term and condition",
      };
    }
  }

  // Reviews
  async getReviewsByTiffinId(tiffinId: string, page: number = 1, limit: number = 10, rating?: number) {
    try {
      let url = `/api/tiffinOwner/reviews/getReviewsByTiffinId/${tiffinId}?page=${page}&limit=${limit}`;
      if (rating) {
        url += `&rating=${rating}`;
      }
      const response = await this.api.get(url);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get Reviews By Tiffin ID Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch tiffin reviews.",
      };
    }
  }

  async getReviewsSummary(page: number = 1, limit: number = 10, ratingType?: string) {
    try {
      const response = await this.api.get(`/api/tiffinService/getAllOwnerTiffinReviews?page=${page}&limit=${limit}&${ratingType ? `ratingType=${ratingType}` : ""}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Get Reviews Summary Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch reviews summary.",
      };
    }
  }

  // User Profile
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
      const response = await this.api.get("api/tiffinOwner/getOwnerProfile");
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

      const response = await this.api.put("/api/tiffinOwner/updateOwnerProfile", formData, {
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

  // Booking Management
// Booking Management - UPDATED SECTION
async getBookingsByStatus(status: string) {
  try {
    // ✅ Validate status parameter
    if (!status) {
      return {
        success: false,
        error: "Status parameter is required",
      };
    }

    const response = await this.api.get(
      `/api/tiffinOwner/bookings/getBookingsByStatus`,
      {
        params: { status },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Normalize response structure to match hostel service pattern
    if (response.data.success && response.data.data) {
      return {
        success: true,
        data: {
          bookings: response.data.data.bookings || [],
          pagination: response.data.data.pagination || null,
        },
      };
    }

    return {
      success: false,
      error: response.data.message || "Failed to fetch bookings.",
    };
  } catch (error: any) {
    console.error("❌ Get Bookings By Status Error:", error);
    
    // ✅ Better error handling
    if (error.response) {
      // Server responded with error
      return {
        success: false,
        error: error.response.data?.message || "Failed to fetch bookings.",
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: "No response from server. Please check your connection.",
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message || "Failed to fetch bookings.",
      };
    }
  }
}

async updateBookingStatus(bookingId: string, status: "Confirmed" | "Rejected") {
  try {
    // ✅ Validate parameters
    if (!bookingId) {
      return {
        success: false,
        error: "Booking ID is required",
      };
    }

    if (!status || !["Confirmed", "Rejected"].includes(status)) {
      return {
        success: false,
        error: "Valid status is required (Confirmed or Rejected)",
      };
    }

    const response = await this.api.put(
      `/api/tiffinOwner/bookings/updateBookingStatus/${bookingId}`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Check response structure
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || `Booking ${status.toLowerCase()} successfully`,
      };
    }

    return {
      success: false,
      error: response.data.message || `Failed to ${status.toLowerCase()} booking.`,
    };
  } catch (error: any) {
    console.error("❌ Update Booking Status Error:", error);
    
    // ✅ Better error handling
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || `Failed to ${status.toLowerCase()} booking.`,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "No response from server. Please check your connection.",
      };
    } else {
      return {
        success: false,
        error: error.message || `Failed to ${status.toLowerCase()} booking.`,
      };
    }
  }
}

async acceptBooking(bookingId: string) {
  return this.updateBookingStatus(bookingId, "Confirmed");
}

async rejectBooking(bookingId: string) {
  return this.updateBookingStatus(bookingId, "Rejected");
}

// ✅ Add method to get booking by ID (if needed)
async getBookingById(bookingId: string) {
  try {
    if (!bookingId) {
      return {
        success: false,
        error: "Booking ID is required",
      };
    }

    const response = await this.api.get(
      `/api/tiffinOwner/bookings/getBookingById/${bookingId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.message || "Failed to fetch booking details.",
    };
  } catch (error: any) {
    console.error("❌ Get Booking By ID Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch booking details.",
    };
  }
}

// ✅ Add method to get all bookings (optional)
async getAllBookings(page: number = 1, limit: number = 10) {
  try {
    const response = await this.api.get(
      `/api/tiffinOwner/bookings/getAllBookings`,
      {
        params: { page, limit },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success && response.data.data) {
      return {
        success: true,
        data: {
          bookings: response.data.data.bookings || [],
          pagination: response.data.data.pagination || null,
        },
      };
    }

    return {
      success: false,
      error: response.data.message || "Failed to fetch bookings.",
    };
  } catch (error: any) {
    console.error("❌ Get All Bookings Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch bookings.",
    };
  }
}

  // Customer Management
  async getAllCustomerList(page: number = 1, limit: number = 10) {
    try {
      const response = await this.api.get(
        `/api/tiffinOwner/customer/getAllCustomers`,
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
        `/api/tiffinOwner/customer/getCustomerById/${customerId}`
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

  async getTiffinOwnerPreviousChat() {
    try {
      const response = await this.api.get("/api/message/getTiffinOwnerPreviousChat");
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load messages",
      };
    }
  }

  // Earnings
  async getEarningsAnalytics() {
    try {
      const response = await this.api.get("/api/tiffinOwner/earnings/analytics");
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
      const response = await this.api.get("/api/tiffinOwner/earnings/overview");
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
      const response = await this.api.get("/api/tiffinOwner/earnings/payoutHistory");
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
   // Get Tiffin Service List
  async getTiffinServiceList() {
    const response = await this.api.get(
      "/api/tiffinOwner/mealSchedule/getTiffinServiceList"
    );
    return response.data;
  }

  // Get Meal Schedule for a specific tiffin service
  async getMealSchedule(tiffinServiceId: string) {
    const response = await this.api.get(
      `/api/tiffinOwner/mealSchedule/getMealSchedule/${tiffinServiceId}`
    );
    return response.data;
  }

  // Update Meal Schedule
  async updateMealSchedule(
    tiffinServiceId: string,
    customDaySchedules: any[]
  ) {
    const response = await this.api.put(
      "/api/tiffinOwner/mealSchedule/updateMealSchedule",
      {
        tiffinServiceId,
        customDaySchedules,
      }
    );
    return response.data;
  }
}

export default new TiffinApiService();