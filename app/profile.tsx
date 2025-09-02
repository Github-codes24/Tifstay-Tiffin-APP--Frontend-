import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { Images } from "@/constants/images";
import { router } from "expo-router";

const MyProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={Images.back} style={styles.backIcon} />
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => router.push("/editprofile")}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Image source={Images.Dummy} style={styles.profileImage} />
          <Text style={styles.profileName}>Maharashtrian Ghar Ka Khana</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow
            icon={Images.name}
            label="Name"
            value="Maharashtrian Ghar Ka Khana"
          />
          <InfoRow
            icon={Images.email}
            label="Email"
            value="maharashtrian@gmail.com"
          />
          <InfoRow
            icon={Images.phone}
            label="Phone Number"
            value="715-601-4598"
          />
          <InfoRow
            icon={Images.bank}
            label="Bank Details"
            value={`98765432101\nSBIN0001234\nSavings\nMahesh Pawar`}
          />
        </View>

        <MenuItem label="Manage Profile" icon={Images.manage} />

        <MenuItem
          label="Change Password"
          icon={Images.lock}
          onPress={() => router.push("/changepassword")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <Image source={icon} style={styles.infoIcon} />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const MenuItem = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: any;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Image source={icon} style={styles.menuIcon} />
      <Text style={styles.menuText}>{label}</Text>
    </View>
    <Image source={Images.back} style={styles.arrowIcon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 30,
    justifyContent: "space-between",
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  editText: {
    fontSize: 16,
    color: "#004AAD",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  profileImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  infoCard: {
    backgroundColor: "#F8F7FF",
    marginHorizontal: 26,
    height: 296,
    borderRadius: 12,
    padding: 16,
    marginTop: 14,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoIcon: {
    width: 40.73,
    height: 40,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A051F",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666060",
    lineHeight: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    backgroundColor: "#F8F7FF",
    marginTop: 16,
    height: 72,
    marginHorizontal: 26,
    borderRadius: 12,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A051F",
  },
  arrowIcon: {
    width: 18,
    height: 18,
    tintColor: "#999",
  },
});

export default MyProfileScreen;
