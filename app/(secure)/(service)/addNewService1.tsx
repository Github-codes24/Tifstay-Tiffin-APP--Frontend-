import CommonButton from "@/components/CommonButton";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import hostelApiService from "@/services/hostelApiService";
import useServiceStore from "@/store/serviceStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddNewHostelService1 = () => {
  const params = useLocalSearchParams();
  const mode = params.mode as "add" | "edit";
  const hostelId = params.hostelId as string;
  const isUpdatingHostel = mode === "edit";
  const router = useRouter();
  const {
    setFormPage2Data,
    formPage1Data,
    createHostelService,
    updateHostelService,
    isLoading,
    clearFormData,
  } = useServiceStore();

  const [rulesText, setRulesText] = useState("");
  const [area, setArea] = useState("");
  const [nearbyLandmarks, setNearbyLandmarks] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [photos, setPhotos] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const loadPage2Data = async () => {
      if (!isUpdatingHostel || !hostelId) return;

      setIsLoadingData(true);
      try {
        const response = await hostelApiService.getHostelServiceById(hostelId);

        if (response.success && response.data?.data) {
          const hostelData = response.data.data;

          setArea(hostelData.location?.area || "");
          setNearbyLandmarks(hostelData.location?.nearbyLandmarks || "");
          setFullAddress(hostelData.location?.fullAddress || "");

          setPhoneNumber(
            hostelData.contactInfo?.phone
              ? hostelData.contactInfo.phone.toString()
              : ""
          );
          setWhatsappNumber(
            hostelData.contactInfo?.whatsapp
              ? hostelData.contactInfo.whatsapp.toString()
              : ""
          );

          setRulesText(hostelData.rulesAndPolicies || "");

          if (hostelData.hostelPhotos && hostelData.hostelPhotos.length > 0) {
            const existingPhotos = hostelData.hostelPhotos.map(
              (url: string, index: number) => ({
                uri: url,
                type: "image/jpeg",
                name: `hostel_photo_${index}.jpg`,
                isExisting: true,
              })
            );
            setPhotos(existingPhotos);
          }
        } else {
          Alert.alert("Error", "Failed to load hostel data");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load hostel data");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadPage2Data();
  }, [isUpdatingHostel, hostelId]);

  const handleSubmit = async () => {
    try {
      if (!phoneNumber || !whatsappNumber || !fullAddress) {
        Alert.alert("Error", "Please fill all required fields");
        return;
      }

      if (!formPage1Data) {
        Alert.alert(
          "Error",
          "Missing form data. Please go back and fill all required fields."
        );
        return;
      }

      setIsSubmitting(true);

      setFormPage2Data({
        rulesText,
        area: area || null,
        nearbyLandmarks,
        fullAddress,
        phoneNumber,
        whatsappNumber,
        photos,
      });

      const roomsData = formPage1Data.rooms.map((room) => {
        const totalBeds = [];
        for (let i = 1; i <= room.noOfBeds; i++) {
          totalBeds.push({ bedNumber: i });
        }

        const roomPayload: any = {
          roomNumber: parseInt(room.roomNo) || 101,
          totalBeds: totalBeds,
          roomDescription: room.roomDetails || "This is a hostel room",
        };

        if (room._id && !room.isNewRoom) {
          roomPayload._id = room._id;
        }

        if (room.isNewRoom) {
          roomPayload.isNewRoom = true;
        }

        return roomPayload;
      });

      const apiData = {
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
          area: area || "Didwana",
          nearbyLandmarks: nearbyLandmarks || "Jaipur",
          fullAddress: fullAddress || "Rajasthan",
        },
        contactInfo: {
          phone: parseInt(phoneNumber),
          whatsapp: parseInt(whatsappNumber),
        },
        rulesAndPolicies: rulesText || "No smoking inside premises",
        hostelPhotos: photos.filter((p: any) => !p.isExisting),
        roomsWithPhotos: formPage1Data.rooms.map((room) => ({
          ...room,
          roomPhotos: room.roomPhotos.filter((p: any) => !p.isExisting),
        })),
      };

      const response = isUpdatingHostel
        ? await updateHostelService(hostelId, apiData)
        : await createHostelService(apiData);

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
    } catch (error) {
      console.error("❌ Submit error:", error);
      Alert.alert("Error", "An unexpected error occurred");
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
          name: `photo_${Date.now()}.jpg`,
          isExisting: false,
        };
        setPhotos([...photos, newPhoto]);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removePhoto = async (index: number) => {
    const photo = photos[index];

    if (photo.isExisting && isUpdatingHostel) {
      Alert.alert(
        "Delete Photo",
        "Do you want to delete this photo from the server?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const response = await hostelApiService.deleteHostelPhotos(
                  hostelId,
                  [photo.uri]
                );

                if (response.success) {
                  setPhotos(photos.filter((_, i) => i !== index));
                  Alert.alert("Success", "Photo deleted successfully");
                } else {
                  Alert.alert(
                    "Error",
                    response.error || "Failed to delete photo"
                  );
                }
              } catch (error) {
                console.error("Error deleting hostel photo:", error);
                Alert.alert("Error", "Failed to delete photo");
              }
            },
          },
        ]
      );
    } else {
      setPhotos(photos.filter((_, i) => i !== index));
    }
  };

  if (isLoadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading hostel data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <View style={{ backgroundColor: Colors.white }}>
          <CommonHeader
            title={
              isUpdatingHostel
                ? "Edit Hostel Service"
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

        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="camera-outline" size={20} color="#374151" />
            <Text style={styles.sectionHeader}>Hostel Photos</Text>
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

        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="location-outline" size={20} color="#374151" />
            <Text style={styles.sectionHeader}>Location Details</Text>
          </View>
          <LabeledInput
            label="Area/Locality *"
            placeholder="Enter area"
            value={area}
            onChangeText={setArea}
            labelStyle={styles.inputLabel}
            inputContainerStyle={{ height: 37, backgroundColor: "#fff" }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 20 }}
          />
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

        <TouchableOpacity
          style={styles.previewButton}
          onPress={handlePreview}
          disabled={isSubmitting || isLoading}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontFamily: fonts.interMedium,
  },
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
