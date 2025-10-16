import CommonButton from "@/components/CommonButton";
import CommonTextInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { IS_ANDROID } from "@/constants/Platform";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const EditProfile = () => {
  const { user, updateProfile, userServiceType } = useAuthStore();
  // Initialize state with user data
  const [name, setName] = useState(user?.fullName ?? user?.name ?? "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [accountNumber, setAccountNumber] = useState(
    user?.bankDetails?.accountNumber || ""
  );
  const [ifsc, setIfsc] = useState(user?.bankDetails?.ifscCode || "");
  const [accountType, setAccountType] = useState(
    user?.bankDetails?.accountType || "Savings"
  );
  const [accountHolder, setAccountHolder] = useState(
    user?.bankDetails?.accountHolderName || ""
  );
  const [bankName, setBankName] = useState(user?.bankDetails?.bankName || "");
  const [profileImage, setProfileImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update state when user data changes
  useEffect(() => {
    if (user) {
      setName(user.fullName || user?.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setAccountNumber(user.bankDetails?.accountNumber || "");
      setIfsc(user.bankDetails?.ifscCode || "");
      setAccountType(user.bankDetails?.accountType || "Savings");
      setAccountHolder(user.bankDetails?.accountHolderName || "");
      setBankName(user.bankDetails?.bankName || "");
    }
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // ✅ FIXED
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!name || !email || !phoneNumber) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const profileData = {
      fullName: name,
      email: email,
      phoneNumber: phoneNumber,
      profileImage: profileImage,
      bankDetails: {
        accountNumber: accountNumber,
        ifscCode: ifsc,
        accountType: accountType,
        accountHolderName: accountHolder,
        bankName: bankName,
      },
    };

    try {
      const result = await updateProfile(profileData, userServiceType);

      if (result.success) {
        Alert.alert("Success", "Profile updated successfully", [
          {
            text: "OK",
            // onPress: () => router.push("/profile"),
          },
        ]);
      } else {
        Alert.alert("Error", result.error || "Failed to update profile");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1, paddingHorizontal: 12, marginBottom: 20 }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Header */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage.uri }
                  : user?.profileImage
                  ? { uri: user.profileImage }
                  : Images.user
              }
              style={styles.profileImage}
            />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{name}</Text>
        </View>

        {/* Personal Details */}
        <View style={{ gap: 8 }}>
          <CommonTextInput
            label="Name"
            value={name}
            onChangeText={setName}
            labelStyle={styles.label}
            containerStyle={{ marginTop: 20 }}
            placeholder="Enter your name"
          />
          <CommonTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            labelStyle={styles.label}
            containerStyle={{ marginTop: 20 }}
            placeholder="Enter your email"
          />
          <CommonTextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            labelStyle={styles.label}
            containerStyle={{ marginTop: 20 }}
            placeholder="Enter phone number"
          />
        </View>

        {/* Bank Details */}
        <Text style={[styles.label, { marginTop: 24, marginBottom: 8 }]}>
          Bank Details
        </Text>
        <View style={{ gap: 8 }}>
          <CommonTextInput
            label="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
            labelStyle={styles.label}
            placeholder="Enter account number"
          />
          <CommonTextInput
            label="IFSC Code"
            value={ifsc}
            onChangeText={setIfsc}
            labelStyle={styles.label}
            placeholder="Enter IFSC code"
          />
          <CommonTextInput
            label="Account Type"
            value={accountType}
            onChangeText={setAccountType}
            labelStyle={styles.label}
            placeholder="e.g., Savings, Current"
          />
          <CommonTextInput
            label="Account Holder Name"
            value={accountHolder}
            onChangeText={setAccountHolder}
            labelStyle={styles.label}
            placeholder="Enter account holder name"
          />
          <CommonTextInput
            label="Bank Name"
            value={bankName}
            onChangeText={setBankName}
            labelStyle={styles.label}
            placeholder="Enter bank name"
          />
        </View>

        {/* Fixed Save Button */}
      </KeyboardAwareScrollView>
      <View
        style={{
          paddingHorizontal: 28,
          backgroundColor: "white",
          marginBottom: IS_ANDROID ? 56 : 20,
        }}
      >
        <CommonButton
          title={isLoading ? "Saving..." : "Save"}
          onPress={handleSave}
          disabled={isLoading}
        />
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 28,
  },
  profileImage: {
    width: 86,
    height: 86,
    borderRadius: 50,
    marginBottom: 8,
  },
  changePhotoText: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: fonts.interRegular,
    textAlign: "center",
    marginBottom: 12,
  },
  label: {
    color: Colors.title,
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    marginBottom: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProfile;
