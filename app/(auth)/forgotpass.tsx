import CommonButton from "@/components/CommonButton";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import hostelApiService from "@/services/hostelApiService";
import tiffinApiServices from "@/services/tiffinApiServices";
import useAuthStore from "@/store/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const { getUserProfile, user, userServiceType } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const handleSendRecoveryLink = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response =
        userServiceType === "tiffin_provider"
          ? await tiffinApiServices.forgotPassword(email)
          : await hostelApiService.forgotPassword(email);

      if (response.data?.success) {
        // Pass email to verify screen
        router.push({
          pathname: "/verify",
          params: { email: email },
        });
      } else {
        Alert.alert(
          "Error",
          response.data?.message ||
            "Failed to send recovery link. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
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
        <Text style={styles.title}>Forgot Password?</Text>

        <LabeledInput
          value={email}
          onChangeText={setEmail}
          leftIconSource={Images.email}
          leftIconStyle={{ height: 14, width: 20 }}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <CommonButton
          title={isLoading ? "Sending..." : "Send Recovery Link"}
          buttonStyle={{ marginHorizontal: 16, marginTop: 24 }}
          onPress={handleSendRecoveryLink}
          disabled={isLoading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember it. </Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            disabled={isLoading}
          >
            <Text style={styles.registerText}>Login</Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
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
    color: Colors.title,
  },
  footer: {
    marginTop: 57,
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
