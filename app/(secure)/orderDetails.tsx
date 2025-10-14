import BookingCard from "@/components/BookingCard";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function OrderDetail() {
  const { booking }: any = useLocalSearchParams();
  const bookingData = booking ? JSON.parse(booking) : null;
  const [orderSummary, setOrderSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingData?.orderId) {
      fetchOrderSummary();
    }
  }, [bookingData?.orderId]);

  const fetchOrderSummary = async () => {
    const token = useAuthStore.getState().token;

    try {
      const response = await fetch(
        `https://tifstay-project-be.onrender.com/api/tiffinOrderSummary/getTiffinOrderSummary/${bookingData?.orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("API Result:", JSON.stringify(result, null, 2));

      if (response.ok && result.success && result.data?.summary) {
        setOrderSummary(result.data.summary);
      } else {
        Alert.alert("Error", result.message || "Failed to fetch order summary");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status: boolean | null) => {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        {status === true ? (
          <Ionicons name="checkmark" size={16} color="#1DB435" />
        ) : status === false ? (
          <Ionicons name="close" size={16} color="#E51A1A" />
        ) : (
          <Text style={{ color: Colors.grey }}>-</Text>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAwareScrollView
        style={styles.scene}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* Booking Info */}
        <BookingCard
          key={"9898"}
          bookingId={`#${bookingData.bookingId}`}
          orderedDate={bookingData.orderDate}
          tiffinService={bookingData.tiffinService}
          customer={bookingData.customer}
          startDate={bookingData.startDate}
          mealType={bookingData.mealType}
          plan={bookingData.plan}
          orderType={bookingData.orderType}
        />

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.header}>Full Month Order Summary</Text>

          {/* Loading State */}
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : orderSummary.length === 0 ? (
            <Text style={{ color: Colors.grey, textAlign: "center", marginTop: 10 }}>
              No summary available.
            </Text>
          ) : (
            <>
              {/* Table Header */}
              <View style={[styles.row, styles.tableHeader]}>
                <Text style={[styles.cell, styles.headerCell, { flex: 1.2 }]}>
                  Date
                </Text>
                <Text style={[styles.cell, styles.headerCell]}>Breakfast</Text>
                <Text style={[styles.cell, styles.headerCell]}>Lunch</Text>
                <Text style={[styles.cell, styles.headerCell]}>Dinner</Text>
              </View>

              {/* Table Rows */}
              {orderSummary.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={[styles.cell, { flex: 1.2 }]}>{item.date}</Text>
                  <View style={styles.cell}>
                    {renderStatus(item.isBreakfastDone)}
                  </View>
                  <View style={styles.cell}>
                    {renderStatus(item.isLunchDone)}
                  </View>
                  <View style={styles.cell}>
                    {renderStatus(item.isDinnerDone)}
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  section: {
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  header: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  tableHeader: {
    paddingBottom: 8,
    marginBottom: 8,
    // borderBottomWidth: 0.5,
    // borderBottomColor: Colors.lightGrey,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    textAlignVertical: "center",
  },
  headerCell: {
    fontFamily: fonts.interMedium,
    fontSize: 14,
    color: Colors.title,
  },
});
