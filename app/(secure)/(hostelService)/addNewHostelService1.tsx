import CommonButton from "@/components/CommonButton";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import { useHostel } from "@/context/HostelProvider";
import apiService from "@/services/hostelApiService";
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
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const AddNewHostelService1 = () => {
  const router = useRouter();
  const { setCreateHostelPage2Data, getCompleteHostelData, clearHostelData } =
    useHostel();

  const [rulesText, setRulesText] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationItems, setLocationItems] = useState([
    { label: "Select Area", value: undefined },
    { label: "Near VNIT, Medical College...", value: "vnit" },
    { label: "Near IIM, IT Park", value: "iim" },
    { label: "Near GMCH", value: "gmch" },
  ]);
  const [nearbyLandmarks, setNearbyLandmarks] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [photos, setPhotos] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!phoneNumber || !whatsappNumber || !fullAddress) {
        Alert.alert("Error", "Please fill all required fields");
        return;
      }

      setIsSubmitting(true);

      // Save page 2 data
      setCreateHostelPage2Data({
        rulesText,
        location,
        nearbyLandmarks,
        fullAddress,
        phoneNumber,
        whatsappNumber,
        photos,
      });

      // Get complete data including room photos from page 1
      const page1Data = getCompleteHostelData();
      const completeData = {
        ...page1Data,
        rulesText,
        location,
        nearbyLandmarks,
        fullAddress,
        phoneNumber,
        whatsappNumber,
        photos,
      };

      // Submit to API
      const response = await apiService.createHostelListing(completeData);

      if (response.success) {
        // Clear context data
        clearHostelData();
        // Navigate to success page
        router.replace("/(secure)/(hostelService)/successful");
      } else {
        Alert.alert("Error", response.error || "Failed to submit listing");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRulesText("");
    setLocation(null);
    setNearbyLandmarks("");
    setFullAddress("");
    setPhoneNumber("");
    setWhatsappNumber("");
    setPhotos([]);
  };

  const handlePreview = () => {
    // Save current page data before preview
    setCreateHostelPage2Data({
      rulesText,
      location,
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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: `photo_${Date.now()}.jpg`,
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
            title="Add New Hostel Service"
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
                height: 100,
                backgroundColor: "#fff",
                paddingTop: 12,
              }}
              containerStyle={{ paddingHorizontal: 0 }}
            />
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="camera-outline" size={20} color="#374151" />
            <Text style={styles.sectionHeader}>Photos</Text>
          </View>

          {photos.length > 0 && (
            <View style={styles.photosGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.photoPreview}
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {photos.length < 5 && (
            <>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadText}>Upload photo</Text>
                <Text style={styles.uploadSubtext}>
                  Upload clear photo of your Hostel
                </Text>
              </TouchableOpacity>

              {photos.length > 0 && photos.length < 5 && (
                <TouchableOpacity
                  style={styles.addMorePhotos}
                  onPress={pickImage}
                >
                  <Text style={styles.addMorePhotosText}>
                    + Add More Photo ({5 - photos.length} remaining)
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

          <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
            <Text style={styles.inputLabel}>Area/Locality *</Text>
            <DropDownPicker
              open={locationOpen}
              value={location}
              items={locationItems}
              setOpen={setLocationOpen}
              setValue={setLocation}
              setItems={setLocationItems}
              placeholder="Select Area"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownList}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedItemContainerStyle={styles.selectedItem}
              listItemLabelStyle={styles.dropdownItemLabel}
              arrowIconStyle={styles.dropdownArrow}
            />
          </View>

          <LabeledInput
            label="Nearby Landmarks"
            placeholder="e.g., Near VNIT, Medical College..."
            value={nearbyLandmarks}
            onChangeText={setNearbyLandmarks}
            labelStyle={styles.inputLabel}
            inputContainerStyle={{ height: 37, backgroundColor: "#fff" }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 20 }}
          />

          <LabeledInput
            label="Full Address *"
            placeholder="Enter complete address with pincode"
            value={fullAddress}
            onChangeText={setFullAddress}
            multiline
            textAlignVertical="top"
            labelStyle={styles.inputLabel}
            inputContainerStyle={{
              height: 64,
              backgroundColor: "#fff",
              paddingTop: 12,
            }}
            containerStyle={{ paddingHorizontal: 0 }}
          />
        </View>

        {/* Contact Information Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="person-outline" size={20} color="#374151" />
            <Text style={styles.sectionHeader}>Contact Information</Text>
          </View>

          <LabeledInput
            label="Phone Number *"
            placeholder="09893464946"
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
            placeholder="09893464946"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType="phone-pad"
            maxLength={10}
            labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputBox}
            containerStyle={styles.inputContainer}
          />
        </View>

        <CommonButton
          title={isSubmitting ? "Submitting..." : "Submit Listing"}
          onPress={handleSubmit}
          buttonStyle={
            isSubmitting
              ? [styles.submitButton, { opacity: 0.7 }]
              : styles.submitButton
          }
          disabled={isSubmitting}
        />

        <TouchableOpacity
          style={styles.previewButton}
          onPress={handlePreview}
          disabled={isSubmitting}
        >
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Your listing will be reviewed and approved within 24 hours
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.white },
  container: { padding: 16, paddingBottom: 30 },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: fonts.interBold,
    color: "#111827",
    marginLeft: 8,
  },
  inputLabel: {
    color: Colors.title,
    fontSize: 14,
    fontFamily: fonts.interMedium,
    marginBottom: 8,
  },
  inputContainer: {
    marginTop: 12,
    paddingHorizontal: 0,
  },
  inputBox: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
  },
  uploadSubtext: {
    color: "#9CA3AF",
    fontFamily: fonts.interRegular,
    fontSize: 12,
    marginTop: 4,
  },
  addMorePhotos: {
    alignSelf: "center",
  },
  addMorePhotosText: {
    color: "#FF6B35",
    fontFamily: fonts.interMedium,
    fontSize: 14,
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
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: "#ffffffff",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 37,
    paddingHorizontal: 12,
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownPlaceholder: {
    color: "#9CA3AF",
    fontSize: 14,
    fontFamily: fonts.interRegular,
  },
  selectedItem: {
    backgroundColor: "#EFF6FF",
  },
  dropdownItemLabel: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: "#374151",
  },
  dropdownArrow: {
    width: 24,
    height: 24,
  },
  submitButton: {
    borderRadius: 8,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  previewButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: Colors.white,
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
  },
});

export default AddNewHostelService1;
