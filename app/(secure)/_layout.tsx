import CommonHeader from "@/components/CommonHeader";
import { Colors } from "@/constants/Colors";
import { router, Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecureLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="loginoption" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="forgotpass" options={{ headerShown: false }} />
      <Stack.Screen name="verify" options={{ headerShown: false }} />
      <Stack.Screen name="recovery" options={{ headerShown: false }} />
      <Stack.Screen
        name="review"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Reviews" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="orderDetails"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Order Summary" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(accountScreens)/addressScreen"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Address" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen name="(accountScreens)/addEditAddress" />
      <Stack.Screen
        name="(accountScreens)/changePassword"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Change Password" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(accountScreens)/myCustomers"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="My Customers" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(accountScreens)/profile"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader
                  title="My Profile"
                  actionText="Edit"
                  onActionPress={() => {
                    router.push("/(secure)/(accountScreens)/edit");
                  }}
                />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(accountScreens)/customerInfo"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Customer Info" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(accountScreens)/privacyPolicy"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Privacy Policy" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(accountScreens)/termsCondition"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Terms and Conditions" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(accountScreens)/editAddress"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Edit Address" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(service)/addNewService"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(service)/addNewService1"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(service)/previewService"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Tiffin Details" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(service)/confirmService"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(accountScreens)/contactUs"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Contact Us" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(service)/addNewBooking"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(accountScreens)/method"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(accountScreens)/payment"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="viewroom"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="View Rooms" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="(hostelService)/addNewHostelService"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(hostelService)/addNewHostelService1"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(hostelService)/previewServiceHostel"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(hostelService)/hostelDetails"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(accountScreens)/chatScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(accountScreens)/edit"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Edit Profile" />
              </View>
            </SafeAreaView>
          ),
        }}
      />
    </Stack>
  );
}
