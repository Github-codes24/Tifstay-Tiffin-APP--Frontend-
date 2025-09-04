import BookingCard from "@/components/BookingCard";
import CommonButton from "@/components/CommonButton";
import CustomSwitch from "@/components/CommonSwitch";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

const orderSummary = [
  { date: "21/07/25", breakfast: true, lunch: false, dinner: false },
  { date: "22/07/25", breakfast: false, lunch: false, dinner: false },
  { date: "23/07/25", breakfast: false, lunch: false, dinner: false },
  { date: "24/07/25", breakfast: false, lunch: false, dinner: false },
  { date: "25/07/25", breakfast: false, lunch: false, dinner: false },
  { date: "26/07/25", breakfast: true, lunch: true, dinner: true },
  { date: "27/07/25", breakfast: true, lunch: true, dinner: true },
  { date: "29/07/25", breakfast: null, lunch: null, dinner: null },
  { date: "30/07/25", breakfast: null, lunch: null, dinner: null },
  { date: "31/07/25", breakfast: null, lunch: null, dinner: null },
];

export default function OrderDetail() {
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
          status="Accepted"
          bookingId="#TF2024002"
          orderedDate="21/07/2025"
          tiffinService="Maharashtrian Ghar Ka Khana"
          customer="Onil Karmokar"
          startDate="21/07/25"
          mealType="Breakfast, Lunch, Dinner"
          plan="Daily"
          orderType="Delivery"
        />

        {/* Order Summary Table */}
        <View style={styles.section}>
          <Text style={styles.header}>Full Month Order Summary</Text>

          {/* Table Header */}
          <View style={[styles.row, styles.tableHeader]}>
            <Text style={[styles.cell, styles.headerCell, { flex: 1.2 }]}>Date</Text>
            <Text style={[styles.cell, styles.headerCell]}>Breakfast</Text>
            <Text style={[styles.cell, styles.headerCell]}>Lunch</Text>
            <Text style={[styles.cell, styles.headerCell]}>Dinner</Text>
          </View>

          {/* Table Rows */}
          {orderSummary.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, { flex: 1.2 }]}>{item.date}</Text>
              <View style={[styles.cell]}>{renderStatus(item.breakfast)}</View>
              <View style={styles.cell}>{renderStatus(item.lunch)}</View>
              <View style={styles.cell}>{renderStatus(item.dinner)}</View>
            </View>
          ))}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

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
    fontFamily: fonts.interRegular,
    fontSize: 14,
    color: Colors.title,
  },
});
