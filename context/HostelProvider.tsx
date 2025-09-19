import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HostelPage1Data {
  // Define the shape of your page 1 data here
  // Example:
  // propertyName?: string;
  // address?: string;
  [key: string]: any; // Temporary any type, replace with actual types
}

interface HostelContextType {
  createHostelPage1Data: HostelPage1Data | null;
  setCreateHostelPage1Data: (data: HostelPage1Data | null) => void;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [createHostelPage1Data, setCreateHostelPage1Data] = useState<HostelPage1Data | null>(null);

  return (
    <HostelContext.Provider value={{ createHostelPage1Data, setCreateHostelPage1Data }}>
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = (): HostelContextType => {
  const context = useContext(HostelContext);
  if (context === undefined) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};
