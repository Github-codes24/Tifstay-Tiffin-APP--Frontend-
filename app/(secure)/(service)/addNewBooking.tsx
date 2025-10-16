// screens/BasicInfoForm.tsx
import BookingCard from "@/components/BookingCard";
import CommonButton from "@/components/CommonButton";
import CommonHeader from "@/components/CommonHeader";
import CustomSwitch from "@/components/CommonSwitch";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const BasicInfoForm = () => {
  const { booking }: any = useLocalSearchParams();
  const [description, setDescription] = useState("");
  const [isBreakfastDone, setIsBreakfastDone] = useState(false);
  const [isLunchDone, setIsLunchDone] = useState(false);
  const [isDinnerDone, setIsDinnerDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const bookingData = booking ? JSON.parse(booking) : null;
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // API call function
  const handleSave = async () => {
    if (!bookingData?.bookingId) {
      Alert.alert("Error", "Booking ID not found");
      return;
    }

    // Validation: Check if reason is provided when any meal is not done
    if (
      (!isBreakfastDone || !isLunchDone || !isDinnerDone) &&
      !description.trim()
    ) {
      Alert.alert(
        "Required",
        "Please provide a reason for meals not delivered"
      );
      return;
    }

    setLoading(true);

    const payload: any = {
      date: getTodayDate(),
      isBeakfastDone: isBreakfastDone,
      isLunchDone: isLunchDone,
      isDinnerDone: isDinnerDone,
      reasonOfDinnerNotDone: description.trim(),
    };
    const token = useAuthStore.getState().token;
    try {
      const response = await fetch(
        `https://tifstay-project-be.onrender.com/api/tiffinOrderSummary/createOrAddTiffinOrderSummary/${bookingData.orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Order summary saved successfully", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to save order summary");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <CommonHeader title="Order Details" />
      </SafeAreaView>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <>
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
          <View
            style={{
              borderColor: "grey",
              borderWidth: 0.5,
              padding: 16,
              borderRadius: 12,
            }}
          >
            <Text style={styles.heading}>{"Today's Order Summary"}</Text>

            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.subLabel}>Breakfast</Text>
              </View>
              <CustomSwitch
                value={isBreakfastDone}
                onValueChange={setIsBreakfastDone}
              />
            </View>

            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.subLabel}>Lunch</Text>
              </View>
              <CustomSwitch
                value={isLunchDone}
                onValueChange={setIsLunchDone}
              />
            </View>

            <LabeledInput
              label="Reason"
              placeholder="Enter a reason for not delivered"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              labelStyle={styles.inputLabel}
              inputContainerStyle={styles.textArea}
              containerStyle={styles.descContainer}
              inputStyle={styles.textAreaInput}
            />

            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.subLabel}>Dinner</Text>
              </View>
              <CustomSwitch
                value={isDinnerDone}
                onValueChange={setIsDinnerDone}
              />
            </View>

            <CommonButton
              title={loading ? "Saving..." : "Save"}
              buttonStyle={{ marginTop: 16 }}
              onPress={handleSave}
              disabled={loading}
            />
          </View>

          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 20 }}
            onPress={() =>
              router.push({
                pathname: "/(secure)/orderDetails",
                params: { booking: JSON.stringify(bookingData) },
              })
            }
          >
            <Text style={{ color: "#004AAD", fontWeight: "600" }}>
              See Full Month Order Summary
            </Text>
          </TouchableOpacity>
        </>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default BasicInfoForm;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16, marginBottom: 100, backgroundColor: Colors.white },
  card: {
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  heading: { fontSize: 16, fontFamily: fonts.interSemibold },
  cardHeading: { paddingHorizontal: 15, marginTop: 10 },
  label: { color: Colors.title, fontSize: 14, fontFamily: fonts.interRegular },
  inputBox: { backgroundColor: Colors.white, borderColor: Colors.lightGrey },
  textArea: { minHeight: 70, backgroundColor: "white" },
  descContainer: {
    marginTop: 20,
    paddingHorizontal: 0,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 0,
    fontFamily: fonts.interRegular,
    color: Colors.title,
    marginTop: 14,
  },
  subLabel: {
    marginTop: 14,
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.title,
    marginBottom: 5,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 20 },
  checkboxSpacing: { marginTop: 14 },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  outerCircle: {
    width: 15,
    height: 15,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#1E40AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  outerCircleSelected: { borderColor: "#1E40AF" },
  innerCircle: {
    width: 9,
    height: 9,
    borderRadius: 6,
    backgroundColor: "#1E40AF",
  },
  radioLabel: { fontSize: 16, color: "#222" },
  includeBox: { minHeight: 64 },
  includeContainer: { marginBottom: 20, paddingHorizontal: 0, marginTop: 20 },
  includeInput: { minHeight: 50 },
  innerCard: {
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    margin: 8,
    padding: 8,
    borderRadius: 12,
  },
  addMore: {
    textAlign: "center",
    color: Colors.orange,
    fontFamily: fonts.interBold,
    fontSize: 14,
    paddingVertical: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  inputLabel: {
    color: "#374151",
    fontSize: 14,
    fontFamily: fonts.interMedium,
    backgroundColor: "white",
    marginBottom: 8,
  },
  inputContainer: {
    marginTop: 12,
    paddingHorizontal: 0,
    backgroundColor: "white",
  },
  textAreaInput: {
    textAlignVertical: "top",
    fontSize: 13,
    lineHeight: 20,
    backgroundColor: "white",
  },
});
