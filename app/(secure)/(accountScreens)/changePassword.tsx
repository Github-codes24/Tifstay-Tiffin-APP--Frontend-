import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import CommonTextInput from "@/components/labeledInput";
import CommonButton from "@/components/CommonButton";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { fonts } from "@/constants/typography";

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
      <View style={{ paddingHorizontal: 12 }}>
        <CommonTextInput
          label="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="XXXXXXXX"
          labelStyle={styles.label}
          containerStyle={{marginBottom:20}}
        />

        <CommonTextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="XXXXXXXX"
          labelStyle={styles.label}
          containerStyle={{marginBottom:20}}
        />

        <CommonTextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="XXXXXXXX"
          labelStyle={styles.label}
          containerStyle={{marginBottom:20}}
        />
      </View>

      <CommonButton title="Save" 
      onPress={handleSave} 
      buttonStyle={{margin:24,marginTop:40 }}
      />
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
    fontFamily:fonts.interSemibold,
    marginBottom: 8,
    },
});

export default ChangePasswordScreen;
