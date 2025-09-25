import CommonButton from "@/components/CommonButton";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register, isLoading, error, clearError, userServiceType } =
    useAuthStore();

  const handleRegister = async () => {
    try {
      // Clear any previous errors
      clearError();

      // Validation
      if (!name.trim()) {
        Alert.alert("Error", "Please enter your name");
        return;
      }

      if (!email.trim()) {
        Alert.alert("Error", "Please enter your email");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }

      if (!password) {
        Alert.alert("Error", "Please enter a password");
        return;
      }

      // Password length validation
      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters");
        return;
      }

      console.log("Registering with profile:", userServiceType);

      // Call register function from store
      const response = await register(
        name.trim(),
        email.trim().toLowerCase(),
        password,
        userServiceType
      );

      if (response.success) {
        Alert.alert("Success", "Registration successful!", [{ text: "OK" }]);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        error.message || "Failed to register. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.slide}>
          <Image
            source={Images.logo}
            style={styles.appLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Get started with Tifstay</Text>

          <LabeledInput
            value={name}
            onChangeText={setName}
            leftIconSource={Images.profile2}
            leftIconStyle={{ height: 21, width: 21 }}
            placeholder="Name"
          />

          <LabeledInput
            value={email}
            onChangeText={setEmail}
            leftIconSource={Images.email}
            containerStyle={{ marginTop: 16 }}
            leftIconStyle={{ height: 14, width: 20 }}
            placeholder="Example@gmail.com"
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

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <CommonButton
            title={isLoading ? "Creating Account..." : "Continue"}
            buttonStyle={[
              { marginHorizontal: 16, marginTop: 24 },
              isLoading ? { opacity: 0.7 } : {},
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.registerText}>Log In</Text>
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
    paddingBottom: 120, // Add padding to account for footer
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
