import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import CommonTextInput from "@/components/labeledInput";
import { Images } from "@/constants/Images";
import CommonButton from "@/components/CommonButton";
import { Colors } from "@/constants/Colors";


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
     

      <View style={styles.profileContainer}>
        <Image source={Images.user} style={styles.profileImage} />
        <Text style={styles.headerTitle}>{name}</Text>
      </View>
      <View style={{gap:8}}>
      <CommonTextInput
        label="Name"
        value={name}
        onChangeText={setName}
        labelStyle={styles.label}
      />
      <CommonTextInput
        label="Email"
         value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        labelStyle={styles.label}
      />
      <CommonTextInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        labelStyle={styles.label}
      />
    </View>
      <Text style={styles.sectionHeading}>Bank Details</Text>

      <View style={{gap:8}}>
      <CommonTextInput
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
      />
      <CommonTextInput value={ifsc} onChangeText={setIfsc} />
      <CommonTextInput value={accountType} onChangeText={setAccountType} />
      <CommonTextInput value={accountHolder} onChangeText={setAccountHolder} />
      </View>
<CommonButton
  title="Save"
  onPress={handleSave}
  buttonStyle={{ backgroundColor: Colors.buttonBg ,marginTop: 40 }}
  textStyle={{ fontSize: 18 }}
/>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
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

  sectionHeading: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A051F",
    marginVertical: 8,
    marginLeft: 13,
  },
  label: {
    color: Colors.label,
    fontSize: 14,
    fontWeight: "700",
     marginBottom: 8,
  },
});

export default EditProfile;