import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import CommonTextInput from "@/components/textinput";

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    console.log("Password changed successfully!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Change Password</Text>
      </View>

      <View style={{ paddingHorizontal: 12 }}>
        <CommonTextInput
          label="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="XXXXXXXX"
        />

        <CommonTextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="XXXXXXXX"
        />

        <CommonTextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="XXXXXXXX"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#004AAD",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ChangePasswordScreen;
