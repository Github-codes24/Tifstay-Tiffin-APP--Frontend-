import CommonHeader from "@/components/CommonHeader";
import { Colors } from "@/constants/Colors";
import { router, Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardLayout() {
  return (
    <>
    <Stack>
      <Stack.Screen name="index" options={{  header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >

              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Account" />
              </View>
            </SafeAreaView>
          ),}} />

      <Stack.Screen
        name="profile"
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
         <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader actionText="Edit" onActionPress={() => {router.push("/edit")}} title="My Profile"
                 />

                  </View>
               </SafeAreaView>
          ),
        }}
      />   

             <Stack.Screen name="changePassword" options={{  header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >

              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Change Password" />
              </View>
            </SafeAreaView>
          ),}} />
            
      <Stack.Screen name="address" options={{  header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >

              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="address" />
              </View>
            </SafeAreaView>
          ),}} />

      <Stack.Screen name="myCustomers" options={{  header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >

              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="My Customers" />
              </View>
            </SafeAreaView>
          ),}} />

   <Stack.Screen name="privacyPolicy" options={{  header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >

              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Privacy Policy" />
              </View>
            </SafeAreaView>
          ),}} />

     <Stack.Screen name="termsCondition" options={{  header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >

              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader title="Terms and Conditions" />
              </View>
            </SafeAreaView>
          ),}} />
    </Stack>
    </>

  );
}
              
