import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RoomDetail {
  roomNumber: string;
  bedNumbers: number[];
}

interface Duration {
  checkInDate: string;
  checkOutDate: string;
}

interface CustomerData {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  phoneNumber: string;
  planPurchased: string[];
  roomDetails: RoomDetail[];
  duration: Duration;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: CustomerData;
}

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

const MyProfileScreen = () => {
  const { customerId } = useLocalSearchParams();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Replace with your actual API base URL
      const response = await fetch(
        `YOUR_BASE_URL/api/hostelOwner/customer/getCustomerById/${customerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authentication token if required
            // "Authorization": `Bearer ${token}`,
          },
        }
      );

      const result: ApiResponse = await response.json();

      if (result.success) {
        setCustomerData(result.data);
      } else {
        setError(result.message || "Failed to fetch customer data");
      }
    } catch (err) {
      console.error("Error fetching customer data:", err);
      setError("Failed to load customer information");
    } finally {
      setLoading(false);
    }
  };

  const formatPlanPurchased = () => {
    if (
      !customerData?.planPurchased ||
      customerData.planPurchased.length === 0
    ) {
      return "No plan purchased";
    }
    return customerData.planPurchased
      .map((plan) => plan.charAt(0).toUpperCase() + plan.slice(1))
      .join(", ");
  };

  const formatRoomDetails = () => {
    if (!customerData?.roomDetails || customerData.roomDetails.length === 0) {
      return "Not assigned";
    }
    return customerData.roomDetails
      .map(
        (room) => `Room ${room.roomNumber} - Bed ${room.bedNumbers.join(", ")}`
      )
      .join("\n");
  };

  const formatDuration = () => {
    if (!customerData?.duration) {
      return "Not available";
    }
    return `${customerData.duration.checkInDate} to ${customerData.duration.checkOutDate}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading customer details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !customerData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Customer not found"}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchCustomerData}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Image
            source={
              customerData.profileImage &&
              customerData.profileImage !== "Not provided"
                ? { uri: customerData.profileImage }
                : Images.user
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{customerData.name}</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow
            icon={Images.email1}
            label="Email"
            value={
              customerData.email !== "Not provided"
                ? customerData.email
                : "Email not provided"
            }
          />
          <InfoRow
            icon={Images.phone}
            label="Phone Number"
            value={customerData.phoneNumber || "Not provided"}
          />
          <InfoRow
            icon={Images.bank}
            label="Plan Purchased"
            value={formatPlanPurchased()}
          />
          <InfoRow
            icon={Images.name}
            label="Room Details"
            value={formatRoomDetails()}
          />
          <InfoRow
            icon={Images.name}
            label="Duration"
            value={formatDuration()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.interMedium,
    color: Colors.red,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: fonts.interSemibold,
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
    backgroundColor: Colors.lightGrey,
  },
  profileName: {
    fontSize: 18,
    fontFamily: fonts.interSemibold,
    marginTop: 12,
  },
  infoCard: {
    backgroundColor: "#F8F5FF",
    marginHorizontal: 26,
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
