import useAuthStore from "@/store/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated, hasSeenSplash } = useAuthStore();
  return (
    <Redirect
      href={
        isAuthenticated
          ? "/(secure)/(tabs)/(dashboard)"
          : hasSeenSplash
          ? "/(auth)/loginoption"
          : "/(auth)/onboarding"
      }
    />
  );
}
