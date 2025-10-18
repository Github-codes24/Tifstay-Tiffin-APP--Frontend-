import {
  ApiResponse,
  CompleteFormData,
  CreateHostelServiceRequest,
  FormPage1Data,
  FormPage2Data,
  HostelService,
  PaginationData,
  UpdateHostelServiceRequest,
} from "@/types/hostel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosResponse } from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import hostelApiService from "../services/hostelApiService";
import tiffinApiService from "../services/tiffinApiServices";
import useAuthStore from "./authStore";

interface ServiceState {
  // Data
  hostelServices: HostelService[];
  tiffinServices: any[];
  selectedHostelService: HostelService | null;
  selectedTiffinService: any | null;
  mealSchedule: any | null;
  isLoading: boolean;
  error: string | null;
  totalServicesCount: number;
  requestedServicesCount: number;
  acceptedServicesCount: number;
  cancelledServicesCount: number;
  pagination: PaginationData | null;
  overallRating: number;
  totalReviews: number;

  hostelServicesList: any[];
  offlineReasons: string[];
  comebackOptions: string[];
  earningsAnalyticsData: {
    totalEarnings: number;
    period: string;
    percentageChange: number;
  } | null;
  currentDay: string;

  // Form data for multi-step form
  formPage1Data: FormPage1Data | null;
  formPage2Data: FormPage2Data | null;

  // Actions
  createHostelService: (data: CreateHostelServiceRequest) => Promise<ApiResponse<HostelService>>;
  getAllHostelServices: (page?: number, limit?: number) => Promise<ApiResponse<any>>;
  getAllTiffinServices: (page?: number, limit?: number) => Promise<ApiResponse<any>>;
  getTiffinServiceById: (tiffinId: string) => Promise<ApiResponse<any>>;
  getTiffinServiceList: () => Promise<void>;
  getMealSchedule: (tiffinServiceId: string) => Promise<void>;
  updateMealSchedule: (tiffinServiceId: string, customDaySchedules: any[]) => Promise<void>;
  updateHostelService: (hostelServiceId: string, data: UpdateHostelServiceRequest) => Promise<ApiResponse<HostelService>>;
  deleteHostelService: (hostelServiceId: string) => Promise<ApiResponse<any>>;
  deleteRoomPhotos: (hostelServiceId: string, roomId: string, photoUrls: string[]) => Promise<ApiResponse<any>>;
  getTotalServicesCount: () => Promise<ApiResponse<any>>;
  getRequestedServicesCount: () => Promise<ApiResponse<any>>;
  getAcceptedServicesCount: () => Promise<ApiResponse<any>>;
  getCancelledServicesCount: () => Promise<ApiResponse<any>>;
  getReviewsSummary: (
    page?: number, 
    limit?: number, 
    filter?: string
  ) => Promise<ApiResponse<any>>;
  getHostelServicesList: (page?: number, limit?: number) => Promise<ApiResponse<any>>;
  getEarningsAnalytics: (type: "hostel_owner" | "tiffin_provider") => Promise<any>;

  // Offline/Online Status Management
  updateHostelServiceOfflineStatus: (payload: {
    hostelServiceIds: string[];
    offlineType: "immediate" | "scheduled";
    reason: string;
    comeBackOption: string;
  }) => Promise<ApiResponse<any>>;
  updateHostelServiceOnlineStatus: (serviceIds: string[]) => Promise<ApiResponse<any>>;
  getOfflineReasons: (offlineType: "immediate" | "scheduled") => Promise<ApiResponse<any>>;
  getComebackOptions: () => Promise<ApiResponse<any>>;

  // Form management
  setFormPage1Data: (data: FormPage1Data) => void;
  setFormPage2Data: (data: FormPage2Data) => void;
  getCompleteFormData: () => CompleteFormData | null;
  clearFormData: () => void;

  // Utility
  clearError: () => void;
  setSelectedHostelService: (hostelService: HostelService | null) => void;
  setSelectedTiffinService: (tiffinService: any | null) => void;
}

