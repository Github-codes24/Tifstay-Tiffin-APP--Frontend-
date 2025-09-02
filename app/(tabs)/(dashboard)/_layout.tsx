import CommonHeader from "@/components/CommonHeader";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="service"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="My Service Status" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
    </Stack>
  );
}
