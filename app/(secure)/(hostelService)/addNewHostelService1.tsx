import CommonButton from "@/components/CommonButton";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import useServiceStore from "@/store/serviceStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

const MINIMUM_HOSTEL_PHOTOS = 3;
const MAXIMUM_HOSTEL_PHOTOS = 10;

const AddNewHostelService1 = () => {
  const router = useRouter();
  const {
    setFormPage2Data,
    formPage1Data,
    formPage2Data,
    createHostelService,
    updateHostelService,
    isLoading,
    clearFormData,
  } = useServiceStore();

  // ✅ Determine if we're in update mode
  const isUpdatingHostel = formPage1Data?.isUpdate || false;
  const hostelId = formPage1Data?.hostelId;

  const [rulesText, setRulesText] = useState("");
  const [area, setArea] = useState("");
  const [nearbyLandmarks, setNearbyLandmarks] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [photos, setPhotos] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Load existing data if in edit mode
  useEffect(() => {
    if (formPage2Data) {
      console.log("📥 Loading existing page 2 data");
      setRulesText(formPage2Data.rulesText || "");
      setArea(formPage2Data.area || "");
      setNearbyLandmarks(formPage2Data.nearbyLandmarks || "");
      setFullAddress(formPage2Data.fullAddress || "");
      setPhoneNumber(formPage2Data.phoneNumber || "");
      setWhatsappNumber(formPage2Data.whatsappNumber || "");

      // Load existing photos if available
      if (formPage2Data.photos && formPage2Data.photos.length > 0) {
        setPhotos(formPage2Data.photos);
      }
    }
  }, [formPage2Data]);

  // ✅ Validation function
  const validateForm = (): boolean => {
    // Phone Number
    if (!phoneNumber.trim()) {
      Alert.alert("Validation Error", "Please enter phone number");
      return false;
    }
    if (phoneNumber.length !== 10) {
      Alert.alert("Validation Error", "Phone number must be 10 digits");
      return false;
    }

    // WhatsApp Number
    if (!whatsappNumber.trim()) {
      Alert.alert("Validation Error", "Please enter WhatsApp number");
      return false;
    }
    if (whatsappNumber.length !== 10) {
      Alert.alert("Validation Error", "WhatsApp number must be 10 digits");
      return false;
    }

    // Full Address
    if (!fullAddress.trim()) {
      Alert.alert("Validation Error", "Please enter full address");
      return false;
    }
    if (fullAddress.trim().length < 10) {
      Alert.alert("Validation Error", "Address must be at least 10 characters");
      return false;
    }

    // Photos - Minimum 3 required for new hostels
    if (!isUpdatingHostel && photos.length < MINIMUM_HOSTEL_PHOTOS) {
      Alert.alert(
        "Validation Error",
        `Please upload at least ${MINIMUM_HOSTEL_PHOTOS} hostel photos. Currently ${photos.length} uploaded.`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      // Validate page 2 fields
      if (!validateForm()) return;

      // Check if we have page 1 data
      if (!formPage1Data) {
        Alert.alert(
          "Error",
          "Missing form data. Please go back and fill all required fields."
        );
        return;
      }

      setIsSubmitting(true);

      // Save page 2 data
      const page2Data = {
        rulesText,
        area: area || null,
        nearbyLandmarks,
        fullAddress,
        phoneNumber,
        whatsappNumber,
        photos,
      };
      setFormPage2Data(page2Data);

      // ✅ Prepare rooms data with proper handling for updates
      const roomsData = formPage1Data.rooms.map((room) => {
        const totalBeds = [];
        for (let i = 1; i <= room.noOfBeds; i++) {
          totalBeds.push({
            bedNumber: i,
          });
        }

        // ✅ For updates, include room _id if it exists
        const roomData: any = {
          roomNumber: parseInt(room.roomNo) || 101,
          totalBeds: totalBeds,
          roomDescription: room.roomDetails || "This is a hostel room",
          isNewRoom: room.isNewRoom !== false,
        };

        // ✅ Include _id for existing rooms
        if (room.roomId || room._id) {
          roomData._id = room.roomId || room._id;
          roomData.isNewRoom = false;
        }

        return roomData;
      });

      // ✅ Separate existing and new hostel photos
      const existingHostelPhotos = photos.filter((p: any) => p.isExisting);
      const newHostelPhotos = photos.filter((p: any) => !p.isExisting);

      // ✅ Transform complete form data to API format
      const apiData: any = {
        hostelName: formPage1Data.hostelName,
        hostelType:
          formPage1Data.hostelType === "boys"
            ? "Boys Hostel"
            : formPage1Data.hostelType === "girls"
            ? "Girls Hostel"
            : "Co-ed Hostel",
        description: formPage1Data.description,
        pricing: {
          perDay: formPage1Data.pricePerDay || 0,
          weekly: formPage1Data.weeklyPrice || 0,
          monthly: formPage1Data.monthlyPrice || 0,
        },
        securityDeposit: formPage1Data.securityDeposit || 0,
        offers: formPage1Data.offers || "",
        rooms: roomsData,
        facilities: Object.entries(formPage1Data.amenities)
          .filter(([_, value]) => value)
          .map(([key]) => {
            const facilityMap: { [key: string]: string } = {
              wifi: "WiFi",
              meals: "Mess",
              security: "Security",
              studyHall: "Study Hall",
              commonTV: "Common TV",
              cctv: "CCTV",
              acRooms: "AC Rooms",
              laundry: "Laundry",
            };
            return facilityMap[key] || key;
          }),
        location: {
          area: area || "Not specified",
          nearbyLandmarks: nearbyLandmarks || "Not specified",
          fullAddress: fullAddress,
        },
        contactInfo: {
          phone: parseInt(phoneNumber),
          whatsapp: parseInt(whatsappNumber),
        },
        rulesAndPolicies: rulesText || "Standard hostel rules apply",
        hostelPhotos:
          isUpdatingHostel && newHostelPhotos.length === 0
            ? [] // Don't send photos if updating and no new photos
            : newHostelPhotos.length > 0
            ? newHostelPhotos
            : photos, // For new hostels, send all photos
        roomsWithPhotos: formPage1Data.rooms.map((room) => ({
          roomNo: room.roomNo,
          noOfBeds: room.noOfBeds,
          roomDetails: room.roomDetails,
          roomPhotos:
            room.newPhotos || room.roomPhotos.filter((p: any) => !p.isExisting),
          _id: room.roomId || room._id,
          isNewRoom: room.isNewRoom !== false,
        })),
      };

      console.log("=== SUBMITTING DATA ===");
      console.log("Mode:", isUpdatingHostel ? "UPDATE" : "CREATE");
      console.log("Hostel ID:", hostelId);
      console.log("Total Rooms:", roomsData.length);
      console.log("Existing Hostel Photos:", existingHostelPhotos.length);
      console.log("New Hostel Photos:", newHostelPhotos.length);
      console.log("Rooms with Photos:", apiData.roomsWithPhotos.length);
      formPage1Data.rooms.forEach((room, index) => {
        const newPhotosCount =
          room.newPhotos?.length ||
          room.roomPhotos.filter((p: any) => !p.isExisting).length;
        const existingPhotosCount =
          room.existingPhotos?.length ||
          room.roomPhotos.filter((p: any) => p.isExisting).length;
        console.log(
          `Room ${index} (${room.roomNo}): ${existingPhotosCount} existing, ${newPhotosCount} new photos`
        );
      });

      // ✅ Submit to API (create or update)
      let response;
      if (isUpdatingHostel && hostelId) {
        console.log("🔄 Updating hostel service...");
        response = await updateHostelService(hostelId, apiData);
      } else {
        console.log("➕ Creating new hostel service...");
        response = await createHostelService(apiData);
      }

      if (response.success) {
        Alert.alert(
          "Success",
          isUpdatingHostel
            ? "Hostel service updated successfully!"
            : "Hostel service created successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                clearFormData();
                router.replace("/(secure)/(hostelService)/successful");
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", response.error || "Failed to submit listing");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      Alert.alert("Error", error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    Alert.alert("Reset Form", "Are you sure you want to reset all fields?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setRulesText("");
          setArea("");
          setNearbyLandmarks("");
          setFullAddress("");
          setPhoneNumber("");
          setWhatsappNumber("");
          setPhotos([]);
          clearFormData();
          router.back();
        },
      },
    ]);
  };

  const handlePreview = () => {
    setFormPage2Data({
      rulesText,
      area: area || null,
      nearbyLandmarks,
      fullAddress,
      phoneNumber,
      whatsappNumber,
      photos,
    });
    router.push("/(secure)/(hostelService)/previewServiceHostel");
  };

  const pickImage = async () => {
    try {
      if (photos.length >= MAXIMUM_HOSTEL_PHOTOS) {
        Alert.alert(
          "Maximum Photos Reached",
          `You can only upload up to ${MAXIMUM_HOSTEL_PHOTOS} hostel photos`
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: `hostel_photo_${Date.now()}.jpg`,
          isExisting: false, // ✅ Mark as new photo
        };
        setPhotos([...photos, newPhoto]);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <View style={{ backgroundColor: Colors.white }}>
          <CommonHeader
            title={
              isUpdatingHostel
                ? "Update Hostel Service"
                : "Add New Hostel Service"
            }
            actionText="Reset"
            onActionPress={resetForm}
          />
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Rules & Policies Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="document-text-outline" size={20} color="#374151" />
            <View>
              <Text style={styles.sectionHeader}>Rules & Policies</Text>
            </View>
          </View>
          <View>
            <LabeledInput
              label="Hostel Rules & Policies"
              placeholder="Mention important rules like visiting hours, noise policy, etc."
              value={rulesText}
              onChangeText={setRulesText}
              multiline
              textAlignVertical="top"
              labelStyle={styles.inputLabel}
              inputContainerStyle={{
                minHeight: 100,
                backgroundColor: "#fff",
                paddingTop: 12,
                paddingBottom: 12,
                borderColor: "#A5A5A5",
                borderWidth: 0.5,
                borderRadius: 8,
              }}
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{
                minHeight: 80,
                textAlignVertical: "top",
                fontSize: 13,
                lineHeight: 20,
              }}
            />
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="camera-outline" size={20} color="#374151" />
            <Text style={styles.sectionHeader}>
              Hostel Photos * (Min {MINIMUM_HOSTEL_PHOTOS})
            </Text>
            <View style={styles.photoCountBadge}>
              <Text style={styles.photoCountText}>
                {photos.length}/{MAXIMUM_HOSTEL_PHOTOS}
              </Text>
            </View>
          </View>

          {photos.length > 0 && (
            <View style={styles.photosGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.photoPreview}
                    resizeMode="cover"
                  />
                  {/* ✅ Show badge for existing photos */}
                  {photo.isExisting && (
                    <View style={styles.existingBadge}>
                      <Text style={styles.existingBadgeText}>Saved</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {photos.length < MAXIMUM_HOSTEL_PHOTOS && (
            <>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={32}
                  color="#6B7280"
                />
                <Text style={styles.uploadText}>Upload photo</Text>
                <Text style={styles.uploadSubtext}>
                  {photos.length === 0
                    ? `Upload at least ${MINIMUM_HOSTEL_PHOTOS} clear photos of your hostel`
                    : `${Math.max(
                        0,
                        MINIMUM_HOSTEL_PHOTOS - photos.length
                      )} more photo${
                        Math.max(0, MINIMUM_HOSTEL_PHOTOS - photos.length) !== 1
                          ? "s"
                          : ""
                      } needed`}
                </Text>
              </TouchableOpacity>

              {photos.length > 0 && photos.length < MAXIMUM_HOSTEL_PHOTOS && (
                <TouchableOpacity
                  style={styles.addMorePhotos}
                  onPress={pickImage}
                >
                  <Text style={styles.addMorePhotosText}>
                    + Add More Photo ({MAXIMUM_HOSTEL_PHOTOS - photos.length}{" "}
                    remaining)
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Location Details Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="location-outline" size={20} color="#374151" />
            <Text style={styles.sectionHeader}>Location Details</Text>
          </View>

          <LabeledInput
            label="Area/Locality"
            placeholder="e.g., Civil Lines, Sitabuldi..."
            value={area}
            onChangeText={setArea}
            labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputBox}
            containerStyle={styles.inputContainer}
          />

          <LabeledInput
            label="Nearby Landmarks"
            placeholder="e.g., Near VNIT, Medical College..."
            value={nearbyLandmarks}
            onChangeText={setNearbyLandmarks}
            labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputBox}
            containerStyle={styles.inputContainer}
          />

          <LabeledInput
            label="Full Address *"
            placeholder="Enter complete address with pincode"
            value={fullAddress}
            onChangeText={setFullAddress}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            labelStyle={styles.inputLabel}
            inputContainerStyle={{
              minHeight: 100,
              backgroundColor: "#fff",
              paddingTop: 12,
              paddingBottom: 12,
              borderColor: "#A5A5A5",
              borderWidth: 0.5,
              borderRadius: 8,
            }}
            containerStyle={{ paddingHorizontal: 0, marginTop: 12 }}
            inputStyle={{
              minHeight: 80,
              textAlignVertical: "top",
              fontSize: 13,
              lineHeight: 20,
            }}
          />
        </View>

        {/* Contact Information Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="call-outline" size={20} color="#374151" />
            <Text style={styles.sectionHeader}>Contact Information</Text>
          </View>

          <LabeledInput
            label="Phone Number *"
            placeholder="9876543210"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
            labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputBox}
            containerStyle={styles.inputContainer}
          />

          <LabeledInput
            label="WhatsApp Number *"
            placeholder="9876543210"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType="phone-pad"
            maxLength={10}
            labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputBox}
            containerStyle={styles.inputContainer}
          />
        </View>

        {/* Submit Button */}
        <CommonButton
          title={
            isSubmitting || isLoading
              ? isUpdatingHostel
                ? "Updating..."
                : "Submitting..."
              : isUpdatingHostel
              ? "Update Listing"
              : "Submit Listing"
          }
          onPress={handleSubmit}
          buttonStyle={
            isSubmitting || isLoading
              ? [styles.submitButton, { opacity: 0.7 }]
              : styles.submitButton
          }
          disabled={isSubmitting || isLoading}
        />

        {/* Preview Button */}
        <TouchableOpacity
          style={styles.previewButton}
          onPress={handlePreview}
          disabled={isSubmitting || isLoading}
        >
          <Ionicons name="eye-outline" size={20} color="#374151" />
          <Text style={styles.previewText}>Preview Listing</Text>
        </TouchableOpacity>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          {isUpdatingHostel
            ? "Your changes will be reviewed and updated within 24 hours"
            : "Your listing will be reviewed and approved within 24 hours"}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    padding: 16,
    paddingBottom: 30,
    backgroundColor: Colors.white,
  },
  card: {
    borderWidth: 1,
    borderColor: "#A5A5A5",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: fonts.interBold,
    color: "#111827",
    marginLeft: 8,
    flex: 1,
  },
  inputLabel: {
    color: "#374151",
    fontSize: 14,
    fontFamily: fonts.interMedium,
    marginBottom: 8,
  },
  inputContainer: {
    marginTop: 12,
    paddingHorizontal: 0,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderColor: "#A5A5A5",
    borderWidth: 0.5,
    height: 48,
    borderRadius: 8,
  },

  // Photo Styles
  photoCountBadge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: "auto",
  },
  photoCountText: {
    fontSize: 11,
    color: Colors.white,
    fontFamily: fonts.interSemibold,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  photoContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  existingBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(34, 197, 94, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  existingBadgeText: {
    fontSize: 9,
    color: Colors.white,
    fontFamily: fonts.interSemibold,
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
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  uploadText: {
    color: "#374151",
    fontFamily: fonts.interMedium,
    fontSize: 14,
    marginTop: 8,
  },
  uploadSubtext: {
    color: "#9CA3AF",
    fontFamily: fonts.interRegular,
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  addMorePhotos: {
    alignSelf: "center",
  },
  addMorePhotosText: {
    color: "#FF6B35",
    fontFamily: fonts.interSemibold,
    fontSize: 14,
  },

  // Button Styles
  submitButton: {
    borderRadius: 8,
    marginBottom: 16,
    paddingVertical: 16,
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    backgroundColor: Colors.white,
    gap: 8,
  },
  previewText: {
    color: "#374151",
    fontFamily: fonts.interMedium,
    fontSize: 16,
  },
  footerText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 12,
    fontFamily: fonts.interRegular,
    marginBottom: 20,
    lineHeight: 18,
  },
});

export default AddNewHostelService1;
