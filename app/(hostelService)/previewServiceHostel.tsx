import CommonButton from "@/components/CommonButton";
import CommonHeader from "@/components/CommonHeader";
import { AMENITY_ICONS, DEFAULT_AMENITY_ICON } from "@/constants/iconMappings";
import { fonts } from "@/constants/typography";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Demo data
const demoHostelData = {
  id: 1,
  name: "Premium Student Hostel",
  rating: 4.5,
  reviews: 120,
  type: "Boys Hostel",
  location: "Downtown",
  sublocation: "Near Medical College",
  totalRooms: 50,
  availableBeds: 12,
  totalBeds: 100,
  description:
    "A well-maintained boys hostel with all modern amenities. Located in a prime area with easy access to colleges and hospitals. Safe and secure environment with 24/7 security.",
  price: "₹8500/month",
  offer: 15,
  deposit: "₹15000",
  images: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500",
  ],
  amenities: ["WiFi", "Meals", "Security", "Study Hall", "Common TV", "CCTV"],
  rulesAndPolicies:
    "No smoking inside premises. Visitors allowed till 8 PM. Mess timing: 7-10 AM, 12-2 PM, 7-9 PM. Maintain cleanliness in common areas.",
  fullAddress: "123 Main Street, Downtown, City - 560001",
};

