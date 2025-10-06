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

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Pricing {
  _id?: string;
  type: string;
  price: number;
  securityDeposit?: number;
  offer?: string;
}

export interface Room {
  _id?: string;
  roomNumber: number;
  totalBeds: {
    bedNumber: number;
    status?: string;
    _id?: string;
  }[];
  roomDescription: string;
  photos?: string[];
}

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
    comeBackAt: null | string;
    comeBackOption: null | string;
    isOffline: boolean;
    isPermanent: boolean;
    offlineAt: null | string;
    offlineType: null | string;
    reason: null | string;
  };
}

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
  roomPhotos?: any[];
  roomsWithPhotos?: {
    roomNo: string;
    noOfBeds: number;
    roomDetails: string;
    roomPhotos: any[];
  }[];
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
    pagination: PaginationData;
  };
  error?: string;
}

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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

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
export interface ReviewUser {
  _id: string;
  fullName: string;
  profileImage?: string;
}

export interface ReviewData {
  _id: string;
  userId: ReviewUser;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface RatingDistribution {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

export interface ReviewPagination {
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: {
    hostelId?: string;
    overallRating: number;
    totalReviews: number;
    ratingDistribution: RatingDistribution;
    pagination: ReviewPagination;
    reviews: ReviewData[];
  };
}