import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export default function RootLayout() {
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
    <>
      <Stack initialRouteName='splash'>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="loginoption" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpass" options={{ headerShown: false }} />
        <Stack.Screen name="verify" options={{ headerShown: false }} />
        <Stack.Screen name="recovery" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      </>
  );
}
