import CommonHeader from "@/components/CommonHeader";
import { Colors } from "@/constants/Colors";
import { AMENITY_ICONS, DEFAULT_AMENITY_ICON } from "@/constants/iconMappings";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { Hostel } from "@/types/hostel";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function HostelDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { hostelList, getHostelList, isLoading, error } = useAuthStore();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHostels = async () => {
      if (hostelList.length === 0) {
        await getHostelList();
      }
    };
    fetchHostels();
  }, []);

  useEffect(() => {
    if (id && hostelList.length > 0) {
      const found = hostelList.find((h) => h._id === id);
      setHostel(found || null);
    }
  }, [id, hostelList]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!hostel) {
    return (
      <View style={styles.center}>
        <Text>No hostel found</Text>
      </View>
    );
  }

  // ==================== IMAGE CAROUSEL SECTION ====================
  const renderImageCarousel = () => {
    const imageWidth = width - 32;
    const hasImages = hostel.photos && hostel.photos.length > 0;

    if (!hasImages) {
      return (
        <View style={[styles.imageContainer, styles.noImageContainer]}>
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      );
    }

    return (
      <Animated.View
        style={styles.imageContainer}
        sharedTransitionTag="sharedTag"
      >
        <FlatList
          data={hostel.photos}
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
            <Animated.Image
              source={{ uri: `${item}` }}
              style={styles.image}
              sharedTransitionTag="sharedTag"
              defaultSource={require("../../assets/images/home.png")}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Pagination dots */}
        {hostel.photos.length > 1 && (
          <View style={styles.pagination}>
            {hostel.photos.map((_: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentImageIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </Animated.View>
    );
  };

  // ==================== BASIC INFO SECTION ====================
  const renderBasicInfo = () => (
    <View style={styles.basicInfo}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{hostel.name}</Text>
      </View>

      {/* Tags for Hostel */}
      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{hostel.hostelType}</Text>
        </View>
        <View style={styles.locationTag}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationTagText}>
            {hostel.location.area || hostel.location.fullAddress}
          </Text>
        </View>
      </View>

      {/* Hostel-specific location info */}
      {hostel.location.landmark && (
        <Text style={styles.sublocation}>{hostel.location.landmark}</Text>
      )}

      {/* Hostel room availability */}
      <View style={styles.roomAvailability}>
        <Text style={styles.roomText}>Total Rooms: {hostel.rooms.length}</Text>
        {hostel.rooms.length > 0 && (
          <View style={styles.bedInfo}>
            <Ionicons name="bed-outline" size={16} color="#666" />
            <Text style={styles.roomText}>
              {hostel.rooms.reduce((total, room) => total + room.noOfBeds, 0)}{" "}
              total beds
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description}>{hostel.description}</Text>

      {/* Pricing Section */}
      {renderPricingSection()}
    </View>
  );

  // ==================== PRICING SECTION ====================
  const renderPricingSection = () => {
    if (!hostel.pricing || hostel.pricing.length === 0) {
      return null;
    }

    const pricing = hostel.pricing[0];
    const hasOffer = pricing.offer && pricing.offer.trim() !== "";

    return (
      <View style={styles.pricingBox}>
        <View style={styles.priceMainRow}>
          <Text style={styles.currentPrice}>
            ₹{pricing.price}/{pricing.type}
          </Text>
          {hasOffer && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{pricing.offer}</Text>
            </View>
          )}
        </View>
        {pricing.securityDeposit > 0 && (
          <Text style={styles.depositNote}>
            Note: You have to pay security deposit of ₹{pricing.securityDeposit}{" "}
            on {pricing.type} booking. It will be refunded to you on check-out.
          </Text>
        )}
      </View>
    );
  };

  // ==================== HOSTEL DETAILS SECTION ====================
  const renderHostelDetails = () => (
    <View style={styles.detailsContainer}>
      {/* Facilities & Amenities */}
      {hostel.facilities && hostel.facilities.length > 0 && (
        <View style={[styles.section, styles.facilitiesSection]}>
          <Text style={styles.sectionTitle}>Facilities & Amenities</Text>
          <View style={styles.facilitiesContainer}>
            <View style={styles.facilitiesGrid}>
              {hostel.facilities.map((facility: string, index: number) => {
                const iconName =
                  AMENITY_ICONS[facility] || DEFAULT_AMENITY_ICON;

                return (
                  <View key={index} style={styles.facilityItem}>
                    <Ionicons
                      name={iconName as any}
                      size={20}
                      color="#333"
                      style={styles.facilityIcon}
                    />
                    <Text style={styles.facilityText}>{facility}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* Rules & Policies */}
      {hostel.rules && hostel.rules.length > 0 && (
        <View style={[styles.section, styles.rulesSection]}>
          <Text style={styles.sectionTitle}>Rules & Policies</Text>
          <View style={styles.rulesBox}>
            <Ionicons
              name="alert-circle"
              size={20}
              color="#FFA726"
              style={styles.rulesIcon}
            />
            <View style={styles.rulesContent}>
              {hostel.rules.map((rule: string, index: number) => (
                <Text key={index} style={styles.rulesText}>
                  • {rule}
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Location */}
      <View style={[styles.section, styles.locationSection]}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={[styles.locationBox, { marginTop: 12 }]}>
          <Text style={styles.locationTitle}>
            {hostel.location.landmark || hostel.location.area}
          </Text>
          <Text style={styles.locationAddress}>
            {hostel.location.fullAddress}
          </Text>
        </View>
      </View>
    </View>
  );

  // ==================== CONTACT INFO SECTION ====================
  const renderContactInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.infoHeaderTitle}>Contact Information</Text>
      <View style={styles.infoBoxsub}>
        <View style={styles.infoBox}>
          <Ionicons name="call-outline" size={20} color="#0A051F" />
          <Text style={styles.infoValue}>{hostel.contact.phone}</Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color="#0A051F"
          />
          <Text style={styles.infoValue}>{hostel.contact.whatsapp}</Text>
        </View>
      </View>
    </View>
  );

  // ==================== MAIN RENDER ====================
  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        title="Hostel Details"
        onActionPress={() => router.back()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}
        {renderBasicInfo()}
        {renderHostelDetails()}
        {renderContactInfo()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  imageContainer: {
    height: 250,
    position: "relative",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 15,
    overflow: "hidden",
  },
  noImageContainer: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 16,
    color: "#999",
    fontFamily: fonts.interMedium,
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
    fontFamily: fonts.interMedium,
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
    fontFamily: fonts.interMedium,
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
    fontFamily: fonts.interRegular,
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
    fontFamily: fonts.interMedium,
  },
  currentPrice: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
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
    fontFamily: fonts.interRegular,
  },
  depositNote: {
    fontSize: 10,
    color: "#666",
    marginTop: 8,
    lineHeight: 18,
    fontFamily: fonts.interMedium,
    maxWidth: 257,
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
    borderWidth: 1,
    borderColor: "#DE9809",
  },
  rulesIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  rulesContent: {
    flex: 1,
  },
  rulesText: {
    fontSize: 12,
    color: "#DE9809",
    fontFamily: fonts.interMedium,
    lineHeight: 20,
    marginBottom: 4,
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
    fontFamily: fonts.interMedium,
    marginBottom: 4,
    color: "#666060",
  },
  locationAddress: {
    fontSize: 12,
    color: "#666",
    fontFamily: fonts.interMedium,
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
    justifyContent: "center",
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
    marginTop: 8,
  },
  infoValue: {
    fontSize: 14,
    color: "#0A051F",
    lineHeight: 20,
    padding: 5,
    fontFamily: fonts.interMedium,
  },
});