const useServiceStore = create<ServiceState>()(
  persist(
    (set, get) => ({
      // Initial state
      hostelServices: [],
      tiffinServices: [],
      selectedHostelService: null,
      selectedTiffinService: null,
      mealSchedule: null,
      isLoading: false,
      totalServicesCount: 0,
      requestedServicesCount: 0,
      acceptedServicesCount: 0,
      cancelledServicesCount: 0,
      error: null,
      formPage1Data: null,
      formPage2Data: null,
      overallRating: 0,
      totalReviews: 0,
      pagination: null,
      offlineReasons: [],
      comebackOptions: [],
      hostelServicesList: [],
      earningsAnalyticsData: null,
      currentDay: "",

      // ==================== TIFFIN MEAL SCHEDULE ACTIONS ====================

      // Get Tiffin Service List (for meal schedule management)
      getTiffinServiceList: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await tiffinApiService.getTiffinServiceList();
          
          if (response.success) {
            set({
              tiffinServices: response.data.services,
              currentDay: response.data.currentDay,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch tiffin services",
            isLoading: false,
          });
          throw error;
        }
      },

      // Get Meal Schedule for a specific tiffin service
      getMealSchedule: async (tiffinServiceId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await tiffinApiService.getMealSchedule(tiffinServiceId);
          
          if (response.success) {
            set({
              mealSchedule: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch meal schedule",
            isLoading: false,
          });
          throw error;
        }
      },

      // Update Meal Schedule
      updateMealSchedule: async (tiffinServiceId: string, customDaySchedules: any[]) => {
        try {
          set({ isLoading: true, error: null });
          const response = await tiffinApiService.updateMealSchedule(
            tiffinServiceId,
            customDaySchedules
          );
          
          if (response.success) {
            // Refresh meal schedule after update
            await get().getMealSchedule(tiffinServiceId);
            // Refresh tiffin services list to show updated currentDaySchedule
            await get().getTiffinServiceList();
            
            set({ isLoading: false });
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to update meal schedule",
            isLoading: false,
          });
          throw error;
        }
      },

      // ==================== COUNT ACTIONS ====================

      // Get Total Services Count
      getTotalServicesCount: async () => {
        set({ isLoading: true, error: null });

        try {
          const userServiceType = useAuthStore.getState().userServiceType;
          let response: AxiosResponse;

          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.getTotalHostelServicesCount();
          } else {
            response = await tiffinApiService.getTotalTiffinServicesCount();
          }

          if (response.status === 200) {
            const count = userServiceType === "hostel_owner" ? response.data.data.requestedHostelServices || 0 : response?.data?.totalBookings || 0;
            set({
              totalServicesCount: count,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Failed to fetch total services count",
            });
            return { success: false, error: response.data.message };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch total services count",
          });
          return { success: false, error: error.message };
        }
      },

      // Get Requested Services Count
      getRequestedServicesCount: async () => {
        set({ isLoading: true, error: null });

        try {
          const userServiceType = useAuthStore.getState().userServiceType;
          let response: AxiosResponse;

          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.getRequestedHostelServicesCount();
          } else {
            response = await tiffinApiService.getRequestedTiffinServicesCount();
          }
          if (response.status === 200) {
            const count = userServiceType === "hostel_owner" ? response.data.data.requestedHostelServices || 0 : response?.data?.totalPendingBookings || 0;
            set({
              requestedServicesCount: count,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Failed to fetch requested services count",
            });
            return { success: false, error: response.data.message };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch requested services count",
          });
          return { success: false, error: error.message };
        }
      },

      // Get Accepted Services Count
      getAcceptedServicesCount: async () => {
        set({ isLoading: true, error: null });

        try {
          const userServiceType = useAuthStore.getState().userServiceType;
          let response: AxiosResponse;

          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.getAcceptedHostelServicesCount();
          } else {
            response = await tiffinApiService.getAcceptedTiffinServicesCount();
          }

          if (response.status === 200) {
            const count = userServiceType === "hostel_owner" ? response.data.data.acceptedHostelServices || 0 : response?.data?.totalConfirmedBookings || 0;
            set({
              acceptedServicesCount: count,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Failed to fetch accepted services count",
            });
            return { success: false, error: response.data.message };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch accepted services count",
          });
          return { success: false, error: error.message };
        }
      },

      // Get Cancelled Services Count
      getCancelledServicesCount: async () => {
        set({ isLoading: true, error: null });

        try {
          const userServiceType = useAuthStore.getState().userServiceType;
          let response: AxiosResponse;

          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.getCancelledHostelServicesCount();
          } else {
            response = await tiffinApiService.getCancelledTiffinServicesCount();
          }
          if (response.status === 200) {
            const count = userServiceType === "hostel_owner" ? response.data.data.cancelledHostelServices || 0 : response?.data?.totalRejectedBookings;
            set({
              cancelledServicesCount: count,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Failed to fetch cancelled services count",
            });
            return { success: false, error: response.data.message };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch cancelled services count",
          });
          return { success: false, error: error.message };
        }
      },

      // ==================== HOSTEL SERVICE ACTIONS ====================

      createHostelService: async (data: CreateHostelServiceRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelApiService.createHostelService(data);

          if (response.success) {
            const allServices = await hostelApiService.getAllHostelServices(1, 10);
            if (allServices.success) {
              set({
                hostelServices: allServices.data?.data?.hostelServices || [],
                pagination: allServices.data?.data?.pagination || null,
                isLoading: false,
                error: null,
              });
            } else {
              set({ isLoading: false });
            }

            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.error || "Failed to create hostel service",
            });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to create hostel service",
          });
          return { success: false, error: error.message };
        }
      },

      getAllHostelServices: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelApiService.getAllHostelServices(page, limit);

          if (response.success) {
            set({
              hostelServices: response.data?.data?.hostelServices || [],
              pagination: response.data?.data?.pagination || null,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.error || "Failed to fetch hostel services",
            });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch hostel services",
          });
          return { success: false, error: error.message };
        }
      },

      getAllTiffinServices: async (page = 1, limit = 10) => {
  set({ isLoading: true, error: null });

  try {
    const response = await tiffinApiService.getAllTiffinServices(page, limit);

    if (response.success) {
      set({
        tiffinServices: response.data?.data?.tiffinServices || [], // ✅ Make sure this is correct
        pagination: response.data?.data?.pagination || null,
        isLoading: false,
        error: null,
      });
      return { success: true, data: response.data };
    } else {
      set({
        isLoading: false,
        error: response.error || "Failed to fetch tiffin services",
      });
      return { success: false, error: response.error };
    }
  } catch (error: any) {
    set({
      isLoading: false,
      error: error.message || "Failed to fetch tiffin services",
    });
    return { success: false, error: error.message };
  }
},
      getTiffinServiceById: async (tiffinId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await tiffinApiService.getTiffinServiceById(tiffinId);

          if (response.success) {
            set({
              selectedTiffinService: response.data?.data || null,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.error || "Failed to fetch tiffin service details",
            });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch tiffin service details",
          });
          return { success: false, error: error.message };
        }
      },

      updateHostelService: async (hostelServiceId: string, data: UpdateHostelServiceRequest) => {
        set({ isLoading: true, error: null });
      
        try {
          const response = await hostelApiService.updateHostelService(hostelServiceId, data);
      
          if (response.success) {
            const detailsResponse = await hostelApiService.getHostelServiceById(hostelServiceId);
            
            const updatedHostelData = detailsResponse.success 
              ? detailsResponse.data.data 
              : response.data?.data;
      
            const updatedServices = get().hostelServices.map(service =>
              service._id === hostelServiceId ? updatedHostelData || service : service
            );
      
            set({
              hostelServices: updatedServices,
              selectedHostelService: updatedHostelData || get().selectedHostelService,
              isLoading: false,
              error: null,
            });
      
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.error || "Failed to update hostel service",
            });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to update hostel service",
          });
          return { success: false, error: error.message };
        }
      },

      deleteHostelService: async (hostelServiceId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelApiService.deleteHostelService(hostelServiceId);

          if (response.success) {
            const updatedServices = get().hostelServices.filter(
              service => service._id !== hostelServiceId
            );

            set({
              hostelServices: updatedServices,
              selectedHostelService: get().selectedHostelService?._id === hostelServiceId
                ? null
                : get().selectedHostelService,
              isLoading: false,
              error: null,
            });

            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.error || "Failed to delete hostel service",
            });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to delete hostel service",
          });
          return { success: false, error: error.message };
        }
      },

      deleteRoomPhotos: async (hostelServiceId: string, roomId: string, photoUrls: string[]) => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelApiService.deleteRoomPhotos(hostelServiceId, roomId, photoUrls);

          if (response.success) {
            if (get().selectedHostelService?._id === hostelServiceId) {
              const updatedService = { ...get().selectedHostelService! };
              updatedService.rooms = updatedService.rooms.map(room =>
                room._id === roomId ? response.data?.data?.room || room : room
              );

              set({
                selectedHostelService: updatedService,
                isLoading: false,
                error: null,
              });
            } else {
              set({ isLoading: false });
            }

            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.error || "Failed to delete room photos",
            });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to delete room photos",
          });
          return { success: false, error: error.message };
        }
      },

      // ==================== OFFLINE/ONLINE STATUS MANAGEMENT ====================

      updateHostelServiceOfflineStatus: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const userServiceType = useAuthStore.getState().userServiceType;
          let response;

          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.updateHostelServiceOfflineStatus(payload);
          } else {
            response = await tiffinApiService.updateTiffinServiceOfflineStatus({
              tiffinServiceIds: payload.hostelServiceIds,
              offlineType: payload.offlineType,
              reason: payload.reason,
              comeBackOption: payload.comeBackOption,
            });
          }

          if (response.success) {
            // Refresh services list
            if (userServiceType === "hostel_owner") {
              await get().getAllHostelServices(1, 10);
            } else {
              await get().getAllTiffinServices(1, 10);
            }
            
            set({
              isLoading: false,
              error: null,
            });
            
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.error || "Failed to update offline status",
            });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to update offline status",
          });
          return { success: false, error: error.message };
        }
      },

      updateHostelServiceOnlineStatus: async (serviceIds: string[]) => {
        set({ isLoading: true, error: null });
      
        try {
          const userServiceType = useAuthStore.getState().userServiceType;
          let response;

          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.updateHostelServiceOnlineStatus(serviceIds);
          } else {
            response = await tiffinApiService.updateTiffinServiceOnlineStatus(serviceIds);
          }
      
          if (response.success) {
            // Refresh services list
            if (userServiceType === "hostel_owner") {
              await get().getAllHostelServices(1, 10);
            } else {
              await get().getAllTiffinServices(1, 10);
            }
            
            set({
              isLoading: false,
              error: null,
            });
            
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.error || "Failed to update online status",
            });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to update online status",
          });
          return { success: false, error: error.message };
        }
      },

      getOfflineReasons: async (offlineType: "immediate" | "scheduled") => {
        try {
          const userServiceType = useAuthStore.getState().userServiceType;
          let response;

          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.getOfflineReasons(offlineType);
          } else {
            response = await tiffinApiService.getOfflineReasons(offlineType);
          }

          if (response.success) {
            set({ offlineReasons: response.data?.data?.offlineReasons || [] });
            return { success: true, data: response.data };
          } else {
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      getComebackOptions: async () => {
        try {
          const userServiceType = useAuthStore.getState().userServiceType;
          let response;

          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.getComebackOptions();
          } else {
            response = await tiffinApiService.getComebackOptions();
          }

          if (response.success) {
            set({ comebackOptions: response.data?.data?.comebackOptions || [] });
            return { success: true, data: response.data };
          } else {
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      getHostelServicesList: async (page = 1, limit = 100) => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelApiService.getHostelServicesList(page, limit);

          if (response.success) {
                     set({
              hostelServicesList: response.data?.data?.hostelServices || [],
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.error || "Failed to fetch hostel services list",
            });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch hostel services list",
          });
          return { success: false, error: error.message };
        }
      },
      

      // ==================== FORM MANAGEMENT ====================

      setFormPage1Data: (data: FormPage1Data) => {
        set({ formPage1Data: data });
      },

      setFormPage2Data: (data: FormPage2Data) => {
        set({ formPage2Data: data });
      },

      getCompleteFormData: (): CompleteFormData | null => {
        const { formPage1Data, formPage2Data } = get();
        if (formPage1Data && formPage2Data) {
          return { ...formPage1Data, ...formPage2Data };
        }
        return null;
      },

      clearFormData: () => {
        set({ formPage1Data: null, formPage2Data: null });
      },

      // ==================== REVIEWS AND RATINGS ====================

   getReviewsSummary: async (page = 1, limit = 10, filter = "all") => {
  set({ isLoading: true, error: null });

  try {
    const userServiceType = useAuthStore.getState().userServiceType;
    let response;

    if (userServiceType === "hostel_owner") {
      response = await hostelApiService.getReviewsSummary(page, limit, filter);
    } else if (userServiceType === "tiffin_provider") {
      response = await tiffinApiService.getReviewsSummary(page, limit, filter);
    } else {
      throw new Error("Invalid user service type");
    }

    if (response.success && response.data) {
      // ✅ Handle response structure - both APIs return data.data
      const data = response.data.data || response.data;

      set({
        overallRating: parseFloat(data.overallRating) || 0,
        totalReviews: data.totalReviews || 0,
        isLoading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } else {
      set({
        isLoading: false,
        error: response.error || "Failed to fetch reviews summary",
      });
      return { success: false, error: response.error };
    }
  } catch (error: any) {
    set({
      isLoading: false,
      error: error.message || "Failed to fetch reviews summary",
    });
    return { success: false, error: error.message };
  }
},

// Add method to get reviews by specific service ID
getReviewsByServiceId: async (
  serviceId: string,
  page = 1,
  limit = 10,
  filter = "all,positive,negative,5,4,3,2,1"
) => {
  set({ isLoading: true, error: null });

  try {
    const userServiceType = useAuthStore.getState().userServiceType;
    let response;

    if (userServiceType === "hostel_owner") {
      response = await hostelApiService.getReviewsByHostelId(
        serviceId,
        page,
        limit,
        filter
      );
    } else if (userServiceType === "tiffin_provider") {
      response = await tiffinApiService.getReviewsByTiffinId(
        serviceId,
        page,
        limit,
        filter
      );
    } else {
      throw new Error("Invalid user service type");
    }

    if (response.success && response.data) {
      const data = response.data.data || response.data;

      set({
        overallRating: parseFloat(data.overallRating) || 0,
        totalReviews: data.totalReviews || 0,
        isLoading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } else {
      set({
        isLoading: false,
        error: response.error || "Failed to fetch reviews",
      });
      return { success: false, error: response.error };
    }
  } catch (error: any) {
    set({
      isLoading: false,
      error: error.message || "Failed to fetch reviews",
    });
    return { success: false, error: error.message };
  }
},

      // ==================== EARNINGS ANALYTICS ====================

      getEarningsAnalytics: async (type: "hostel_owner" | "tiffin_provider") => {
        set({ isLoading: true });

        try {
          let response;
          if (type === "hostel_owner") {
            response = await hostelApiService.getEarningsAnalytics();
          } else {
            response = await tiffinApiService.getEarningsAnalytics();
          }

          if (response.success) {
            set({
              earningsAnalyticsData: response.data,
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
            error: error.message || "Failed to fetch earnings data",
          });
          return { success: false, error: error.message };
        }
      },

      // ==================== UTILITY ACTIONS ====================

      clearError: () => set({ error: null }),

      setSelectedHostelService: (hostelService: HostelService | null) =>
        set({ selectedHostelService: hostelService }),

      setSelectedTiffinService: (tiffinService: any | null) =>
        set({ selectedTiffinService: tiffinService }),
    }),
    {
      name: 'service-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useServiceStore;