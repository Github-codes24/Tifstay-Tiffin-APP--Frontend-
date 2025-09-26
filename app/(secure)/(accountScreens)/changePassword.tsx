import CommonButton from "@/components/CommonButton";
import CommonTextInput from "@/components/labeledInput";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { userServiceType, changePassword } = useAuthStore();

  const handleSave = async () => {
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const result = await changePassword(
        oldPassword,
        newPassword,
        confirmPassword,
        userServiceType
      );

      if (result.success) {
        Alert.alert("Success", "Password changed successfully", [
          {
            text: "OK",
            onPress: () => {
              // Clear the form
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.error || "Failed to change password");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ paddingHorizontal: 12 }}>
        <CommonTextInput
          label="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Enter current password"
          secureTextEntry
          labelStyle={styles.label}
          containerStyle={{ marginBottom: 20 }}
        />

        <CommonTextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          secureTextEntry
          labelStyle={styles.label}
          containerStyle={{ marginBottom: 20 }}
        />

        <CommonTextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          secureTextEntry
          labelStyle={styles.label}
          containerStyle={{ marginBottom: 20 }}
        />
      </View>

      <CommonButton
        title={isLoading ? "Saving..." : "Save"}
        onPress={handleSave}
        disabled={isLoading}
        buttonStyle={{ margin: 24, marginTop: 40 }}
      />

      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginLeft: -20,
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#0A051F",
  },
  label: {
    color: Colors.title,
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    marginBottom: 8,
  },
});

export default ChangePasswordScreen;
