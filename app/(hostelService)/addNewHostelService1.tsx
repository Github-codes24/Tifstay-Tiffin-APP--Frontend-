import CommonButton from "@/components/CommonButton";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import { useHostel } from "@/context/HostelProvider";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  const { createHostelPage1Data } = useHostel();
  const [rulesText, setRulesText] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationItems, setLocationItems] = useState([
    { label: "Select Area", value: null },
    { label: "Near VNIT, Medical College...", value: "vnit" },
    { label: "Near IIM, IT Park", value: "iim" },
    { label: "Near GMCH", value: "gmch" },
  ]);
  const [nearbyLandmarks, setNearbyLandmarks] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  console.log({ createHostelPage1Data });

  const handleSubmit = () => {
    console.log("Form submitted");
    // const formData = new FormData();
    // formData.append("name", name);
    // formData.append("hostelType", hostelType)
  };

  const resetForm = () => {
    setRulesText("");
    setLocation(null);
    setNearbyLandmarks("");
    setFullAddress("");
    setPhoneNumber("");
    setWhatsappNumber("");
  };

  const handlePreview = () => {
    router.push("/(hostelService)/previewServiceHostel");
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
    });

    console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
    }
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
              {/* <Text style={styles.infoTitle}></Text> */}
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
              inputContainerStyle={{ height: 64, backgroundColor: "#fff" }}
              containerStyle={{ paddingHorizontal: 0 }}
              // inputStyle={{height:90}}
              // multiline
            />
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="camera-outline" size={20} color="#374151" />
            <Text style={styles.sectionHeader}>Photos</Text>
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadText}>Upload photo</Text>
            <Text style={styles.uploadSubtext}>
              Upload clear photo of your Hostel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addMorePhotos}>
            <Text style={styles.addMorePhotosText}>+ Add More Photo</Text>
          </TouchableOpacity>
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
            label="Full Address"
            placeholder="Enter complete address with pincode"
            value={fullAddress}
            onChangeText={setFullAddress}
            multiline
            textAlignVertical="top"
            labelStyle={styles.inputLabel}
            inputContainerStyle={{ height: 64, backgroundColor: "#fff" }}
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
            labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputBox}
            containerStyle={styles.inputContainer}
          />
        </View>

        <CommonButton
          title="Submit Listing"
          onPress={handleSubmit}
          buttonStyle={styles.submitButton}
        />

        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => {
            handlePreview();
          }}
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
    // paddingBottom: 65,
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
  infoTitle: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    marginBottom: 4,
  },
  inputLabel: {
    color: Colors.title,
    fontSize: 14,
    fontFamily: fonts.interMedium,
    marginBottom: 8,
    // alignItems: "center",
    // justifyContent: "center",
  },
  inputContainer: {
    marginTop: 12,
    paddingHorizontal: 0,
    // alignItems: "center",
    // justifyContent: "center",
  },

  inputBox: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    // height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  textAreaInput: {
    minHeight: 80,
    textAlignVertical: "top",
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
