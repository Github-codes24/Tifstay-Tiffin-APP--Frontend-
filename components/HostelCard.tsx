import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useServiceStore from "@/store/serviceStore";
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

interface HostelService {
  _id: string;
  hostelName: string;
  hostelType: string;
  description: string;
  pricing: {
    type: string;
    price: number;
  };
  securityDeposit: number;
  offers?: string;
  rooms: {
    _id?: string;
    roomNumber: number;
    numberOfBeds: number;
    roomDetails: string;
  }[];
  facilities: string[];
  location: {
    area: string;
    nearbyLandmarks: string;
    fullAddress: string;
  };
  contactInfo: {
    phone: number;
    whatsapp: number;
  };
  rulesAndPolicies: string;
  hostelPhotos?: string[];
}

interface HostelCardProps {
  hostel: HostelService;
  onPress?: () => void;
  onBookPress?: () => void;
}

const amenityIcons: { [key: string]: string } = {
  WiFi: "wifi",
  Mess: "restaurant",
  Security: "shield-checkmark",
  StudyHall: "book",
  CommonTV: "tv",
  CCTV: "videocam",
  ACRooms: "snow",
  Laundry: "shirt",
};

export default function HostelCard({
  hostel,
  onPress,
  onBookPress,
}: HostelCardProps) {
  const { deleteHostelService, isLoading } = useServiceStore();

  const handleView = () => {
    router.push({
      pathname: "/hostelDetails",
      params: { id: hostel._id },
    });
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    Alert.alert("Edit", "Edit functionality will be implemented soon");
  };

  const handleViewRooms = () => {
    router.push("/viewroom");
  };

  return (
    <TouchableOpacity
      style={styles.hostelCard}
      onPress={onPress}
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

          <Text style={styles.sublocation}>
            {hostel.location.nearbyLandmarks || hostel.location.area}
          </Text>

          <View style={styles.amenitiesRow}>
            {hostel?.facilities?.slice(0, 4)?.map((amenity: any) => (
              <View key={amenity} style={styles.amenityItem}>
                <Ionicons
                  name={
                    (amenityIcons[amenity.toLowerCase()] as any) ||
                    "checkmark-circle"
                  }
                  size={16}
                  color="#6B7280"
                />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>

          {/* Fixed Row Section */}
          <View style={[styles.rowBetween]}>
            <View style={styles.infoBlock}>
              <Text style={styles.price}>
                ₹{hostel.pricing.price.toFixed(2)}
                <Text style={styles.deposit}>/{hostel.pricing.type}</Text>
              </Text>
              <Text style={styles.deposit}>Rent</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.booking}>
                {hostel.rooms.length > 0 ? hostel.rooms[0].numberOfBeds : 0}
              </Text>
              <Text style={styles.deposit}>Available</Text>
            </View>

            <View style={styles.infoBlock}>
              <View style={styles.ratingRow}>
                <Image source={Images.star} style={styles.starIcon} />
                <Text style={styles.rating}>
                  4.7 <Text style={styles.review}>(8)</Text>
                </Text>
              </View>
              <Text style={styles.deposit}>Rating</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.type}>{hostel.hostelType}</Text>
              <Text style={styles.deposit}>Type</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={handleView}>
              <Image source={Images.view} style={styles.btnIcon} />
              <Text style={styles.btnText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Image source={Images.edit} style={styles.btnIcon} />
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.button, { width: "100%", marginTop: 16 }]}
            onPress={handleViewRooms}
          >
            <Image source={Images.view} style={styles.btnIcon} />
            <Text style={styles.btnText}> View Rooms</Text>
          </TouchableOpacity>
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
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  sublocation: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  amenitiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    marginBottom: 8,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderColor: "#9C9BA6",
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
    // flex: 1,
    // alignItems: "center",
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
    textAlign: "center",
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
    marginTop: 16,
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
  label: {
    fontSize: 10,
    fontFamily: fonts.interRegular,
  },
});
