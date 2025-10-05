import CommonButton from "@/components/CommonButton";
import CommonDropdown from "@/components/CommonDropDown";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import StepperInput from "@/components/SteperInput";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import useServiceStore from "@/store/serviceStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RoomData {
  id: string;
  roomNo: string;
  noOfBeds: number;
  roomDetails: string;
  roomPhotos: any[];
}

const AddNewHostelService = () => {
  const router = useRouter();
  const { setFormPage1Data, clearFormData } = useServiceStore();

  // Form states
  const [hostelName, setHostelName] = useState("");
  const [description, setDescription] = useState("");
  const [hostelType, setHostelType] = useState<string | null>("boys");
  const [pricePerDay, setPricePerDay] = useState(0);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [weeklyPrice, setWeeklyPrice] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [offers, setOffers] = useState("");
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

  // Multiple rooms state
  const [rooms, setRooms] = useState<RoomData[]>([
    {
      id: "1",
      roomNo: "",
      noOfBeds: 0,
      roomDetails: "",
      roomPhotos: [],
    },
  ]);
  const [activeRoomId, setActiveRoomId] = useState<string>("1");

  const pickRoomImage = async (roomId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: `room_photo_${Date.now()}.jpg`,
        };

        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === roomId
              ? { ...room, roomPhotos: [...room.roomPhotos, newPhoto] }
              : room
          )
        );
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeRoomPhoto = (roomId: string, photoIndex: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              roomPhotos: room.roomPhotos.filter((_, i) => i !== photoIndex),
            }
          : room
      )
    );
  };

  const addMoreRoom = () => {
    const newRoomId = Date.now().toString();
    const newRoom: RoomData = {
      id: newRoomId,
      roomNo: "",
      noOfBeds: 0,
      roomDetails: "",
      roomPhotos: [],
    };
    setRooms([...rooms, newRoom]);
    setActiveRoomId(newRoomId);
  };

  const deleteRoom = (roomId: string) => {
    if (rooms.length === 1) {
      Alert.alert("Error", "You must have at least one room");
      return;
    }

    Alert.alert("Delete Room", "Are you sure you want to delete this room?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const newRooms = rooms.filter((room) => room.id !== roomId);
          setRooms(newRooms);
          if (activeRoomId === roomId) {
            setActiveRoomId(newRooms[0].id);
          }
        },
      },
    ]);
  };

  const updateRoomField = (
    roomId: string,
    field: keyof RoomData,
    value: any
  ) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, [field]: value } : room
      )
    );
  };

  const handleNext = () => {
    // Validation
    if (!hostelName.trim()) {
      Alert.alert("Error", "Please enter hostel name");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter description");
      return;
    }
    if (!hostelType) {
      Alert.alert("Error", "Please select hostel type");
      return;
    }
    if (monthlyPrice === 0) {
      Alert.alert("Error", "Please enter monthly price");
      return;
    }

    // Validate rooms
    for (const room of rooms) {
      if (!room.roomNo.trim()) {
        Alert.alert("Error", "Please enter room number for all rooms");
        return;
      }
      if (room.noOfBeds === 0) {
        Alert.alert("Error", "Please enter number of beds for all rooms");
        return;
      }
    }

    // Combine all room photos
    const allRoomPhotos = rooms.flatMap((room) => room.roomPhotos);

    setFormPage1Data({
      hostelName,
      description,
      hostelType: hostelType as string,
      pricePerDay,
      monthlyPrice,
      weeklyPrice,
      securityDeposit,
      offers,
      amenities,
      roomPhotos: allRoomPhotos,
      rooms: rooms.map((room) => ({
        roomNo: room.roomNo,
        noOfBeds: room.noOfBeds,
        roomDetails: room.roomDetails,
        roomPhotos: room.roomPhotos,
      })),
    });
    router.push("/(secure)/(hostelService)/addNewHostelService1");
  };

  const resetForm = () => {
    setHostelName("");
    setDescription("");
    setHostelType("boys");
    setPricePerDay(0);
    setMonthlyPrice(0);
    setWeeklyPrice(0);
    setSecurityDeposit(0);
    setOffers("");
    setRooms([
      {
        id: "1",
        roomNo: "",
        noOfBeds: 0,
        roomDetails: "",
        roomPhotos: [],
      },
    ]);
    setActiveRoomId("1");
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
    clearFormData();
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

  const renderRoomCard = (room: RoomData, index: number) => {
    const isActive = activeRoomId === room.id;

    return (
      <View key={room.id} style={styles.roomCard}>
        {/* Room Header */}
        <TouchableOpacity
          style={styles.roomHeader}
          onPress={() => setActiveRoomId(isActive ? "" : room.id)}
          activeOpacity={0.7}
        >
          <View style={styles.roomHeaderLeft}>
            <Ionicons name="bed-outline" size={20} color="#374151" />
            <Text style={styles.roomHeaderText}>
              {room.roomNo
                ? `Room ${room.roomNo}`
                : `Room ${index + 1} (Not Set)`}
            </Text>
          </View>
          <View style={styles.roomHeaderRight}>
            {rooms.length > 1 && (
              <TouchableOpacity
                onPress={() => deleteRoom(room.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
            <Ionicons
              name={isActive ? "chevron-up" : "chevron-down"}
              size={20}
              color="#6B7280"
            />
          </View>
        </TouchableOpacity>

        {/* Room Content - Only show when active */}
        {isActive && (
          <View style={styles.roomContent}>
            {/* Photos Section */}
            <View style={styles.photosSection}>
              <View style={styles.photosContainer}>
                <Ionicons name="camera-outline" size={20} color="#6B7280" />
                <Text style={styles.photosLabel}>Photos</Text>
              </View>

              {room.roomPhotos.length > 0 && (
                <View style={styles.photosGrid}>
                  {room.roomPhotos.map((photo, photoIndex) => (
                    <View key={photoIndex} style={styles.photoContainer}>
                      <Image
                        source={{ uri: photo.uri }}
                        style={styles.photoPreview}
                      />
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => removeRoomPhoto(room.id, photoIndex)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {room.roomPhotos.length < 5 && (
                <>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => pickRoomImage(room.id)}
                  >
                    <Text style={styles.uploadText}>Upload photo</Text>
                    <Text style={styles.uploadSubtext}>
                      Upload clear photo of Room
                    </Text>
                  </TouchableOpacity>

                  {room.roomPhotos.length > 0 && (
                    <TouchableOpacity
                      style={styles.addMorePhotos}
                      onPress={() => pickRoomImage(room.id)}
                    >
                      <Text style={styles.addMorePhotosText}>
                        + Add More Image
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>

            {/* Room Details */}
            <View style={styles.roomDetailsRow}>
              <View style={styles.roomNoContainer}>
                <Text style={styles.inputLabel}>Room No</Text>
                <View style={styles.roomNoInput}>
                  <LabeledInput
                    placeholder="101"
                    value={room.roomNo}
                    onChangeText={(text) =>
                      updateRoomField(room.id, "roomNo", text)
                    }
                    inputContainerStyle={styles.roomNoInputBox}
                    containerStyle={styles.noPadding}
                  />
                </View>
              </View>

              <View style={styles.bedsContainer}>
                <StepperInput
                  label="No of Beds"
                  value={room.noOfBeds}
                  onChange={(value) =>
                    updateRoomField(room.id, "noOfBeds", value)
                  }
                  step={1}
                  min={1}
                  max={100}
                />
              </View>
            </View>

            {/* Room Details TextArea */}
            <LabeledInput
              label="Room Details"
              placeholder="Enter room details"
              value={room.roomDetails}
              onChangeText={(text) =>
                updateRoomField(room.id, "roomDetails", text)
              }
              multiline
              textAlignVertical="top"
              labelStyle={styles.inputLabel}
              inputContainerStyle={styles.textArea}
              containerStyle={styles.roomDetailsInput}
              inputStyle={styles.textAreaInput}
            />
          </View>
        )}
      </View>
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
          <View style={styles.card}>
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
              max={50000}
            />
            <StepperInput
              label="Weekly Price (₹)*"
              value={weeklyPrice}
              onChange={setWeeklyPrice}
              step={1}
              min={50}
              max={50000}
            />
          </View>

          <View style={styles.pricingRow}>
            <StepperInput
              label="Monthly Price (₹)*"
              value={monthlyPrice}
              onChange={setMonthlyPrice}
              step={1}
              min={50}
              max={50000}
            />
            <StepperInput
              label="Security Deposit (₹)*"
              value={securityDeposit}
              onChange={setSecurityDeposit}
              step={1}
              min={50}
              max={50000}
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
        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="bed-outline" size={20} color="#374151" />
            <Text style={[styles.sectionHeader, styles.marginLeft8]}>
              Rooms & Bed
            </Text>
            <View style={styles.roomBadge}>
              <Text style={styles.roomBadgeText}>{rooms.length}</Text>
            </View>
          </View>

          {/* Render all rooms */}
          {rooms.map((room, index) => renderRoomCard(room, index))}

          {/* Add More Room Button */}
          <TouchableOpacity
            style={styles.addMoreRoomButton}
            onPress={addMoreRoom}
          >
            <Text style={styles.addMoreRoomText}>+ Add More Room</Text>
          </TouchableOpacity>
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
          onPress={handleNext}
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
  infoBox: {
    borderRadius: 12,
    backgroundColor: Colors.white,
    paddingBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: "#A5A5A5",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  marginLeft8: { marginLeft: 8 },
  marginTop16: { marginTop: 16 },
  noHorizontalPadding: { paddingHorizontal: 0 },
  paddingHorizontal14: { paddingHorizontal: 14 },
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
    borderColor: "#A5A5A5",
    borderWidth: 0.5,
    borderRadius: 8,
  },
  descContainer: {
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  textAreaInput: { minHeight: 80, textAlignVertical: "top" },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  offersContainer: { marginTop: 4, paddingHorizontal: 14 },

  // Room Card Styles
  roomBadge: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: "auto",
  },
  roomBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: fonts.interSemibold,
  },
  roomCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  roomHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  roomHeaderText: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: "#111827",
  },
  roomHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  roomContent: {
    padding: 16,
  },
  photosSection: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  photosContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  photosLabel: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: "#374151",
    marginLeft: 8,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  photoContainer: {
    position: "relative",
    width: 80,
    height: 80,
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
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
  roomDetailsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  roomNoContainer: {
    flex: 1,
  },
  bedsContainer: {
    flex: 1,
  },
  roomNoInput: {
    flex: 1,
  },
  roomNoInputBox: {
    backgroundColor: "#fff",
    borderColor: "#A5A5A5",
    borderWidth: 0.5,
    height: 48,
    borderRadius: 8,
  },
  noPadding: {
    paddingHorizontal: 0,
    marginTop: 0,
  },
  roomDetailsInput: {
    paddingHorizontal: 0,
  },
  addMoreRoomButton: {
    borderWidth: 1,
    borderColor: "#FF6B35",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#FFF5F0",
  },
  addMoreRoomText: {
    color: "#FF6B35",
    fontFamily: fonts.interSemibold,
    fontSize: 16,
  },

  // Amenities Styles
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    fontFamily: fonts.interRegular,
  },
  amenitiesGrid: { marginTop: 8 },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
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
  checkboxChecked: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  amenityIcon: { marginRight: 8 },
  amenityLabel: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
  },
  amenityLabelActive: { color: "#FF6B35" },
  amenityLabelInactive: { color: "#6B7280" },
  nextButton: { borderRadius: 8 },
});

export default AddNewHostelService;