export default function PreviewServiceHostel() {
  const [data] = useState(demoHostelData);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ==================== IMAGE CAROUSEL SECTION ====================
  const renderImageCarousel = () => {
    const imageWidth = width - 32;

    return (
      <View style={styles.imageContainer}>
        <FlatList
          data={data.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={imageWidth}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / imageWidth
            );
            setCurrentImageIndex(index);
          }}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Pagination dots */}
        <View style={styles.pagination}>
          {data.images.map((_: any, index: number) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentImageIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  // ==================== BASIC INFO SECTION ====================
  const renderBasicInfo = () => (
    <View style={styles.basicInfo}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{data.name}</Text>
        {/* <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFA500" />
          <Text style={styles.rating}>
            {data.rating} ({data.reviews})
          </Text>
        </View> */}
      </View>

      {/* Tags for Hostel */}
      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{data.type}</Text>
        </View>
        <View style={styles.locationTag}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationTagText}>{data.location}</Text>
        </View>
      </View>

      {/* Hostel-specific location info */}
      {data.sublocation && (
        <Text style={styles.sublocation}>{data.sublocation}</Text>
      )}

      {/* Hostel room availability */}
      <View style={styles.roomAvailability}>
        <Text style={styles.roomText}>Total Rooms: {data.totalRooms}</Text>
        <View style={styles.bedInfo}>
          <Ionicons name="bed-outline" size={16} color="#666" />
          <Text style={styles.roomText}>
            {data.availableBeds}/{data.totalBeds} bed available
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{data.description}</Text>

      {/* Pricing Section */}
      {renderPricingSection()}
    </View>
  );

  // ==================== PRICING SECTION ====================
  const renderPricingSection = () => (
    <View style={styles.pricingBox}>
      <View style={styles.priceRow}>
        <Text style={styles.oldPrice}>₹300/day</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.oldPrice}>₹2000/week</Text>
      </View>
      <View style={styles.priceMainRow}>
        <Text style={styles.currentPrice}>{data.price}</Text>
        {data.offer && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{data.offer}% OFF</Text>
          </View>
        )}
      </View>
      <Text style={styles.depositNote}>
        Note: You have to pay security deposit of {data.deposit} on monthly
        booking. It will be refunded to you on check-out.
      </Text>
    </View>
  );

  // ==================== HOSTEL DETAILS SECTION ====================
  const renderHostelDetails = () => (
    <View style={styles.detailsContainer}>
      {/* Facilities & Amenities */}
      <View style={[styles.section, styles.facilitiesSection]}>
        <Text style={styles.sectionTitle}>Facilities & Amenities</Text>
        <View style={styles.facilitiesContainer}>
          <View style={styles.facilitiesGrid}>
            {data.amenities?.map((amenity: any, index: number) => {
              const amenityName =
                typeof amenity === "string" ? amenity : amenity.name;
              const isAvailable =
                typeof amenity === "string"
                  ? true
                  : amenity.available !== false;
              const iconName =
                AMENITY_ICONS[amenityName] || DEFAULT_AMENITY_ICON;

              return (
                <View key={index} style={styles.facilityItem}>
                  <Ionicons
                    name={iconName as any}
                    size={20}
                    color={isAvailable ? "#333" : "#ccc"}
                    style={styles.facilityIcon}
                  />
                  <Text
                    style={[
                      styles.facilityText,
                      !isAvailable && styles.unavailableFacility,
                    ]}
                  >
                    {amenityName}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Rules & Policies */}
      <View style={[styles.section, styles.rulesSection]}>
        <Text style={styles.sectionTitle}>Rules & Policies</Text>
        <View style={styles.rulesBox}>
          <Ionicons
            name="alert-circle"
            size={20}
            color="#FFA726"
            style={styles.rulesIcon}
          />
          <Text style={styles.rulesText}>
            {data.rulesAndPolicies ||
              "No smoking inside premises. Visitors allowed till 8 PM. Mess timing: 7-10 AM, 12-2 PM, 7-9 PM. Maintain cleanliness in common areas."}
          </Text>
        </View>
      </View>

      {/* Location */}
      <View style={[styles.section, styles.locationSection]}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={[styles.locationBox , {marginTop:12}]}>
          <Text style={styles.locationTitle}>Near Medical College</Text>
          <Text style={styles.locationAddress}>
            {data.fullAddress || `${data.sublocation}, ${data.location}`}
          </Text>
        </View>
      </View>
    </View>
  );
  const renderContactInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.infoHeaderTitle}>Contact Information</Text>
      <View style={styles.infoBoxsub}>
        <View style={styles.infoBox}>
          <Ionicons name="call-outline" size={20} color="#0A051F" />
          <Text style={styles.infoValue}>9893464946</Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color="#0A051F"
          />
          <Text style={styles.infoValue}>9893464946</Text>
        </View>
      </View>
    </View>
  );

  // ==================== BOTTOM BUTTONS SECTION ====================
  const renderBottomButtons = () => (
    <>
    <View style={{ width: "100%", marginTop: 20 }}>
      <CommonButton
        buttonStyle={{ marginHorizontal: 16 }}
        title="+ Create Hostel Listing"
        onPress={() => {
          router.push("/(tabs)/(dashboard)");
        }}
      />
    </View>
          <Text style={{fontSize:12 , fontFamily:fonts.interRegular , color:'#666' , textAlign:'center' , marginTop:8}}>Your listing will be reviewed and approved within 24 hours</Text>
</>
  );

  // ==================== MAIN RENDER ====================
  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        title="Preview Hostel Service"
        onActionPress={() => router.back()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}
        {renderBasicInfo()}
        {renderHostelDetails()}
        {renderContactInfo()}
        {renderBottomButtons()}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Image carousel styles
  imageContainer: {
    height: 250,
    position: "relative",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    width: width - 32,
    height: 250,
    resizeMode: "cover",
  },
  pagination: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Basic info styles
  basicInfo: {
    padding: 16,
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rating: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  tag: {
    backgroundColor: "#5E9BED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#fff",
    fontFamily:fonts.interMedium,
  },
  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  locationTagText: {
    fontSize: 12,
    color: "#666060",
    fontWeight: "500",
  },
  sublocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  roomAvailability: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  roomText: {
    fontSize: 12,
    color: "#666",
    marginRight: 12,
    fontFamily:fonts.interMedium,
    lineHeight: 20,
    paddingVertical: 8,
  },
  bedInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    color: "#666060",
    lineHeight: 20,
    marginBottom: 16,
    fontFamily:fonts.interRegular
  },

  // Pricing styles
  pricingBox: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
  },
  priceRow: {
    marginBottom: 4,
  },
  priceMainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  oldPrice: {
    fontSize: 12,
    color: "#666",
    fontFamily:fonts.interMedium
  },
  currentPrice: {
    fontSize: 20,
    fontFamily:fonts.interSemibold,
    color: "#004AAD",
  },
  discountBadge: {
    backgroundColor: "#3A88FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    fontSize: 12,
    color: "#fff",
    fontFamily:fonts.interRegular,
  },
  depositNote: {
    fontSize: 10,
    color: "#666",
    marginTop: 8,
    lineHeight: 18,
    fontFamily:fonts.interMedium,
    maxWidth:257
  },

  // Details container
  detailsContainer: {
    // padding: 16,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  // Hostel details specific styles
  facilitiesSection: {
    marginBottom: 20,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  facilitiesContainer: {
    borderRadius: 12,
    padding: 16,
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
    gap: 8,
  },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 4,
  },
  facilityIcon: {
    marginRight: 6,
  },
  facilityText: {
    fontSize: 13,
    color: "#333",
    flexShrink: 1,
  },
  unavailableFacility: {
    color: "#ccc",
  },
  rulesSection: {
    marginBottom: 20,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 10,
    gap: 10,
  },
  rulesBox: {
    backgroundColor: "#FFFDF0",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth:1,
    borderColor:'#DE9809'
  },
  rulesIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  rulesText: {
    fontSize: 12,
    color: "#DE9809",
    flex: 1,
    // lineHeight: 20,
    fontFamily:fonts.interMedium
  },

  // Location section styles
  locationSection: {
    marginBottom: 0,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
  },
  locationBox: {
    // padding: 16,
  },
  locationTitle: {
    fontSize: 12,
    fontFamily:fonts.interMedium,
    marginBottom: 4,
    color: "#666060",
  },
  locationAddress: {
    fontSize: 12,
    color: "#666",
    fontFamily:fonts.interMedium,
    marginBottom: 4,
    lineHeight: 20,
  },
  infoContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    padding: 6,
    justifyContent:'center'
  },
  infoHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  infoBoxsub: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop:8
  },
  infoValue: {
    fontSize: 14,
    color: "#0A051F",
    lineHeight: 20,
    padding:5,
    fontFamily:fonts.interMedium
  },
  // Bottom buttons styles
  bottomContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
});
