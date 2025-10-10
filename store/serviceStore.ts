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
import hostelServiceApiService from "../services/hostelApiService";
import tiffinApiService from "../services/tiffinApiServices";
import useAuthStore from "./authStore";

interface ServiceState {
  // Data
  hostelServices: HostelService[];
  selectedHostelService: HostelService | null;
  isLoading: boolean;
  error: string | null;
  totalServicesCount: number;
  requestedServicesCount: number;
  acceptedServicesCount: number;
  cancelledServicesCount: number;
  pagination: PaginationData | null;
  overallRating: number;
  totalReviews: number;
  
  // Offline/Online Management
  offlineReasons: string[];
  comebackOptions: string[];
  
  // Form data for multi-step form
  formPage1Data: FormPage1Data | null;
  formPage2Data: FormPage2Data | null;

  // Actions
  createHostelService: (data: CreateHostelServiceRequest) => Promise<ApiResponse<HostelService>>;
  getAllHostelServices: (page?: number, limit?: number) => Promise<ApiResponse<any>>;
  updateHostelService: (hostelServiceId: string, data: UpdateHostelServiceRequest) => Promise<ApiResponse<HostelService>>;
  deleteHostelService: (hostelServiceId: string) => Promise<ApiResponse<any>>;
  deleteRoomPhotos: (hostelServiceId: string, roomId: string, photoUrls: string[]) => Promise<ApiResponse<any>>;
  getTotalServicesCount: () => Promise<ApiResponse<any>>;
  getRequestedServicesCount: () => Promise<ApiResponse<any>>;
  getAcceptedServicesCount: () => Promise<ApiResponse<any>>;
  getCancelledServicesCount: () => Promise<ApiResponse<any>>;
  getReviewsSummary: () => Promise<ApiResponse<any>>;

  // Offline/Online Status Management
  updateHostelServiceOfflineStatus: (payload: {
    hostelServiceIds: string[];
    offlineType: "immediate" | "scheduled";
    reason: string;
    comeBackOption: string;
  }) => Promise<ApiResponse<any>>;
  updateHostelServiceOnlineStatus: (serviceIds: string[]) => Promise<ApiResponse<any>>;
  getOfflineReasons: (offlineType: string) => Promise<ApiResponse<any>>;
  getComebackOptions: () => Promise<ApiResponse<any>>;

  // Form management
  setFormPage1Data: (data: FormPage1Data) => void;
  setFormPage2Data: (data: FormPage2Data) => void;
  getCompleteFormData: () => CompleteFormData | null;
  clearFormData: () => void;

  // Utility
  clearError: () => void;
  setSelectedHostelService: (hostelService: HostelService | null) => void;
}

const useServiceStore = create<ServiceState>()(
  persist(
    (set, get) => ({
      // Initial state
      hostelServices: [],
      selectedHostelService: null,
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

      // Get Total Services Count
      getTotalServicesCount: async () => {
        set({ isLoading: true, error: null });

        try {
          const userServiceType = useAuthStore.getState().userServiceType;
          let response: AxiosResponse;

          if (userServiceType === "hostel_owner") {
            response = await hostelServiceApiService.getTotalHostelServicesCount();
          } else {
            response = await tiffinApiService.getTotalTiffinServicesCount();
          }

          if (response.status === 200) {
            const count = response.data.data.totalHostelServices || 0;
            set({
              totalServicesCount: count,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data.data.totalHostelService };
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
            response = await hostelServiceApiService.getRequestedHostelServicesCount();
          } else {
            response = await tiffinApiService.getRequestedTiffinServicesCount();
          }

          if (response.status === 200) {
            const count = response.data.data.requestedHostelServices || 0;
            set({
              requestedServicesCount: count,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data.data.requestedHostelService };
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
            response = await hostelServiceApiService.getAcceptedHostelServicesCount();
          } else {
            response = await tiffinApiService.getAcceptedTiffinServicesCount();
          }

          if (response.status === 200) {
            const count = response.data.data.acceptedHostelServices || 0;
            set({
              acceptedServicesCount: count,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data.data.acceptedHostelService };
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
            response = await hostelServiceApiService.getCancelledHostelServicesCount();
          } else {
            response = await tiffinApiService.getCancelledTiffinServicesCount();
          }

          if (response.status === 200) {
            const count = response.data.data.cancelledHostelServices || 0;
            set({
              cancelledServicesCount: count,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data.data.cancelledHostelService };
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

      // API Actions
      createHostelService: async (data: CreateHostelServiceRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelServiceApiService.createHostelService(data);

          if (response.success) {
            // Refresh the hostel services list (first page)
            const allServices = await hostelServiceApiService.getAllHostelServices(1, 10);
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
          const response = await hostelServiceApiService.getAllHostelServices(page, limit);

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

      updateHostelService: async (hostelServiceId: string, data: UpdateHostelServiceRequest) => {
        set({ isLoading: true, error: null });
      
        try {
          const response = await hostelServiceApiService.updateHostelService(hostelServiceId, data);
      
          if (response.success) {
            // ✅ Fetch the full updated hostel details to ensure all fields are populated
            const detailsResponse = await hostelServiceApiService.getHostelServiceById(hostelServiceId);
            
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
          const response = await hostelServiceApiService.deleteHostelService(hostelServiceId);

          if (response.success) {
            // Remove the deleted service from the list
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
          const response = await hostelServiceApiService.deleteRoomPhotos(hostelServiceId, roomId, photoUrls);

          if (response.success) {
            // Update the room photos in the selected hostel service
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

      // Offline/Online Status Management
      updateHostelServiceOfflineStatus: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelServiceApiService.updateHostelServiceOfflineStatus(payload);

          if (response.success) {
            // Refresh services list
            await get().getAllHostelServices(1, 10);
            
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
          const response = await hostelServiceApiService.updateHostelServiceOnlineStatus(serviceIds);
      
          if (response.success) {
            // Refresh services list
            await get().getAllHostelServices(1, 10);
            
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

      getOfflineReasons: async (offlineType: string) => {
        try {
          const response = await hostelServiceApiService.getOfflineReasons(offlineType);

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
          const response = await hostelServiceApiService.getComebackOptions();

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

      // Form management actions
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

      //Rating
      getReviewsSummary: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelServiceApiService.getReviewsSummary();

          if (response.success && response.data) {
            set({
              overallRating: response.data.data.overallRating || 0,
              totalReviews: response.data.data.totalReviews || 0,
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

      // Utility actions
      clearError: () => set({ error: null }),

      setSelectedHostelService: (hostelService: HostelService | null) =>
        set({ selectedHostelService: hostelService }),
    }),
    {
      name: 'service-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useServiceStore;