  // Image constants for the entire app
// This file centralizes all image imports to make maintenance easier

export const Images = {
  
  
  dashboard: require("@/assets/images/dashboard.png"),
  earnings: require("@/assets/images/earnings.png"),
  orders: require("@/assets/images/orders.png"),
  notifications: require("@/assets/images/notifications.png"),
  account: require("@/assets/images/account.png"),

  //notification images
  newOrder: require("@/assets/images/newOrder.png"),
  oederAccepted: require("@/assets/images/oederAccepted.png"),
  earningSummary: require("@/assets/images/earningSummary.png"),
tiffinService: require("@/assets/images/tiffinService.png"),

//account images
  Dummy: require("@/assets/images/Dummy.png"),
  Profile: require("@/assets/images/Profile.png"),
  address: require("@/assets/images/address.png"),
  customer: require("@/assets/images/customer.png"),
  offers: require("@/assets/images/offers.png"),
  PrivacyPolicyIcon: require("@/assets/images/PrivacyPolicyIcon.png"),
  termsandconditions: require("@/assets/images/termsandconditions.png"),
  contactus: require("@/assets/images/contactus.png"),

} as const;

// Type for image keys
export type ImageKey = keyof typeof Images;
