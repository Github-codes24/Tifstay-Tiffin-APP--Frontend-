import BookingCard from "@/components/BookingCard";
import CommonButton from "@/components/CommonButton";
import CustomSwitch from "@/components/CommonSwitch";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function OrderDetail() {
  const [reason, setReason] = useState("");
  const { isSubscriber } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Main content with keyboard aware scroll */}
      <KeyboardAwareScrollView
        style={styles.scene}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={20} // ensures input is fully visible
        keyboardShouldPersistTaps="handled"
      >
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

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Delivery status</Text>
            <CustomSwitch />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Delivery status</Text>
            <CustomSwitch />
          </View>

          {/* Reason Input */}
          <View style={styles.container}>
            <Text style={[styles.label, styles.reasonLabel]}>Reason</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a reason for not delivered"
              placeholderTextColor={Colors.grey}
              value={reason}
              onChangeText={setReason}
              multiline
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Delivery status</Text>
            <CustomSwitch />
          </View>

          <CommonButton title="Save" onPress={() => {}} />
        </View>
      </KeyboardAwareScrollView>

      {/* Floating bottom text (always fixed) */}
      {isSubscriber === "true" ? (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: Colors.primary,
              fontFamily: fonts.interBold,
              fontSize: 14,
            }}
          >
            See Full Month Order Summary
          </Text>
        </TouchableOpacity>
      ) : null}
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
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.title,
  },
  reasonLabel: {
    marginBottom: 8,
  },
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    fontFamily: fonts.interRegular,
    fontSize: 12,
    color: Colors.grey,
  },
});
