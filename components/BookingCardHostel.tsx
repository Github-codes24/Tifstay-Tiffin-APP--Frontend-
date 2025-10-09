import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import CommonButton from "./CommonButton";

interface Room {
  roomNumber: string;
  bedNumbers: number[];
}

interface BookingCardHostelProps {
  status?: string;
  bookingId: string;
  orderedDate: string;
  tiffinService: string; // hostelName
  customer: string;
  startDate: string; // plan name
  mealType: string; // room numbers
  plan: string; // bed numbers
  orderType: string; // checkInDate
  checkOutDate?: string;
  rooms?: Room[];
  onPressUpdate?: () => void;
  isReq?: boolean;
  onReject?: () => void;
  onAccept?: () => void;
  statusText?: string;
  isProcessing?: boolean;
}

const BookingCardHostel: React.FC<BookingCardHostelProps> = ({
  status,
  bookingId,
  orderedDate,
  tiffinService,
  customer,
  startDate,
  mealType,
  plan,
  orderType,
  checkOutDate,
  rooms,
  onPressUpdate,
  isReq,
  onReject,
  onAccept,
  statusText,
  isProcessing = false,
}) => {
  // Function to get status badge
  const renderStatusBadge = () => {
    if (!statusText) return null;

    let badgeStyle = styles.badgeDefault;
    let textStyle = styles.badgeTextDefault;

    switch (statusText.toLowerCase()) {
      case "confirmed":
      case "accepted":
        badgeStyle = styles.badgePrimary;
        textStyle = styles.badgeTextPrimary;
        break;
      case "rejected":
      case "cancelled":
        badgeStyle = styles.badgeRed;
        textStyle = styles.badgeTextRed;
        break;
      case "pending":
        badgeStyle = styles.badgeOrange;
        textStyle = styles.badgeTextOrange;
        break;
      default:
        badgeStyle = styles.badgeDefault;
        textStyle = styles.badgeTextDefault;
    }

    return (
      <View style={badgeStyle}>
        <Text style={textStyle}>{statusText}</Text>
      </View>
    );
  };

  // Unified UI for all tabs
  return (
    <View style={styles.card}>
      {/* Status Badge */}
      {renderStatusBadge()}

      {/* Booking Header */}
      <Text style={styles.bookingIdLarge}>Booking {bookingId}</Text>
      <Text style={[styles.subText, { marginTop: 4, marginBottom: 16 }]}>
        Booked on {orderedDate}
      </Text>

      {/* Main Details */}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Hostel Booking :</Text>
        <Text style={styles.detailValue}>{tiffinService}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Customer :</Text>
        <Text style={styles.detailValue}>{customer}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Plan:</Text>
        <Text style={styles.detailValue}>{startDate}</Text>
      </View>

      {/* Room Details Boxes */}
      {rooms && rooms.length > 0 ? (
        rooms.map((room, index) => (
          <View key={index} style={styles.roomBox}>
            <View style={styles.roomDetailRow}>
              <Text style={styles.roomLabel}>Room No.</Text>
              <Text style={styles.roomValue}>{room.roomNumber}</Text>
            </View>
            <View style={styles.roomDetailRow}>
              <Text style={styles.roomLabel}>Bed No.</Text>
              <Text style={styles.roomValue}>{room.bedNumbers.join(", ")}</Text>
            </View>
            <View style={styles.roomDetailRow}>
              <Text style={styles.roomLabel}>Check-in Date</Text>
              <Text style={styles.roomValue}>{orderType}</Text>
            </View>
            <View style={styles.roomDetailRow}>
              <Text style={styles.roomLabel}>Check-out Date</Text>
              <Text style={styles.roomValue}>{checkOutDate || "N/A"}</Text>
            </View>
          </View>
        ))
      ) : (
        // Fallback if rooms array not available
        <View style={styles.roomBox}>
          <View style={styles.roomDetailRow}>
            <Text style={styles.roomLabel}>Room No.</Text>
            <Text style={styles.roomValue}>{mealType}</Text>
          </View>
          <View style={styles.roomDetailRow}>
            <Text style={styles.roomLabel}>Bed No.</Text>
            <Text style={styles.roomValue}>{plan}</Text>
          </View>
          <View style={styles.roomDetailRow}>
            <Text style={styles.roomLabel}>Check-in Date</Text>
            <Text style={styles.roomValue}>{orderType}</Text>
          </View>
          <View style={styles.roomDetailRow}>
            <Text style={styles.roomLabel}>Check-out Date</Text>
            <Text style={styles.roomValue}>{checkOutDate || "N/A"}</Text>
          </View>
        </View>
      )}

      {/* Action Buttons - Only for Request tab */}
      {isReq && onAccept && onReject && (
        <View style={styles.buttonContainer}>
          <CommonButton
            title="Reject"
            textStyle={{ color: Colors.primary }}
            buttonStyle={[
              styles.rejectButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={onReject}
            disabled={isProcessing}
          />
          <CommonButton
            title={isProcessing ? "Processing..." : "Accept"}
            buttonStyle={[
              styles.acceptButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={onAccept}
            disabled={isProcessing}
          />
        </View>
      )}

      {/* Loading Indicator */}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

export default BookingCardHostel;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingIdLarge: {
    fontSize: 18,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginTop: 12,
  },
  subText: {
    fontSize: 12,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    width: 140,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    textAlign: "right",
  },
  roomBox: {
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  roomDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  roomLabel: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  roomValue: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  acceptButton: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  // Status Badges
  badgePrimary: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#EBF5FF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  badgeTextPrimary: {
    fontFamily: fonts.interMedium,
    fontSize: 11,
    color: Colors.primary,
  },
  badgeRed: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#FFF0F0",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.red,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  badgeTextRed: {
    fontFamily: fonts.interMedium,
    fontSize: 11,
    color: Colors.red,
  },
  badgeOrange: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#FFFDF0",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.orange,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  badgeTextOrange: {
    fontFamily: fonts.interMedium,
    fontSize: 11,
    color: Colors.orange,
  },
  badgeDefault: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  badgeTextDefault: {
    fontFamily: fonts.interMedium,
    fontSize: 11,
    color: Colors.primary,
  },
});
