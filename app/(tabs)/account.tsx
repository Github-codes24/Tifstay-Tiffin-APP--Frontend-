import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
} from "react-native";

import { Images } from "@/constants/images";
import { router } from "expo-router";

const AccountScreen = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenHeaderText}>Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image source={Images.Dummy} style={styles.largeImage} />
          <Text style={styles.title}>Maharashtrian Ghar Ka Khana</Text>
        </View>

        <MenuItem
          label="Profile"
          image={Images.Profile}
          backgroundColor="#004AAD"
          textColor="#fff"
          customStyle={{
            marginHorizontal: 38,
            paddingHorizontal: 5,
            borderRadius: 10,
          }}
          onpress={() => router.push("/profile")}
        />

        <MenuItem
          label="Address"
          image={Images.address}
          onpress={() => router.push("/address")}
        />
        <MenuItem
          label="My Customers"
          image={Images.customer}
          onpress={() => router.push("/mycustomers")}
        />
        <MenuItem
          label="Offers"
          image={Images.offers}
          onpress={() => router.push("/offers")}
        />
        <MenuItem
          label="Privacy Policy"
          image={Images.PrivacyPolicyIcon}
          onpress={() => router.push("/privacy")}
        />
        <MenuItem
          label="Terms and Conditions"
          image={Images.termsandconditions}
          onpress={() => router.push("/terms")}
        />
        <MenuItem label="Contact Us" image={Images.contactus} />

        <View style={styles.languageRow}>
          <Text style={styles.languageText}>Language</Text>
          <Text style={styles.languageDropdown}>English ▼</Text>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.languageText}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <MenuItem label="Log Out" image={Images.address} />
      </ScrollView>
    </SafeAreaView>
  );
};

const MenuItem = ({
  label,
  image,
  backgroundColor = "#fff",
  textColor = "#000",
  iconTint = "#999",
  customStyle = {},
  onpress,
}: {
  label: string;
  image: any;
  backgroundColor?: string;
  textColor?: string;
  iconTint?: string;
  customStyle?: any;
  onpress?: () => void;
}) => (
  <TouchableOpacity
    style={[styles.menuItem, { backgroundColor }, customStyle]}
    onPress={onpress}
  >
    <View style={styles.menuLeft}>
      <Image source={image} style={[styles.smallIcon]} />
      <Text style={[styles.menuText, { color: textColor }]}>{label}</Text>
    </View>
    <Image
      source={Images.back}
      style={[styles.arrowIcon, { tintColor: iconTint }]}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  screenHeader: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  screenHeaderText: {
    fontSize: 20,
    fontWeight: "600",
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 20,
  },
  largeImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginHorizontal: 10,
    justifyContent: "space-between",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "400",
  },
  arrowIcon: {
    width: 18,
    height: 18,
  },
  languageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 38,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  languageText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#616161",
    marginHorizontal: 15,
  },
  languageDropdown: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#616161",
  },
});

export default AccountScreen;
