import { Platform } from "react-native";

/**
 * Platform constants to avoid repeated Platform.OS checks throughout the codebase
 */
export const PlatformConstants = {
  IS_IOS: Platform.OS === "ios",
  IS_ANDROID: Platform.OS === "android",
  IS_WEB: Platform.OS === "web",
  OS: Platform.OS,
} as const;

// Individual boolean constants for easier usage
export const IS_IOS = PlatformConstants.IS_IOS;
export const IS_ANDROID = PlatformConstants.IS_ANDROID;
export const IS_WEB = PlatformConstants.IS_WEB;
