import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { HostelService } from "../types/hostel";

interface HostelCardProps {
  hostel: HostelService;
  onPress?: () => void;
  onBookPress?: () => void;
  onEditPress?: () => void;
}

const amenityIcons: { [key: string]: string } = {
  wifi: "wifi",
  mess: "restaurant",
  meals: "restaurant",
  security: "shield-checkmark",
  studyhall: "book",
  commontv: "tv",
  cctv: "videocam",
  acrooms: "snow",
  laundry: "shirt",
};

export default function HostelCard({
  hostel,
  onPress,
  onBookPress,
  onEditPress,
}: HostelCardProps) {
  const handleView = () => {
    router.push({
      pathname: "/hostelDetails",
      params: { id: hostel._id },
    });
  };

  const handleViewRooms = () => {
    if (hostel.rooms && hostel.rooms.length > 0 && hostel.rooms[0]._id) {
      router.push({
        pathname: "/viewroom",
        params: { roomId: hostel.rooms[0]._id },
      });
    } else {
      Alert.alert("No Rooms", "No rooms available for this hostel");
    }
  };

  const handleViewReviews = () => {
    router.push({
      pathname: "/review",
      params: { hostelId: hostel._id },
    });
  };

  // Get primary pricing with priority: monthly > weekly > perDay
  const getPrimaryPricing = () => {
    const pricing = hostel.pricing;

    if (pricing.monthly && pricing.monthly > 0) {
      return {
        price: pricing.monthly,
        label: "/month",
      };
    } else if (pricing.weekly && pricing.weekly > 0) {
      return {
        price: pricing.weekly,
        label: "/week",
      };
    } else if (pricing.perDay && pricing.perDay > 0) {
      return {
        price: pricing.perDay,
        label: "/day",
      };
    }

    return { price: 0, label: "/day" };
  };

  const primaryPricing = getPrimaryPricing();

  return (
    <TouchableOpacity
      style={styles.hostelCard}
      onPress={onPress || handleView}
      activeOpacity={0.7}
    >
      <Animated.View style={styles.cardContent} sharedTransitionTag="sharedTag">
        {/* Left side - Image */}
        <Image
          source={
            hostel.hostelPhotos && hostel.hostelPhotos.length > 0
              ? { uri: hostel.hostelPhotos[0] }
              : Images.hostel1
          }
          style={styles.hostelImage}
        />

        {/* Right side - Content */}
        <View style={styles.hostelInfo}>
          {/* Title and Rating Row */}
          <View style={styles.headerRow}>
            <Text style={styles.hostelName} numberOfLines={1}>
              {hostel.hostelName}
            </Text>
          </View>

          <Text style={styles.subLocation} numberOfLines={1}>
            {hostel.location.nearbyLandmarks || hostel.location.area}
          </Text>

          <View style={styles.amenitiesRow}>
            {hostel?.facilities
              ?.slice(0, 4)
              ?.map((amenity: any, idx: number) => {
                const label =
                  typeof amenity === "string" ? amenity : String(amenity ?? "");
                const key = label.replace(/\s+/g, "").toLowerCase();
                const iconName =
                  (amenityIcons[key] as any) || "checkmark-circle";
                return (
                  <View key={`${key}-${idx}`} style={styles.amenityItem}>
                    <Ionicons name={iconName} size={13} color="#6B7280" />
                    <Text style={styles.amenityText} numberOfLines={1}>
                      {label}
                    </Text>
                  </View>
                );
              })}
          </View>

          {/* Fixed Row Section */}
          <View style={styles.rowBetween}>
            <View style={styles.infoBlock}>
              <Text style={styles.price}>
                ₹{primaryPricing.price}
                <Text style={styles.deposit}>{primaryPricing.label}</Text>
              </Text>
              <Text style={styles.deposit}>Rent</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.booking}>
                {hostel.availability.availabilityString}
              </Text>
              <Text style={styles.deposit}>Available</Text>
            </View>

            <View style={styles.infoBlock}>
              <View style={styles.ratingRow}>
                <Image source={Images.star} style={styles.starIcon} />
                <Text style={styles.rating}>
                  {hostel.overallRating.toFixed(1)}{" "}
                  <Text style={styles.review}>({hostel.totalReviews})</Text>
                </Text>
              </View>
              <Text style={styles.deposit}>Rating</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.type} numberOfLines={1}>
                {hostel.hostelType}
              </Text>
              <Text style={styles.deposit}>Type</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={handleView}>
              <Image source={Images.view} style={styles.btnIcon} />
              <Text style={styles.btnText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onEditPress}>
              <Image source={Images.edit} style={styles.btnIcon} />
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={handleViewRooms}>
              <Image source={Images.view} style={styles.btnIcon} />
              <Text style={styles.btnText}>View Rooms</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleViewReviews}>
              <Image source={Images.star} style={styles.btnIcon} />
              <Text style={styles.btnText}>View Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hostelCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginTop: 16,
  },
  cardContent: {
    flexDirection: "row",
    padding: 12,
  },
  hostelImage: {
    width: 82,
    height: 82,
    borderRadius: 12,
    marginRight: 12,
  },
  hostelInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  hostelName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 8,
    fontFamily: fonts.interSemibold,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: fonts.interSemibold,
  },
  subLocation: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
    fontFamily: fonts.interRegular,
  },
  amenitiesRow: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    borderRadius: 12,
    padding: 3,
    margin: 2,
  },
  amenityText: {
    fontSize: 8,
    fontFamily: fonts.interRegular,
    color: Colors.title,
  },
  deposit: {
    fontSize: 10,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  infoBlock: {
    flex: 1,
  },
  price: {
    fontFamily: fonts.interSemibold,
    fontSize: 12,
    color: Colors.primary,
  },
  booking: {
    fontSize: 12,
    color: Colors.title,
    textAlign: "left",
    fontFamily: fonts.interSemibold,
  },
  review: {
    fontSize: 12,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
  },
  type: {
    fontSize: 12,
    color: Colors.title,
    textAlign: "left",
    fontFamily: fonts.interSemibold,
  },
  starIcon: {
    height: 14,
    width: 14,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  actions: {
    flexDirection: "row",
    marginTop: 7,
    gap: 7,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    borderRadius: 6,
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 2,
    width: "50%",
  },
  btnIcon: {
    height: 16,
    width: 16,
  },
  btnText: {
    fontSize: 10,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
  },
});
