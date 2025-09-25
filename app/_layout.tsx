import { HostelProvider } from "@/context/HostelProvider";
import useAuthStore from "@/store/authStore";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const [loaded] = useFonts({
    // Custom local font
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // Inter
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <HostelProvider>
      <Stack>
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
          redirect={isAuthenticated}
        />
        <Stack.Screen
          name="(secure)"
          options={{ headerShown: false }}
          redirect={!isAuthenticated}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </HostelProvider>
  );
}
