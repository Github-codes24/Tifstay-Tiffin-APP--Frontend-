export interface Hostel {
    _id: string;
    userId: User;
    name: string;
    hostelType: string; // "Boys Hostel" | "Girls Hostel"
    description: string;
    location: Location;
    contact: Contact;
    pricing: Pricing[];
    rooms: Room[];
    photos: string[];
    facilities: string[];
    rules: string[];
    status: "published" | "draft";
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
  }
  
  export interface User {
    _id: string;
    name: string;
    email: string;
  }
  
  export interface Location {
    area: string;
    landmark?: string;
    fullAddress: string;
  }
  
  export interface Contact {
    phone: string;
    whatsapp: string;
  }
  
  export interface Pricing {
    _id: string;
    type: string; // could be "monthly", "yearly", etc.
    price: number;
    securityDeposit: number;
    offer?: string;
  }
  
  export interface Room {
    _id: string;
    roomNo: string;
    noOfBeds: number;
    details: string;
  }