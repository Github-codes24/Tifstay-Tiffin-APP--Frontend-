import CommonButton from "@/components/CommonButton";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Add these to your Images constant
const SocialIcons = {
  googleIcon: require("@/assets/images/Hostel/googleIcon.png"),
  appleIcon: require("@/assets/images/Hostel/appleIcon.png"),
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError, userServiceType } =
    useAuthStore();

  const userTypeDisplay = useMemo(() => {
    if (userServiceType === "hostel_owner") {
      return "Hostel Owner";
    } else if (userServiceType === "tiffin_provider") {
      return "Tiffin Provider";
    }
    return ""; // Default case
  }, [userServiceType]);

  const handleLogin = async () => {
    try {
      clearError();

      if (!email.trim()) {
        Alert.alert("Error", "Please enter your email");
        return;
      }

      if (!password.trim()) {
        Alert.alert("Error", "Please enter your password");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }

      const response = await login(email.trim(), password, userServiceType);

      if (response.success) {
        // Navigation will be handled by auth state change
      } else {
        Alert.alert(
          "Login Failed",
          response.error || "Invalid email or password. Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("Coming Soon", "Google login will be available soon");
  };

  const handleAppleLogin = () => {
    Alert.alert("Coming Soon", "Apple login will be available soon");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slide}>
        <Image
          source={Images.logo}
          style={styles.appLogo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          Get started with Tifstay{"\n"}
          <Text style={styles.userTypeText}>{userTypeDisplay}</Text>
        </Text>

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
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity
            onPress={() => {
              router.push("/forgotpass");
            }}
          >
            <Text style={styles.forgotPasswordText}>Forget Password?</Text>
          </TouchableOpacity>
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <CommonButton
          title={isLoading ? "Signing in..." : "Continue"}
          buttonStyle={[
            styles.continueButton,
            ...(isLoading ? [{ opacity: 0.7 }] : []),
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        />

        {/* Divider with "or" text */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login Buttons */}
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.7}
        >
          <Image
            source={SocialIcons.googleIcon}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { marginTop: 12 }]}
          onPress={handleAppleLogin}
          activeOpacity={0.7}
        >
          <Image
            source={SocialIcons.appleIcon}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{"Don't have an account? "}</Text>
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
    color: Colors.title || "#000000",
    lineHeight: 32,
  },
  userTypeText: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    color: Colors.primary || "#1E40AF",
  },
  forgotPasswordContainer: {
    padding: 16,
    alignItems: "flex-end",
  },
  forgotPasswordText: {
    fontFamily: fonts.interRegular,
    color: Colors.grey || "#6B7280",
    fontSize: 13,
  },
  continueButton: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: Colors.primary || "#1E40AF",
    borderRadius: 12,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 32,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey || "#6B7280",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.inputColor,
    marginHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.grey || "#000000",
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
    color: Colors.grey || "#6B7280",
    textAlign: "center",
    fontFamily: fonts.interRegular,
  },
  registerText: {
    fontSize: 16,
    color: Colors.primary || "#1E40AF",
    fontFamily: fonts.interSemibold,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.inputColor,
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
