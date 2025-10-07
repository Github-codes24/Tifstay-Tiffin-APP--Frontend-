import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { router } from "expo-router";

const MyProfileScreen = () => {
  const { user } = useAuthStore();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user?.profileImage }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user?.fullName}</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow
            icon={Images.name}
            label="Name"
            value={user?.fullName || ""}
          />
          <InfoRow
            icon={Images.email1}
            label="Email"
            value={user?.email || ""}
          />
          <InfoRow
            icon={Images.phone}
            label="Phone Number"
            value={user?.phoneNumber || ""}
          />
          <InfoRow
            icon={Images.bank}
            label="Bank Details"
            value={`${user?.bankDetails.accountNumber || ""}\n${
              user?.bankDetails.ifscCode || ""
            }\n${user?.bankDetails.accountType || ""}\n${
              user?.bankDetails.bankName || ""
            }\n${user?.bankDetails.accountHolderName || ""}`}
          />
        </View>

        <MenuItem
          label="Manage Profile"
          icon={Images.manage}
          onPress={() => router.push("/(secure)/(accountScreens)/edit")}
        />

        <MenuItem
          label="Change Password"
          icon={Images.lock1}
          onPress={() =>
            router.push("/(secure)/(accountScreens)/changePassword")
          }
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
    fontFamily: fonts.interSemibold,
    marginTop: 12,
  },
  infoCard: {
    backgroundColor: "#F8F5FF",
    marginHorizontal: 26,
    // height: 296,
    borderRadius: 12,
    padding: 16,
    marginTop: 14,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
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
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  arrowIcon: {
    width: 18,
    height: 18,
    tintColor: Colors.title,
  },
});

export default MyProfileScreen;
