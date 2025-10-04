import CommonHeader from "@/components/CommonHeader";
import { Colors } from "@/constants/Colors";
import { AMENITY_ICONS, DEFAULT_AMENITY_ICON } from "@/constants/iconMappings";
import { fonts } from "@/constants/typography";
import hostelApiService from "@/services/hostelApiService";
import { HostelDetails as HostelDetailsType } from "@/types/hostel";
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
  const [hostel, setHostel] = useState<HostelDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchHostelDetails();
  }, [id]);

  const fetchHostelDetails = async () => {
    if (!id) {
      setError("No hostel ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await hostelApiService.getHostelServiceById(id);

      if (response.success && response.data?.data) {
        setHostel(response.data.data);
      } else {
        setError(response.error || "Failed to fetch hostel details");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <CommonHeader
          title="Hostel Details"
          onActionPress={() => router.back()}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <CommonHeader
          title="Hostel Details"
          onActionPress={() => router.back()}
        />
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hostel) {
    return (
      <SafeAreaView style={styles.container}>
        <CommonHeader
          title="Hostel Details"
          onActionPress={() => router.back()}
        />
        <View style={styles.center}>
          <Text>No hostel found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== IMAGE CAROUSEL SECTION ====================
  const renderImageCarousel = () => {
    const imageWidth = width - 32;
    const hasImages = hostel.hostelPhotos && hostel.hostelPhotos.length > 0;

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
          data={hostel.hostelPhotos}
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
              source={{ uri: item }}
              style={styles.image}
              sharedTransitionTag="sharedTag"
              defaultSource={require("../../../assets/images/home.png")}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Pagination dots */}
        {hostel.hostelPhotos.length > 1 && (
          <View style={styles.pagination}>
            {hostel.hostelPhotos.map((_: any, index: number) => (
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
        <Text style={styles.title}>{hostel.hostelName}</Text>
      </View>

      {/* Tags for Hostel */}
      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{hostel.hostelType}</Text>
        </View>
        <View style={styles.locationTag}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationTagText}>{hostel.location.area}</Text>
        </View>
      </View>

      {/* Hostel-specific location info */}
      {hostel.location.nearbyLandmarks && (
        <Text style={styles.subLocation}>
          Near {hostel.location.nearbyLandmarks}
        </Text>
      )}

      {/* Hostel room availability */}
      <View style={styles.roomAvailability}>
        <Text style={styles.roomText}>Total Rooms: {hostel.totalRooms}</Text>
        <View style={styles.bedInfo}>
          <Ionicons name="bed-outline" size={16} color="#666" />
          <Text style={styles.roomText}> {hostel.totalBeds} total beds</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{hostel.description}</Text>

      {renderPricingSection()}
    </View>
  );

  // ==================== PRICING SECTION ====================
  const renderPricingSection = () => {
    if (!hostel.pricing) {
      return null;
    }

    const { perDay, weekly, monthly } = hostel.pricing;
    const hasOffer = hostel.offers && hostel.offers.trim() !== "";

    let primaryPrice = null;
    let primaryLabel = "";
    let primaryPeriod = "";

    if (monthly && monthly > 0) {
      primaryPrice = monthly;
      primaryLabel = "/month";
      primaryPeriod = "monthly";
    } else if (weekly && weekly > 0) {
      primaryPrice = weekly;
      primaryLabel = "/week";
      primaryPeriod = "weekly";
    } else if (perDay && perDay > 0) {
      primaryPrice = perDay;
      primaryLabel = "/day";
      primaryPeriod = "daily";
    }

    if (!primaryPrice) return null;

    return (
      <View style={styles.pricingBox}>
        <View style={styles.secondaryPricesContainer}>
          {perDay > 0 && primaryPrice !== perDay && (
            <Text style={styles.secondaryPrice}>₹{perDay}/day</Text>
          )}
          {weekly > 0 && primaryPrice !== weekly && (
            <Text style={styles.secondaryPrice}>₹{weekly}/week</Text>
          )}
        </View>

        <View style={styles.primaryPriceRow}>
          <Text style={styles.primaryPrice}>
            ₹{primaryPrice}
            <Text style={styles.primaryPeriod}>{primaryLabel}</Text>
          </Text>

          {hasOffer && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{hostel.offers} OFF</Text>
            </View>
          )}
        </View>

        {hostel.securityDeposit > 0 && (
          <Text style={styles.depositNote}>
            Note: You have to pay security deposit of ₹
            {hostel.securityDeposit.toLocaleString()} on {primaryPeriod}{" "}
            booking. It will be refunded to you on check-out.
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
      {hostel.rulesAndPolicies && hostel.rulesAndPolicies.trim() !== "" && (
        <View style={[styles.section, styles.rulesSection]}>
          <Text style={styles.sectionTitle}>Rules & Policies</Text>
          <View style={styles.rulesBox}>
            <Ionicons
              name="alert-circle"
              size={20}
              color="#DE9809"
              style={styles.rulesIcon}
            />
            <View style={styles.rulesContent}>
              <Text style={styles.rulesText}>{hostel.rulesAndPolicies}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Location */}
      <View style={[styles.section, styles.locationSection]}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={[styles.locationBox, { marginTop: 12 }]}>
          {hostel.location.nearbyLandmarks && (
            <Text style={styles.locationTitle}>
              Near {hostel.location.nearbyLandmarks}
            </Text>
          )}
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
      <View style={styles.infoBoxSub}>
        <View style={styles.infoBox}>
          <Ionicons name="call-outline" size={20} color="#0A051F" />
          <Text style={styles.infoValue}>{hostel.contactInfo.phone}</Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          <Text style={styles.infoValue}>{hostel.contactInfo.whatsapp}</Text>
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
    textAlign: "center",
    paddingHorizontal: 20,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    fontFamily: fonts.interBold,
  },
  tagsContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#5E9BED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: fonts.interMedium,
  },
  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationTagText: {
    fontSize: 13,
    color: "#666060",
    fontWeight: "500",
    fontFamily: fonts.interMedium,
  },
  subLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontFamily: fonts.interRegular,
  },
  roomAvailability: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  roomText: {
    fontSize: 13,
    color: "#666",
    fontFamily: fonts.interMedium,
  },
  bedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  description: {
    fontSize: 15,
    color: "#666060",
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: fonts.interRegular,
  },
  pricingBox: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  secondaryPricesContainer: {
    gap: 2,
    marginBottom: 4,
  },
  secondaryPrice: {
    fontSize: 14,
    color: "#666",
    fontFamily: fonts.interRegular,
  },
  primaryPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  primaryPrice: {
    fontSize: 32,
    fontWeight: "700",
    color: "#004AAD",
    fontFamily: fonts.interBold,
  },
  primaryPeriod: {
    fontSize: 18,
    fontWeight: "400",
    color: "#666",
    fontFamily: fonts.interRegular,
  },
  discountBadge: {
    backgroundColor: "#5E9BED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    fontFamily: fonts.interSemibold,
  },
  depositNote: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    fontFamily: fonts.interRegular,
    width: "83%",
  },
  detailsContainer: {},
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: fonts.interSemibold,
  },
  facilitiesSection: {
    marginBottom: 20,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  facilitiesContainer: {
    borderRadius: 12,
    paddingTop: 12,
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 20,
    gap: 6,
  },
  facilityIcon: {
    marginRight: 2,
  },
  facilityText: {
    fontSize: 13,
    color: "#333",
    fontFamily: fonts.interMedium,
  },
  rulesSection: {
    marginBottom: 20,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  rulesBox: {
    backgroundColor: "#FFFDF0",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#DE9809",
    marginTop: 12,
    gap: 10,
  },
  rulesIcon: {
    marginTop: 2,
  },
  rulesContent: {
    flex: 1,
  },
  rulesText: {
    fontSize: 13,
    color: "#DE9809",
    fontFamily: fonts.interMedium,
    lineHeight: 20,
  },
  locationSection: {
    marginBottom: 20,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  locationBox: {
    gap: 8,
  },
  locationTitle: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: "#333",
  },
  locationAddress: {
    fontSize: 13,
    color: "#666",
    fontFamily: fonts.interRegular,
    lineHeight: 20,
  },
  infoContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
  },
  infoBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  infoHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
    fontFamily: fonts.interSemibold,
  },
  infoBoxSub: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoValue: {
    fontSize: 14,
    color: "#0A051F",
    fontFamily: fonts.interMedium,
  },
});
