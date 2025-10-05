export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Location {
  area: string;
  nearbyLandmarks?: string;
  landmark?: string;
  fullAddress: string;
}

export interface ContactInfo {
  phone: number | string;
  whatsapp: number | string;
}

export interface Pricing {
  _id?: string;
  type: string; // "monthly", "daily", "yearly", etc.
  price: number;
  securityDeposit?: number;
  offer?: string;
}

export interface Room {
  _id?: string;
  roomNumber: number;
  totalBeds: {
    bedNumber: number;
    status?: string; // This is set by backend
    _id?: string;
  }[];
  roomDescription: string;
  photos?: string[];
}

// Main Hostel Service Interface
export interface HostelService {
  _id: string;
  hostelName: string;
  hostelType: string;
  description: string;
  pricing: {
    perDay: number;
    weekly: number;
    monthly: number;
  };
  securityDeposit: number;
  offers?: string;
  rooms: Room[];
  facilities: string[];
  location: {
    area: string;
    nearbyLandmarks: string;
    fullAddress: string;
  };
  contactInfo: {
    phone: number;
    whatsapp: number;
  };
  rulesAndPolicies: string;
  hostelPhotos?: string[];
  totalRooms: number;
  totalBeds: number;
  availability: {
    totalBeds: number;
    occupiedBeds: number;
    unoccupiedBeds: number;
    availabilityString: string;
  };
  status: string;
  ownerId: string;
  overallRating: number;
  totalReviews: number;
  offlineDetails: {
    comeBackAt: null,
    comeBackOption: null,
    isOffline: false,
    isPermanent: false,
    offlineAt: null,
    offlineType: null,
    reason: null
},
}

// API Request/Response Interfaces
export interface CreateHostelServiceRequest {
  hostelName: string;
  hostelType: string;
  description: string;
  pricing: {
    perDay: number;
    weekly: number;
    monthly: number;
  };
  securityDeposit: number;
  offers?: string;
  rooms: {
    roomNumber: number;
    totalBeds: {
      bedNumber: number;
      status?: string;
    }[];
    roomDescription: string;
  }[];
  facilities: string[];
  location: {
    area: string;
    nearbyLandmarks: string;
    fullAddress: string;
  };
  contactInfo: {
    phone: number;
    whatsapp: number;
  };
  rulesAndPolicies: string;
  hostelPhotos: any[];
  roomPhotos?: any[]; // Legacy - kept for backward compatibility
  roomsWithPhotos?: {
    roomNo: string;
    noOfBeds: number;
    roomDetails: string;
    roomPhotos: any[];
  }[]; // ✅ NEW: Properly typed
}

export interface UpdateHostelServiceRequest extends CreateHostelServiceRequest {
  rooms: (Room & { isNewRoom?: boolean })[];
}

export interface HostelServiceResponse {
  success: boolean;
  message?: string;
  data?: HostelService;
  error?: string;
}

export interface HostelDetails {
  _id: string;
  hostelName: string;
  hostelType: string;
  description: string;
  pricing: {
    perDay: number;
    weekly: number;
    monthly: number;
  };
  securityDeposit: number;
  offers?: string;
  rooms: {
    _id: string;
    roomNumber: number;
    totalBeds: {
      bedNumber: number;
      status: "Occupied" | "Unoccupied";
      _id: string;
    }[];
    roomDescription: string;
    photos: string[];
  }[];
  facilities: string[];
  location: {
    area: string;
    nearbyLandmarks: string;
    fullAddress: string;
  };
  contactInfo: {
    phone: number;
    whatsapp: number;
  };
  rulesAndPolicies: string;
  hostelPhotos: string[];
  totalRooms: number;
  totalBeds: number;
  ownerId: {
    _id: string;
    email: string;
  };
  status: string;
  isAvailable: boolean;
  updatedAt: string;
  offlineDetails: {
    comeBackAt: null | string;
    comeBackOption: null | string;
    isOffline: boolean;
    isPermanent: boolean;
    offlineAt: null | string;
    offlineType: null | string;
    reason: null | string;
  };
}
export interface HostelServicesListResponse {
  success: boolean;
  message?: string;
  data?: {
    hostelServices: HostelService[];
    total?: number;
    page?: number;
    limit?: number;
  };
  error?: string;
}

// Form Data Interfaces (for multi-step forms)
export interface FormPage1Data {
  hostelName: string;
  description: string;
  hostelType: string;
  pricePerDay: number;
  monthlyPrice: number;
  weeklyPrice: number;
  securityDeposit: number;
  offers: string;
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
  roomPhotos: any[];
  rooms: {
    roomNo: string;
    noOfBeds: number;
    roomDetails: string;
    roomPhotos: any[];
  }[];
}

export interface FormPage2Data {
  rulesText: string;
  area: string | null;
  nearbyLandmarks: string;
  fullAddress: string;
  phoneNumber: string;
  whatsappNumber: string;
  photos: any[];
}

export interface CompleteFormData extends FormPage1Data, FormPage2Data {}

// Legacy Hostel Interface (for backward compatibility)
export interface LegacyHostel {
  _id: string;
  userId: User;
  name: string;
  hostelType: string;
  description: string;
  location: Location;
  contact: ContactInfo;
  pricing: Pricing[];
  rooms: Room[];
  photos: string[];
  facilities: string[];
  rules: string[];
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// API Service Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Delete Room Photos Request
export interface DeleteRoomPhotosRequest {
  photoUrls: string[];
}

export interface DeleteRoomPhotosResponse {
  success: boolean;
  message?: string;
  data?: {
    room: Room;
    removedCount: number;
    remainingPhotos: number;
  };
  error?: string;
}
  export interface CreateHostelServiceData {
    hostelName: string;
    hostelType: string;
    description: string;
    pricing: {
      type: string;
      price: number;
    };
    securityDeposit: number;
    offers?: string;
    rooms: Room[];
    facilities: string[];
    location: {
      area: string;
      nearbyLandmarks: string;
      fullAddress: string;
    };
    contactInfo: {
      phone: number;
      whatsapp: number;
    };
    rulesAndPolicies: string;
    hostelPhotos?: any[];
    roomPhotos?: any[];
  }
  export interface BedDetails {
    bedNumber: number;
    status: "Occupied" | "Unoccupied";
    _id: string;
    availability: string;
  }
  
  export interface RoomDetails {
    _id: string;
    roomNumber: number;
    totalBeds: BedDetails[];
    totalBedsCount: number;
    roomDescription: string;
    photos: string[];
  }
  
  export interface RoomApiResponse {
    success: boolean;
    message: string;
    room: RoomDetails;
  }
  export interface RoomData {
    _id: string;
    roomNumber: number;
    totalBeds: BedDetails[];
    totalBedsCount: number;
    roomDescription: string;
    photos: string[];
  }