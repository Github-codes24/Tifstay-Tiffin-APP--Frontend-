// screens/MealDetails.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import CommonButton from "@/components/CommonButton";
import { router } from "expo-router";

const MealDetails = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Meal Image */}
        <View style={{paddingHorizontal:16}}>
        <Image source={Images.food} style={styles.image} />
        </View>

        {/* Title + Description */}
        <Text style={styles.title}>Maharashtrian Ghar Ka Khana</Text>
        <Text style={styles.description}>
          Authentic Maharashtrian home-style cooking with fresh ingredients. Our
          tiffin service has been serving the Nagpur community for over 5 years
          with traditional recipes passed down through generations.
        </Text>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={[styles.row, styles.vegTag]}>
            <Image source={Images.veg} style={styles.iconSmall} />
            <Text style={styles.tag}>Veg</Text>
          </View>

          <View style={styles.row}>
            <Image source={Images.loc} style={styles.iconSmall} />
            <Text style={styles.info}>Dharampeth</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="#555" />
            <Text style={styles.info}>7:00 AM - 10:00 PM</Text>
          </View>
        </View>

        {/* Pricing Card */}
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>With One Meal (Veg)</Text>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceText}>Dining ₹120/day</Text>
              <Text style={styles.priceText}>Dining ₹800/week</Text>
              <Text style={styles.priceText}>Dining ₹3200/month</Text>
            </View>
            <View>
              <Text style={styles.priceText}>Delivery ₹130/day</Text>
              <Text style={styles.priceText}>Delivery ₹870/week</Text>
              <Text style={styles.priceText}>Delivery ₹3500/month</Text>
            </View>
          </View>

          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>10% OFF</Text>
          </View>
        </View>

        {/* Meal Preference */}
        <Text style={styles.sectionTitle}>Meal Preference</Text>
        <Text style={styles.listItem}>• Breakfast (7:00 AM - 9:00 AM)</Text>
        <Text style={styles.listItem}>• Lunch (12:00 PM - 2:00 PM)</Text>
        <Text style={styles.listItem}>• Dinner (8:00 PM - 10:00 PM)</Text>

        {/* What's Included */}
        <Text style={styles.sectionTitle}>What's included</Text>
        <Text style={styles.listItem}>
          • 2 Roti + 1 Sabzi + Dal + Rice + Pickle
        </Text>
        <Text style={styles.listItem}>• Seasonal vegetables</Text>
        <Text style={styles.listItem}>• Fresh chapati made daily</Text>
        <Text style={styles.listItem}>• Traditional spices</Text>

        {/* Order Type */}
        <Text style={styles.sectionTitle}>Order Type</Text>
        <Text style={styles.listItem}>• Dining</Text>
        <Text style={styles.listItem}>• Delivery</Text>

        {/* Why Choose Us */}
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        <Text style={styles.listItem}>• Fresh ingredients daily</Text>
        <Text style={styles.listItem}>• Home-style cooking</Text>
        <Text style={styles.listItem}>• Hygienic preparation</Text>
        <Text style={styles.listItem}>• On-time delivery</Text>
        <Text style={styles.listItem}>• Monthly subscription available</Text>

        {/* Location */}
        <View style={styles.card}>
          <Text style={styles.infoTitle}>Location</Text>
          <Text style={styles.infoListItem}>Near Medical College</Text>
          <Text style={styles.infoListItem}>
            123, Green Valley Road, Dharampeth, Nagpur - 440010
          </Text>
          <Text style={styles.infoListItem}>Service Radius: 5 sq km</Text>
        </View>

        {/* Contact Info */}
        <View style={[styles.card, styles.noTopMargin]}>
          <Text style={styles.infoTitle}>Contact Information</Text>
          <View style={styles.contactRow}>
            <View style={styles.contactBox}>
              <Image source={Images.call} style={styles.iconMedium} />
              <Text style={styles.contactText}>9876543210</Text>
            </View>
            <View style={styles.contactBox}>
              <Image source={Images.chat} style={styles.iconMedium} />
              <Text style={styles.contactText}>9876543210</Text>
            </View>
          </View>
        </View>

        <CommonButton
          title="+ Create Tiffin Listing"
          buttonStyle={styles.createButton}
          onPress={() => {
            router.push("/(service)/confirmService");
          }}
        />

        <Text style={[styles.listItem, styles.reviewNote]}>
          Your listing will be reviewed and approved within 24 hours
        </Text>
      </ScrollView>
    </View>
  );
};

export default MealDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 30 },
  image: {
    width: "100%",
    height: 270,
    borderRadius: 15,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  vegTag: {
    backgroundColor: Colors.green,
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tag: {
    color: Colors.white,
    fontFamily: fonts.interMedium,
    fontSize: 12,
  },
  info: {
    color: Colors.grey,
    fontFamily: fonts.interMedium,
    fontSize: 12,
  },
  priceCard: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    margin: 16,
    borderRadius: 12,
    position: "relative",
  },
  priceTitle: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    marginBottom: 12,
    color: Colors.primary,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceText: {
    fontSize: 12,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
    marginBottom: 6,
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#3A88FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: fonts.interRegular,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
    color: Colors.title,
  },
  listItem: {
    fontSize: 12,
    color: Colors.grey,
    paddingHorizontal: 16,
    marginBottom: 4,
    fontFamily: fonts.interMedium,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    marginBottom: 8,
    color: Colors.title,
  },
  infoListItem: {
    fontSize: 12,
    color: Colors.grey,
    fontFamily: fonts.interMedium,
    marginBottom: 4,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DFE1E6",
  },
  noTopMargin: { marginTop: 0 },
  contactRow: { flexDirection: "row", gap: 8 },
  contactBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DFE1E6",
    padding: 8,
    borderRadius: 36,
    gap: 4,
  },
  contactText: {
    fontFamily: fonts.interMedium,
    fontSize: 14,
    color: Colors.title,
  },
  createButton: { marginHorizontal: 16, marginTop: 16 },
  reviewNote: { marginTop: 10 ,textAlign:'center' },
  iconSmall: { height: 16, width: 16 },
  iconMedium: { height: 20, width: 20 },
});
