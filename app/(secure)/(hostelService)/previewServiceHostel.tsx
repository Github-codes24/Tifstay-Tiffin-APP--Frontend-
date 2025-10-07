import CommonButton from "@/components/CommonButton";
import CommonHeader from "@/components/CommonHeader";
import { AMENITY_ICONS, DEFAULT_AMENITY_ICON } from "@/constants/iconMappings";
import { fonts } from "@/constants/typography";
import useServiceStore from "@/store/serviceStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PreviewServiceHostel() {
  const { getCompleteFormData, clearFormData, createHostelService, isLoading } =
    useServiceStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get data from store
  const formData = getCompleteFormData();

  // Convert form data to preview format
  const data = {
    id: 1,
    name: formData?.hostelName || "Preview Hostel",
    rating: 0,
    reviews: 0,
    type:
      formData?.hostelType === "boys"
        ? "Boys Hostel"
        : formData?.hostelType === "girls"
        ? "Girls Hostel"
        : "Co-ed Hostel",
    location: formData?.area || "Location",
    sublocation: formData?.nearbyLandmarks || "",
    totalRooms: 1,
    availableBeds: 1,
    totalBeds: 1,
    description: formData?.description || "No description provided",
    price: `₹${formData?.monthlyPrice || 0}/month`,
    pricePerDay: formData?.pricePerDay || 0,
    weeklyPrice: formData?.weeklyPrice || 0,
    offer: formData?.offers ? parseInt(formData.offers) : 0,
    deposit: `₹${formData?.securityDeposit || 0}`,
    images: formData?.photos?.map((photo: any) => photo.uri) || [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
    ],
    amenities: Object.entries(formData?.amenities || {})
      .filter(([_, value]) => value)
      .map(([key]) => {
        const amenityMap: { [key: string]: string } = {
          wifi: "WiFi",
          meals: "Meals",
          security: "Security",
          studyHall: "Study Hall",
          commonTV: "Common TV",
          cctv: "CCTV",
          acRooms: "AC Rooms",
          laundry: "Laundry",
        };
        return amenityMap[key] || key;
      }),
    rulesAndPolicies: formData?.rulesText || "No rules specified",
    fullAddress: formData?.fullAddress || "No address provided",
    phoneNumber: formData?.phoneNumber || "Not provided",
    whatsappNumber: formData?.whatsappNumber || "Not provided",
  };

  // Handle Create Listing
  const handleCreateListing = async () => {
    try {
      setIsSubmitting(true);

      if (!formData) {
        Alert.alert("Error", "No data to submit");
        return;
      }

      // Transform form data to API format
      const apiData = {
        hostelName: formData.hostelName,
        hostelType:
          formData.hostelType === "boys"
            ? "Boys Hostel"
            : formData.hostelType === "girls"
            ? "Girls Hostel"
            : "Co-ed Hostel",
        description: formData.description,
        pricing: {
          type: "monthly",
          price: formData.monthlyPrice,
        },
        securityDeposit: formData.securityDeposit,
        offers: formData.offers,
        rooms: [
          {
            roomNumber: parseInt(formData.roomNo) || 101,
            numberOfBeds: 4, // Default value
            roomDetails: formData.roomDetails,
          },
        ],
        facilities: Object.entries(formData.amenities)
          .filter(([_, value]) => value)
          .map(([key]) => {
            const facilityMap: { [key: string]: string } = {
              wifi: "wifi",
              meals: "mess",
              security: "security",
              studyHall: "study hall",
              commonTV: "common tv",
              cctv: "cctv",
              acRooms: "ac rooms",
              laundry: "laundry",
            };
            return facilityMap[key] || key;
          }),
        location: {
          area: formData.area || "Didwana",
          nearbyLandmarks: formData.nearbyLandmarks,
          fullAddress: formData.fullAddress,
        },
        contactInfo: {
          phone: parseInt(formData.phoneNumber),
          whatsapp: parseInt(formData.whatsappNumber),
        },
        rulesAndPolicies: formData.rulesText,
        hostelPhotos: formData.photos,
        roomPhotos: formData.roomPhotos,
      };

      // Submit to API
      const response = await createHostelService(apiData);

      if (response.success) {
        // Clear the form data
        clearFormData();
        // Navigate to success page
        router.replace("/(secure)/(hostelService)/successful");
      } else {
        Alert.alert("Error", response.error || "Failed to create listing");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== IMAGE CAROUSEL SECTION ====================
  const renderImageCarousel = () => {
    const imageWidth = width - 32;
    const hasImages =
      data.images &&
      data.images.length > 0 &&
      data.images[0] !==
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500";

    if (!hasImages) {
      return (
        <View style={[styles.imageContainer, styles.noImageContainer]}>
          <Text style={styles.noImageText}>No Images Added</Text>
        </View>
      );
    }

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
        {data.images.length > 1 && (
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
        )}
      </View>
    );
  };

  // ==================== BASIC INFO SECTION ====================
  const renderBasicInfo = () => (
    <View style={styles.basicInfo}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{data.name}</Text>
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
        <Text style={styles.oldPrice}>₹{data.pricePerDay}/day</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.oldPrice}>₹{data.weeklyPrice}/week</Text>
      </View>
      <View style={styles.priceMainRow}>
        <Text style={styles.currentPrice}>{data.price}</Text>
        {data.offer > 0 && (
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
      {data.amenities?.length > 0 && (
        <View style={[styles.section, styles.facilitiesSection]}>
          <Text style={styles.sectionTitle}>Facilities & Amenities</Text>
          <View style={styles.facilitiesContainer}>
            <View style={styles.facilitiesGrid}>
              {data.amenities?.map((amenity: any, index: number) => {
                const iconName = AMENITY_ICONS[amenity] || DEFAULT_AMENITY_ICON;

                return (
                  <View key={index} style={styles.facilityItem}>
                    <Ionicons
                      name={iconName as any}
                      size={20}
                      color="#333"
                      style={styles.facilityIcon}
                    />
                    <Text style={styles.facilityText}>{amenity}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* Rules & Policies */}
      {data.rulesAndPolicies &&
        data.rulesAndPolicies !== "No rules specified" && (
          <View style={[styles.section, styles.rulesSection]}>
            <Text style={styles.sectionTitle}>Rules & Policies</Text>
            <View style={styles.rulesBox}>
              <Ionicons
                name="alert-circle"
                size={20}
                color="#FFA726"
                style={styles.rulesIcon}
              />
              <Text style={styles.rulesText}>{data.rulesAndPolicies}</Text>
            </View>
          </View>
        )}

      {/* Location */}
      <View style={[styles.section, styles.locationSection]}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={[styles.locationBox, { marginTop: 12 }]}>
          <Text style={styles.locationTitle}>
            {data.sublocation || "Near Medical College"}
          </Text>
          <Text style={styles.locationAddress}>{data.fullAddress}</Text>
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
          <Text style={styles.infoValue}>{data.phoneNumber}</Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color="#0A051F"
          />
          <Text style={styles.infoValue}>{data.whatsappNumber}</Text>
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
          title={
            isSubmitting || isLoading
              ? "Creating Listing..."
              : "+ Create Hostel Listing"
          }
          onPress={handleCreateListing}
          disabled={isSubmitting || isLoading}
        />
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.back()}
        disabled={isSubmitting || isLoading}
      >
        <Text style={styles.editButtonText}>← Back to Edit</Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 12,
          fontFamily: fonts.interRegular,
          color: "#666",
          textAlign: "center",
          marginTop: 8,
          marginBottom: 20,
        }}
      >
        Your listing will be reviewed and approved within 24 hours
      </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  rulesText: {
    fontSize: 12,
    color: "#DE9809",
    flex: 1,
    fontFamily: fonts.interMedium,
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
  editButton: {
    padding: 16,
    alignItems: "center",
  },
  editButtonText: {
    color: "#FF6B35",
    fontSize: 14,
    fontFamily: fonts.interMedium,
  },
});
