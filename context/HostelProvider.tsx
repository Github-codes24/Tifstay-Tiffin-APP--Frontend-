// context/HostelProvider.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

interface HostelPage1Data {
  hostelName: string;
  description: string;
  hostelType: string;
  pricePerDay: number;
  monthlyPrice: number;
  weeklyPrice: number;
  securityDeposit: number;
  offers: string;
  roomNo: string;
  monthlyDining: number;
  roomDetails: string;
  roomPhotos?: any[];
  amenities: {
    wifi: boolean;
    meals: boolean;
    security: boolean;
    studyHall: boolean;
    commonTV: boolean;
    cctv: boolean;
    acRooms: boolean;
    laundry: boolean;
  };
}

interface HostelPage2Data {
  rulesText: string;
  location: string | null;
  nearbyLandmarks: string;
  fullAddress: string;
  phoneNumber: string;
  whatsappNumber: string;
  photos: any[];
}

interface HostelContextType {
  createHostelPage1Data: HostelPage1Data | null;
  createHostelPage2Data: HostelPage2Data | null;
  setCreateHostelPage1Data: (data: HostelPage1Data) => void;
  setCreateHostelPage2Data: (data: HostelPage2Data) => void;
  getCompleteHostelData: () => any;
  clearHostelData: () => void;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [createHostelPage1Data, setCreateHostelPage1Data] =
    useState<HostelPage1Data | null>(null);
  const [createHostelPage2Data, setCreateHostelPage2Data] =
    useState<HostelPage2Data | null>(null);

  const getCompleteHostelData = () => {
    return {
      ...createHostelPage1Data,
      ...createHostelPage2Data,
    };
  };

  const clearHostelData = () => {
    setCreateHostelPage1Data(null);
    setCreateHostelPage2Data(null);
  };

  return (
    <HostelContext.Provider
      value={{
        createHostelPage1Data,
        createHostelPage2Data,
        setCreateHostelPage1Data,
        setCreateHostelPage2Data,
        getCompleteHostelData,
        clearHostelData,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = (): HostelContextType => {
  const context = useContext(HostelContext);
  if (context === undefined) {
    throw new Error("useHostel must be used within a HostelProvider");
  }
  return context;
};
