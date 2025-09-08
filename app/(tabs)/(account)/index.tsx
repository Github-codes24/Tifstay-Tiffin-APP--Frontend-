import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const AccountScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const handleLogout = () => {
    setLogoutVisible(false);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={Images.user} style={styles.largeImage} />
            <View style={styles.cameraIconContainer}>
              <Image source={Images.photos} style={styles.cameraIcon} />
            </View>
          </View>
          <Text style={styles.title}>Maharashtrian Ghar Ka Khana</Text>
        </View>

        {/* Profile Tab */}
        <MenuItem
          label="Profile"
          image={Images.Profile}
          backgroundColor="#004AAD"
          textColor="#fff"
          iconTint="#fff"
          customStyle={{
            borderRadius: 10,
          }}
          onpress={() => router.push("/profile")}
        />

        {/* Menu Items */}
        <MenuItem
          label="Address"
          image={Images.address}
          onpress={() => router.push("/address")}
        />
        <MenuItem
          label="My Customers"
          image={Images.customer}
          onpress={() => router.push("/myCustomers")}
        />
        <MenuItem label="Offers" image={Images.offers} />
        <MenuItem
          label="Privacy Policy"
          image={Images.PrivacyPolicyIcon}
          onpress={() => router.push("/privacyPolicy")}
        />
        <MenuItem
          label="Terms and Conditions"
          image={Images.termsandconditions}
          onpress={() => router.push("/termsCondition")}
        />
        <MenuItem
          label="Contact Us"
          onpress={() => router.push("/contactUs")}
          image={Images.contactus}
        />

        {/* Language Selector */}
        <View style={styles.sectionRow}>
          <Text style={styles.languageText}>Language</Text>
          <TouchableOpacity
            style={styles.dropdownContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>English</Text>
            <Image
              source={Images.back}
              style={[
                styles.arrowIcon,
                { tintColor: Colors.grey, transform: [{ rotate: "90deg" }] },
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Dark Mode Toggle */}
        <View style={styles.sectionRow}>
          <Text style={styles.languageText}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        {/* Logout */}
        <MenuItem
          label="Log Out"
          image={Images.logout}
          onpress={() => setLogoutVisible(true)}
        />
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        transparent
        visible={logoutVisible}
        animationType="fade"
        onRequestClose={() => setLogoutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout</Text>
            <View style={styles.divider} />
            <Text style={styles.modalMessage}>Are you sure?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const MenuItem = ({
  label,
  image,
  backgroundColor = "#fff",
  textColor = Colors.grey,
  iconTint = Colors.grey,
  customStyle = {},
  onpress,
}: {
  label: string;
  image: any;
  backgroundColor?: string;
  textColor?: string;
  iconTint?: string;
  customStyle?: ViewStyle;
  onpress?: () => void;
}) => (
  <TouchableOpacity
    style={[styles.menuItem, { backgroundColor }, customStyle]}
    onPress={onpress}
  >
    <View style={styles.menuLeft}>
      <Image source={image} style={styles.smallIcon} />
      <Text style={[styles.menuText, { color: textColor }]}>{label}</Text>
    </View>
    <Image
      source={Images.back}
      style={[styles.arrowIcon, { tintColor: iconTint }]}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { paddingBottom: 40, flexGrow: 1 },
  profileHeader: { alignItems: "center", marginVertical: 20 },
  profileImageContainer: {
    position: 'relative',
    width: 86,
    height: 86,
  },
  largeImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 2,
    right: 5,
   
   
  },
  cameraIcon: {
    width: 23,
    height: 23,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 28,
    marginVertical: 5,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  smallIcon: { width: 24, height: 24, marginRight: 12 },
  menuText: { fontSize: 16, fontFamily: fonts.interRegular },
  arrowIcon: { width: 18, height: 18 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 28,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderTopColor: Colors.lightGrey,
  },
  languageText: {
    fontSize: 16,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 120,
    backgroundColor: Colors.white,
  },
  dropdownText: { fontSize: 16, color: "#0A0A23" },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 64,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: fonts.interBold,
    color: Colors.orange,
    marginBottom: 8,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.lightGrey,
    marginVertical: 8,
  },
  modalMessage: {
    fontSize: 24,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginVertical: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.primary,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.white,
  },
});

export default AccountScreen;
