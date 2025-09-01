  // Image constants for the entire app
// This file centralizes all image imports to make maintenance easier

export const Images = {
    logo: require("@/assets/images/logo.png"),
    splashlogo: require("@/assets/images/splash.png"),
    food: require("@/assets/images/tiffin.png"),
    splash: require("@/assets/images/splashbg.png"),
    cap: require("@/assets/images/cap.png"),
    building: require("@/assets/images/building.png"),
    warrow: require("@/assets/images/warrow.png"),
    barrow: require("@/assets/images/barrow.png"),
    email: require("@/assets/images/email.png"),
    profile: require("@/assets/images/profile.png"),
    openeye: require("@/assets/images/eye.png"),
    lock: require("@/assets/images/lock.png"),
  } as const;
  
  // Type for image keys
  export type ImageKey = keyof typeof Images;
  