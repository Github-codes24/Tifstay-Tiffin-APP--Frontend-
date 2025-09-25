import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import CommonTextInput from "@/components/labeledInput";
import { Images } from "@/constants/Images";
import CommonButton from "@/components/CommonButton";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { IS_ANDROID } from "@/constants/Platform";
import { fonts } from "@/constants/typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";


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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 , paddingHorizontal:12 , marginBottom:20 }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // adjust this value
      >
        {/* <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        > */}
          {/* Profile Header */}
          <View style={styles.profileContainer}>
            <Image source={Images.user} style={styles.profileImage} />
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
            />
            <CommonTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              labelStyle={styles.label}
              containerStyle={{ marginTop: 20 }}
            />
            <CommonTextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              labelStyle={styles.label}
              containerStyle={{ marginTop: 20 }}
            />
          </View>

          {/* Bank Details */}
          <View style={{ gap: 8 }}>
            <CommonTextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
              label="Bank details"
              labelStyle={styles.label}
              containerStyle={{ marginTop: 20 }}
            />
            <CommonTextInput value={ifsc} onChangeText={setIfsc} />
            <CommonTextInput
              value={accountType}
              onChangeText={setAccountType}
            />
            <CommonTextInput
              value={accountHolder}
              onChangeText={setAccountHolder}
            />
          </View>
        {/* </ScrollView> */}

        {/* Fixed Save Button */}
      </KeyboardAwareScrollView>
        <View
          style={{
            paddingHorizontal: 28,
            backgroundColor: "white",
            marginBottom: IS_ANDROID ? 56 : 20,
          }}
        >
          <CommonButton title="Save" onPress={() => router.push("/profile")} />
        </View>
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
    fontFamily:fonts.interSemibold,
    color: Colors.title,
  },
  profileContainer: {
    alignItems: "center",
    marginTop:28
  },
  profileImage: {
    width: 86,
    height: 86,
    borderRadius: 50,
    marginBottom: 12,
  },
  label: {
    color: Colors.title,
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    marginBottom: 8,
  },
});

export default EditProfile;
