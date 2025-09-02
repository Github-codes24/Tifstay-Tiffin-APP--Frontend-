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
  back: require("@/assets/images/back.png"),

  //profile images
  name: require("@/assets/images/name.png"),
  email: require("@/assets/images/email.png"),
  phone: require("@/assets/images/phone.png"),
  bank: require("@/assets/images/bank.png"),
  manage: require("@/assets/images/manage.png"),
  lock: require("@/assets/images/lock.png"),

  //address images
  home: require("@/assets/images/home.png"),
  editicon: require("@/assets/images/editicon.png"),
  Deleteicon: require("@/assets/images/Deleteicon.png"),
  Dummy2: require("@/assets/images/Dummy2.png"),
  Dummy3: require("@/assets/images/Dummy3.png"),
  Dummy4: require("@/assets/images/Dummy4.png"),
  Dummy5: require("@/assets/images/Dummy5.png"),
  Dummy6: require("@/assets/images/Dummy6.png"),

  //offers images
  celebration: require("@/assets/images/celebration.png"),
} as const;

// Type for image keys
export type ImageKey = keyof typeof Images;
