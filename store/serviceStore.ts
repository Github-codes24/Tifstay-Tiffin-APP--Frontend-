import {
  ApiResponse,
  CompleteFormData,
  CreateHostelServiceRequest,
  FormPage1Data,
  FormPage2Data,
  HostelService,
  UpdateHostelServiceRequest,
} from "@/types/hostel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import hostelServiceApiService from "../services/hostelApiService";


interface ServiceState {
  // Data
  hostelServices: HostelService[];
  selectedHostelService: HostelService | null;
  isLoading: boolean;
  error: string | null;
  cancelledServicesCount: number;

  // Form data for multi-step form
  formPage1Data: FormPage1Data | null;
  formPage2Data: FormPage2Data | null;

  // Actions
  createHostelService: (data: CreateHostelServiceRequest) => Promise<ApiResponse<HostelService>>;
  getAllHostelServices: () => Promise<ApiResponse<any>>;
  getHostelServiceById: (hostelServiceId: string) => Promise<ApiResponse<HostelService>>;
  updateHostelService: (hostelServiceId: string, data: UpdateHostelServiceRequest) => Promise<ApiResponse<HostelService>>;
  deleteHostelService: (hostelServiceId: string) => Promise<ApiResponse<any>>;
  deleteRoomPhotos: (hostelServiceId: string, roomId: string, photoUrls: string[]) => Promise<ApiResponse<any>>;
  getCancelledServicesCount: () => Promise<ApiResponse<any>>;

  
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
      cancelledServicesCount: 0,
      error: null,
      formPage1Data: null,
      formPage2Data: null,

      // API Actions
      createHostelService: async (data: CreateHostelServiceRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelServiceApiService.createHostelService(data);

          if (response.success) {
            // Refresh the hostel services list
            const allServices = await hostelServiceApiService.getAllHostelServices();
            if (allServices.success) {
              set({
                hostelServices: allServices.data?.data?.hostelServices || [],
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
getCancelledServicesCount: async () => {
  set({ isLoading: true, error: null });

  try {
    const response = await hostelServiceApiService.getCancelledHostelServicesCount();

    if (response.success) {
      set({
        cancelledServicesCount: response.data?.data?.cancelledServicesCount || 0,
        isLoading: false,
        error: null,
      });
      return { success: true, data: response.data };
    } else {
      set({
        isLoading: false,
        error: response.error || "Failed to fetch cancelled services count",
      });
      return { success: false, error: response.error };
    }
  } catch (error: any) {
    set({
      isLoading: false,
      error: error.message || "Failed to fetch cancelled services count",
    });
    return { success: false, error: error.message };
  }
},
      getAllHostelServices: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelServiceApiService.getAllHostelServices();

          if (response.success) {
            set({
              hostelServices: response.data?.data?.hostelServices || [],
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

      getHostelServiceById: async (hostelServiceId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelServiceApiService.getHostelServiceById(hostelServiceId);

          if (response.success) {
            set({
              selectedHostelService: response.data?.data || null,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.error || "Failed to fetch hostel service details",
            });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch hostel service details",
          });
          return { success: false, error: error.message };
        }
      },

      updateHostelService: async (hostelServiceId: string, data: UpdateHostelServiceRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await hostelServiceApiService.updateHostelService(hostelServiceId, data);

          if (response.success) {
            // Update the hostel service in the list
            const updatedServices = get().hostelServices.map(service =>
              service._id === hostelServiceId ? response.data?.data || service : service
            );

            set({
              hostelServices: updatedServices,
              selectedHostelService: response.data?.data || get().selectedHostelService,
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