import useAuthStore from "@/store/authStore";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const { hasSeenSplash } = useAuthStore();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" redirect={hasSeenSplash} />
      <Stack.Screen name="loginoption" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgotpass" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="recovery" />
    </Stack>
  );
}
