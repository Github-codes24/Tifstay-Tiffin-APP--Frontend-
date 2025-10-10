import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CommonButton from "./CommonButton";

interface BookingCardProps {
  status?: string;
  bookingId: string;
  orderedDate: string;
  tiffinService: string;
  customer: string;
  startDate: string;
  mealType: string;
  plan: string;
  orderType: string;
  onPressUpdate?: () => void;
  isReq?: boolean;
  onReject?: () => void;
  onAccept?: () => void;
  statusText?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  status,
  bookingId,
  orderedDate,
  tiffinService,
  customer,
  startDate,
  mealType,
  plan,
  orderType,
  onPressUpdate,
  isReq,
  onReject,
  onAccept,
  statusText,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.bookingId}>Booking {bookingId}</Text>
        <Text
          style={{
            textAlign: "right",
            flex: 1,
            color: Colors.green,
            textDecorationLine: "underline",
          }}
        >
          {statusText}
        </Text>
      </View>
      <Text style={[styles.subText, { marginTop: 5 }]}>
        Ordered on {orderedDate}
      </Text>

      <View style={[styles.row, { marginTop: 17 }]}>
        <Text style={styles.label}>Tiffin Service:</Text>
        <Text style={styles.value}>{tiffinService}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Customer:</Text>
        <Text style={styles.value}>{customer}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Start Date:</Text>
        <Text style={styles.value}>{startDate}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Meal Type:</Text>
        <Text style={styles.value}>{mealType}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Plan:</Text>
        <Text style={styles.value}>{plan}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Order Type:</Text>
        <Text style={styles.value}>{orderType}</Text>
      </View>

      {isReq && onAccept && onReject ? (
        <View style={{ flexDirection: "row", gap: 16 }}>
          <CommonButton
            title="Reject"
            textStyle={{ color: Colors.primary }}
            buttonStyle={{
              marginTop: 20,
              flex: 1,
              backgroundColor: Colors.white,
              borderColor: Colors.primary,
              borderWidth: 1,
            }}
            onPress={onAccept}
          />
          <CommonButton
            title="Accept"
            buttonStyle={{ marginTop: 20, flex: 1 }}
            onPress={onReject}
          />
        </View>
      ) : (
        onPressUpdate && (
          <CommonButton
            title="Update Order Summary"
            buttonStyle={{ marginTop: 20 }}
            onPress={onPressUpdate}
          />
        )
      )}
    </View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 16,
    marginVertical: 12,
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
  },
  bookingId: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  subText: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    textAlign: "right",
  },
});
