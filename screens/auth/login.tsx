import CommonButton from "@/components/CommonButton";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useAuthStore from "../../store/authStore";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"hostel_owner" | "tiffin_provider">(
    "hostel_owner"
  );

  const { login, isLoading, error, clearError, isAuthenticated, user } =
    useAuthStore();

  useEffect(() => {
    AsyncStorage.getItem("userServiceType").then((type) => {
      if (type) {
        setType(type === "hostelOwner" ? "hostel_owner" : "tiffin_provider");
      }
    });
  }, []);

  // Navigate to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace("/(tabs)/(dashboard)");
    }
  }, [isAuthenticated, user]);

  const handleLogin = async () => {
    try {
      console.log("Login button pressed");

      // Clear any previous errors
      clearError();

      // Basic validation
      if (!email.trim()) {
        Alert.alert("Error", "Please enter your email");
        return;
      }

      if (!password.trim()) {
        Alert.alert("Error", "Please enter your password");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }

      console.log("Attempting login...");

      // Call login function from store
      const response = await login(email.trim(), password, type);

      console.log("Login response:", response);

      if (response.success) {
        console.log("Login successful, navigating to dashboard");
        // Navigation will happen automatically through the useEffect
      } else {
        Alert.alert(
          "Login Failed",
          response.error || "Invalid email or password. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slide}>
        <Image
          source={Images.logo}
          style={styles.appLogo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Get started with Tifstay</Text>

        <LabeledInput
          value={email}
          onChangeText={setEmail}
          leftIconSource={Images.email}
          leftIconStyle={{ height: 14, width: 20 }}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <LabeledInput
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          onPress={() => {
            setShowPassword(!showPassword);
          }}
          leftIconSource={Images.lock}
          containerStyle={{ marginTop: 16 }}
          rightIconSource={showPassword ? Images.closeeye : Images.openeye}
          leftIconStyle={{ height: 20.7, width: 20.7 }}
          placeholder="Password"
        />

        <TouchableOpacity
          style={{ padding: 16, alignItems: "flex-end" }}
          onPress={() => {
            router.push("/forgotpass");
          }}
        >
          <Text
            style={{
              fontFamily: fonts.interRegular,
              color: Colors.grey,
              fontSize: 13,
            }}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <CommonButton
          title={isLoading ? "Signing in..." : "Continue"}
          buttonStyle={[
            { marginHorizontal: 16, marginTop: 8 },
            ...(isLoading ? [{ opacity: 0.7 }] : []),
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{"Don't have an account?"} </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/register");
          }}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  slide: {
    marginTop: 71,
    justifyContent: "center",
  },
  appLogo: {
    width: 87,
    height: 87,
    marginBottom: 7,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.interSemibold,
    marginBottom: 28,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.grey,
    textAlign: "center",
    fontFamily: fonts.interRegular,
  },
  registerText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: fonts.interSemibold,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.red || "#FF0000",
  },
  errorText: {
    color: Colors.red || "#FF0000",
    fontSize: 14,
    fontFamily: fonts.interRegular,
    textAlign: "center",
  },
});
