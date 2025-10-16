import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import hostelApiService from "../services/hostelApiService";
import tiffinApiService from "../services/tiffinApiServices";
import useAuthStore from "./authStore";

export interface Address {
  _id: string;
  address: string;
  street: string;
  postCode: string;
  label: "Home" | "Work";
}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  tiffinAddress: any;
  // Actions
  addAddress: (addressData: Omit<Address, '_id'>) => Promise<any>;
  getAllAddresses: () => Promise<any>;
  getAddressById: (addressId: string) => Promise<any>;
  editAddress: (addressId: string, addressData: Omit<Address, '_id'>) => Promise<any>;
  deleteAddress: (addressId: string) => Promise<any>;
  clearError: () => void;
}

const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      isLoading: false,
      error: null,
      tiffinAddress: null,


      addAddress: async (addressData) => {
        set({ isLoading: true, error: null });
        try {
          // Get userServiceType from authStore
          const userServiceType = useAuthStore.getState().userServiceType;
          
          let response;
          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.addAddress(addressData);
          } else {
            response = await tiffinApiService.addAddress(addressData);
          }
          
          if (response.success) {
            const newAddress = response.data?.address;
            set((state) => ({
              addresses: [...state.addresses, newAddress],
              isLoading: false,
              error: null,
            }));
            return { success: true, data: newAddress };
          } else {
            set({ isLoading: false, error: response.error });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      getAllAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
          // Get userServiceType from authStore
          const userServiceType = useAuthStore.getState().userServiceType;
          
          let response;
          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.getAllAddresses();
          } else {
            response = await tiffinApiService.getAllAddresses();
          }

          if (response.success) {
            set({
              addresses: response.data?.addresses || [],
              isLoading: false,
              error: null,
              tiffinAddress: response?.data?.data || {}
            });
            return { success: true, data: response.data?.addresses };
          } else {
            set({ isLoading: false, error: response.error });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      getAddressById: async (addressId) => {
        set({ isLoading: true, error: null });
        try {
          // Get userServiceType from authStore
          const userServiceType = useAuthStore.getState().userServiceType;
          
          let response;
          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.getAddressById(addressId);
          } else {
            response = await tiffinApiService.getAddressById(addressId);
          }
          
          if (response.success) {
            set({ isLoading: false, error: null });
            return { success: true, data: userServiceType === "hostel_owner"? response.data?.address : response?.data };
          } else {
            set({ isLoading: false, error: response.error });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      editAddress: async (addressId, addressData) => {
        set({ isLoading: true, error: null });
        try {
          // Get userServiceType from authStore
          const userServiceType = useAuthStore.getState().userServiceType;
          
          let response;
          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.editAddress(addressId, addressData);
          } else {
            response = await tiffinApiService.editAddress(addressId, addressData);
          }
          
          if (response.success) {
            const updatedAddress = response.data?.address;
            set((state) => ({
              addresses: state.addresses.map((addr) =>
                addr._id === addressId ? updatedAddress : addr
              ),
              isLoading: false,
              error: null,
            }));
            return { success: true, data: updatedAddress };
          } else {
            set({ isLoading: false, error: response.error });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      deleteAddress: async (addressId) => {
        set({ isLoading: true, error: null });
        try {
          // Get userServiceType from authStore
          const userServiceType = useAuthStore.getState().userServiceType;
          
          let response;
          if (userServiceType === "hostel_owner") {
            response = await hostelApiService.deleteAddress(addressId);
          } else {
            response = await tiffinApiService.deleteAddress(addressId);
          }
          
          if (response.success) {
            set((state) => ({
              addresses: state.addresses.filter((addr) => addr._id !== addressId),
              isLoading: false,
              error: null,
            }));
            return { success: true };
          } else {
            set({ isLoading: false, error: response.error });
            return { success: false, error: response.error };
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'address-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAddressStore;