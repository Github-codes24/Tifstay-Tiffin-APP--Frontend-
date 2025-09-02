import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import CommonTextInput from "@/components/textinput";
import { Images } from "@/constants/images";

const EditProfile = () => {
  const [name, setName] = useState("Maharashtrian Ghar Ka Khana");
  const [email, setEmail] = useState("maharashtrian@gmail.com");
  const [phone, setPhone] = useState("715-601-4598");
  const [accountNumber, setAccountNumber] = useState("98765432101");
  const [ifsc, setIfsc] = useState("SBIN0001234");
  const [accountType, setAccountType] = useState("Savings");
  const [accountHolder, setAccountHolder] = useState("Mahesh Pawar");

  const handleSave = () => {
    console.log("Saved!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log("Back pressed")}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image source={Images.Dummy} style={styles.profileImage} />
        <Text style={styles.heading}>{name}</Text>
      </View>

      <CommonTextInput
        label="Name"
        value={name}
        onChangeText={setName}
        editable
      />
      <CommonTextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <CommonTextInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionHeading}>Bank Details</Text>
      <CommonTextInput
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
      />
      <CommonTextInput value={ifsc} onChangeText={setIfsc} />
      <CommonTextInput value={accountType} onChangeText={setAccountType} />
      <CommonTextInput value={accountHolder} onChangeText={setAccountHolder} />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    backgroundColor: "#e0e0e0",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A051F",
    marginVertical: 8,
    marginLeft: 8,
  },
  button: {
    backgroundColor: "#0052cc",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default EditProfile;
