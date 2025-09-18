import CommonButton from "@/components/CommonButton";
import CommonDropdown from "@/components/CommonDropDown";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import StepperInput from "@/components/SteperInput";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddNewHostelService = () => {
  const router = useRouter();

  // Form states
  const [hostelName, setHostelName] = useState("");
  const [description, setDescription] = useState("");
  const [hostelType, setHostelType] = useState("boys");
  const [pricePerDay, setPricePerDay] = useState(0);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [weeklyPrice, setWeeklyPrice] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [offers, setOffers] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [monthlyDining, setMonthlyDining] = useState(0);
  const [roomDetails, setRoomDetails] = useState("");
  const [amenities, setAmenities] = useState({
    wifi: false,
    meals: false,
    security: false,
    studyHall: false,
    commonTV: false,
    cctv: false,
    acRooms: false,
    laundry: false,
  });

  const resetForm = () => {
    setHostelName("");
    setDescription("");
    setHostelType("boys");
    setPricePerDay(0);
    setMonthlyPrice(0);
    setWeeklyPrice(0);
    setSecurityDeposit(0);
    setOffers("");
    setRoomNo("");
    setMonthlyDining(0);
    setRoomDetails("");
    setAmenities({
      wifi: false,
      meals: false,
      security: false,
      studyHall: false,
      commonTV: false,
      cctv: false,
      acRooms: false,
      laundry: false,
    });
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) => ({
      ...prev,
      [amenity]: !prev[amenity as keyof typeof prev],
    }));
  };

  const renderAmenityCheckbox = (
    icon: string,
    label: string,
    amenityKey: string
  ) => {
    const isChecked = amenities[amenityKey as keyof typeof amenities];

    return (
      <TouchableOpacity
        style={styles.amenityItem}
        onPress={() => toggleAmenity(amenityKey)}
      >
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && (
            <Ionicons name="checkmark" size={14} color={Colors.white} />
          )}
        </View>

        <Ionicons
          name={icon as any}
          size={18}
          color={isChecked ? "#FF6B35" : "#6B7280"}
          style={styles.amenityIcon}
        />

        <Text
          style={[
            styles.amenityLabel,
            isChecked ? styles.amenityLabelActive : styles.amenityLabelInactive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerWrapper}>
          <CommonHeader
            title="Add New Hostel Service"
            actionText="Reset"
            onActionPress={resetForm}
          />
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information Section */}
        <View style={styles.infoBox}>
          <View style={[styles.card, styles.basicCard]}>
            <View style={styles.sectionHeaderContainer}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#374151"
              />
              <Text style={[styles.sectionHeader, styles.marginLeft8]}>
                Basic Information
              </Text>
            </View>

            <LabeledInput
              label="PG/Hostel Name *"
              placeholder="e.g., Scholars Den Boys Hostel"
              value={hostelName}
              onChangeText={setHostelName}
              labelStyle={styles.inputLabel}
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputBox}
            />

            <Text style={[styles.inputLabel, styles.marginTop16]}>
              Hostel Type *
            </Text>
            <CommonDropdown
              items={[
                { label: "Select Hostel Type", value: "" },
                { label: "Boys Hostel", value: "boys" },
                { label: "Girls Hostel", value: "girls" },
                { label: "Co-ed Hostel", value: "coed" },
              ]}
              value={hostelType}
              setValue={setHostelType}
              placeholder="Select Hostel Type"
            />

            <LabeledInput
              label="Description *"
              placeholder="Describe your hostel, amenities, and what makes it special..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              labelStyle={styles.inputLabel}
              inputContainerStyle={styles.textArea}
              containerStyle={styles.descContainer}
              inputStyle={styles.textAreaInput}
            />
          </View>
        </View>

        {/* Pricing Section */}
        <View style={[styles.card, styles.noHorizontalPadding]}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={[styles.sectionHeader, styles.paddingHorizontal14]}>
              ₹ Pricing
            </Text>
          </View>

          <View style={styles.pricingRow}>
            <StepperInput
              label="Price per Day (₹)*"
              value={pricePerDay}
              onChange={setPricePerDay}
              step={1}
              min={50}
              max={500}
            />
            <StepperInput
              label="Weekly Price (₹)*"
              value={weeklyPrice}
              onChange={setWeeklyPrice}
              step={1}
              min={50}
              max={500}
            />
          </View>

          <View style={styles.pricingRow}>
            <StepperInput
              label="Monthly Price (₹)*"
              value={monthlyPrice}
              onChange={setMonthlyPrice}
              step={1}
              min={50}
              max={500}
            />
            <StepperInput
              label="Security Deposit (₹)*"
              value={securityDeposit}
              onChange={setSecurityDeposit}
              step={1}
              min={50}
              max={500}
            />
          </View>

          <LabeledInput
            label="Offers (Optional)"
            placeholder="10% discount"
            value={offers}
            onChangeText={setOffers}
            labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputBox}
            containerStyle={styles.offersContainer}
          />
        </View>

        {/* Rooms & Bed Section */}
        <View style={[styles.card, styles.padding14]}>
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="bed-outline" size={20} color="#374151" />
            </View>
            <Text style={styles.sectionHeader}>Rooms & Bed</Text>
          </View>
          <View style={styles.subContainer}>
            <View style={styles.photosSection}>
              <View style={styles.photosContainer}>
                <Ionicons name="camera-outline" size={24} color="#6B7280" />
                <Text style={styles.photosLabel}>Photos</Text>
              </View>

              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadText}>Upload photo</Text>
                <Text style={styles.uploadSubtext}>
                  Upload clear photo of Room
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addMorePhotos}>
                <Text style={styles.addMorePhotosText}>+ Add More Image</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.roomDetailsRow}>
              <LabeledInput
                label="Room No"
                placeholder="101"
                value={roomNo}
                onChangeText={setRoomNo}
                labelStyle={styles.inputLabel}
                inputContainerStyle={styles.roomNoInput}
                containerStyle={styles.roomNoContainer}
              />
              <StepperInput
                label="Monthly for Dining (₹)"
                value={monthlyDining}
                onChange={setMonthlyDining}
                step={1}
                min={50}
                max={500}
              />
            </View>

            <LabeledInput
              label="Room Details"
              placeholder="Enter room details"
              value={roomDetails}
              onChangeText={setRoomDetails}
              multiline
              textAlignVertical="top"
              labelStyle={styles.inputLabel}
              inputContainerStyle={styles.textArea}
              containerStyle={styles.descContainer}
              inputStyle={styles.textAreaInput}
            />
          </View>
        </View>

        {/* Facilities & Amenities Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="star-outline" size={20} color="#374151" />
            <Text style={[styles.sectionHeader, styles.marginLeft8]}>
              Facilities & Amenities
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Select features that apply to your service
          </Text>

          <View style={styles.amenitiesGrid}>
            {renderAmenityCheckbox("wifi", "WiFi", "wifi")}
            {renderAmenityCheckbox("restaurant", "Meals", "meals")}
            {renderAmenityCheckbox("shield-checkmark", "Security", "security")}
            {renderAmenityCheckbox("book", "Study Hall", "studyHall")}
            {renderAmenityCheckbox("tv", "Common TV", "commonTV")}
            {renderAmenityCheckbox("videocam", "CCTV", "cctv")}
            {renderAmenityCheckbox("snow", "AC Rooms", "acRooms")}
            {renderAmenityCheckbox("shirt", "Laundry", "laundry")}
          </View>
        </View>

        <CommonButton
          title="Next"
          onPress={() => {
            router.push("/(hostelService)/addNewHostelService1");
          }}
          buttonStyle={styles.nextButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { backgroundColor: Colors.white },
  headerWrapper: { backgroundColor: Colors.white },
  container: { padding: 10, paddingBottom: 30, backgroundColor: Colors.white },
  infoBox: { borderRadius: 12, backgroundColor: Colors.white, paddingBottom: 20 },
  card: {
    borderWidth: 1,
    borderColor: "#A5A5A5",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginBottom: 20,
    backgroundColor: Colors.white,
    
  },
  basicCard: { paddingBottom:60 },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  marginLeft8: { marginLeft: 8 },
  marginTop16: { marginTop: 16 },
  padding14: { padding: 40 },
  noHorizontalPadding: { paddingHorizontal: 0 },
  paddingHorizontal14: { paddingHorizontal: 14 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: fonts.interBold,
    color: "#111827",
  },
  inputLabel: {
    color: "#374151",
    fontSize: 14,
    fontFamily: fonts.interMedium,
    marginBottom: 8,
  },
  inputContainer: { marginTop: 12, paddingHorizontal: 0 },
  inputBox: {
    backgroundColor: "#fff",
    borderColor: "#A5A5A5",
    borderWidth: 0.5,
    height: 48,
    borderRadius: 8,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
    backgroundColor: "#fff",
  },
  descContainer: {
    marginBottom: 10,
    paddingHorizontal: 0,
    borderColor: "#A5A5A5",
  },
  textAreaInput: { minHeight: 80, textAlignVertical: "top" },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  offersContainer: { marginTop: 4 },
  subContainer: {
    paddingBottom: 60,
    borderColor: "#A5A5A5",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  photosContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  photosSection: {
    marginBottom: 12,
    borderColor: "#A5A5A5",
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
  },
  photosLabel: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: "#374151",
    marginLeft: 8,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#A5A5A5",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  uploadText: {
    color: "#374151",
    fontFamily: fonts.interMedium,
    fontSize: 14,
  },
  uploadSubtext: {
    color: "#9CA3AF",
    fontFamily: fonts.interRegular,
    fontSize: 12,
    marginTop: 4,
  },
  addMorePhotos: { alignSelf: "center" },
  addMorePhotosText: {
    color: "#FF6B35",
    fontFamily: fonts.interSemibold,
    fontSize: 14,
  },
  roomDetailsRow: { flexDirection: "row", marginBottom: 12, gap: 8 },
  roomNoInput: {
    backgroundColor: "#fff",
    borderColor: "#A5A5A5",
    borderWidth: 0.5,
    height: 40,
    borderRadius: 8,
  },
  roomNoContainer: { flex: 1, paddingHorizontal: 0, borderColor: "#A5A5A5" },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    fontFamily: fonts.interRegular,
  },
  amenitiesGrid: { marginTop: 8 },
  amenityItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#A5A5A5",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginRight: 12,
  },
  checkboxChecked: { backgroundColor: "#FF6B35", borderColor: "#FF6B35" },
  amenityIcon: { marginRight: 8 },
  amenityLabel: { fontSize: 14, fontFamily: fonts.interRegular },
  amenityLabelActive: { color: "#FF6B35" },
  amenityLabelInactive: { color: "#6B7280" },
  nextButton: { borderRadius: 8 },
});

export default AddNewHostelService;