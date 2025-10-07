// screens/BasicInfoForm.tsx
import MealCheckbox from "@/components/CheckBox";
import CommonButton from "@/components/CommonButton";
import CommonDropdown from "@/components/CommonDropDown";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { IS_ANDROID } from "@/constants/Platform";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const BasicInfoForm = () => {
  // Form states
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  // Features state
  const [features, setFeatures] = useState({
    freshIngredients: false,
    hygienicPreparation: false,
    monthlySubscription: false,
    oilFree: false,
    homeStyle: false,
    onTimeDelivery: false,
    spiceLevel: false,
    organicVeggies: false,
  });

  // Helper to toggle feature
  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Photos state
  const [photos, setPhotos] = useState<string[]>([]);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const ROLES = [
    { label: "With one meal", value: "With one meal" },
    { label: "With two meal", value: "With two meal" },
    { label: "One meal with breakfast", value: "One meal with breakfast" },
    {
      label: "With Lunch & dinner & breakfast",
      value: "With Lunch & dinner & breakfast",
    },
    { label: "With breakfast", value: "With breakfast" },
  ];

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <View style={{ backgroundColor: Colors.white }}>
          <CommonHeader title="Add New Tiffen Service" actionText="Reset" />
        </View>
      </SafeAreaView>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={80} 
        keyboardShouldPersistTaps="handled"
      >
        {/* Section - Service Features */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Image
              source={Images.emptyStar}
              style={{ height: 16, width: 16 }}
            />
            <Text style={styles.heading}>Service Features</Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.interRegular,
              color: Colors.grey,
              fontSize: 14,
              marginTop: 10,
              marginBottom: 18,
            }}
          >
            Select features that apply to your service
          </Text>
          <MealCheckbox
            label="Fresh ingredients daily"
            checked={features.freshIngredients}
            onToggle={() => toggleFeature("freshIngredients")}
            containerStyle={{ marginBottom: 16 }}
            labelStyle={{color : features.freshIngredients ? Colors.orange : Colors.grey}}
            
          />
          <MealCheckbox
            label="Hygienic preparation"
            checked={features.hygienicPreparation}
            onToggle={() => toggleFeature("hygienicPreparation")}
            containerStyle={{ marginBottom: 16 }}
            labelStyle={{color : features.hygienicPreparation ? Colors.orange : Colors.grey}}
          />
          <MealCheckbox
            label="Monthly subscription available"
            checked={features.monthlySubscription}
            onToggle={() => toggleFeature("monthlySubscription")}
            containerStyle={{ marginBottom: 16 }}
            labelStyle={{color : features.monthlySubscription ? Colors.orange : Colors.grey}}

          />
          <MealCheckbox
            label="Oil-free cooking option"
            checked={features.oilFree}
            onToggle={() => toggleFeature("oilFree")}
            containerStyle={{ marginBottom: 16 }}
            labelStyle={{color : features.oilFree ? Colors.orange : Colors.grey}}

          />
          <MealCheckbox
            label="Home-style cooking"
            checked={features.homeStyle}
            onToggle={() => toggleFeature("homeStyle")}
            containerStyle={{ marginBottom: 16 }}
            labelStyle={{color : features.homeStyle ? Colors.orange : Colors.grey}}

          />
          <MealCheckbox
            label="On-time delivery"
            checked={features.onTimeDelivery}
            onToggle={() => toggleFeature("onTimeDelivery")}
            containerStyle={{ marginBottom: 16 }}
            labelStyle={{color : features.onTimeDelivery ? Colors.orange : Colors.grey}}

          />
          <MealCheckbox
            label="Customizable spice level"
            checked={features.spiceLevel}
            onToggle={() => toggleFeature("spiceLevel")}
            containerStyle={{ marginBottom: 16 }}
            labelStyle={{color : features.hygienicPreparation ? Colors.orange : Colors.grey}}

          />
          <MealCheckbox
            label="Organic vegetables"
            checked={features.organicVeggies}
            onToggle={() => toggleFeature("organicVeggies")}
            containerStyle={{ marginBottom: 16 }}
            labelStyle={{color : features.hygienicPreparation ? Colors.orange : Colors.grey}}

          />
        </View>

        {/* Section - Photos */}
        <View style={[styles.card, { padding: 0 }]}>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              padding: 15,
            }}
          >
            <Image source={Images.camera} style={{ height: 16, width: 16 }} />
            <Text style={styles.heading}>Photos</Text>
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            {photos.length === 0 ? (
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <Text style={{ fontFamily: fonts.interSemibold, fontSize: 15 }}>
                  Upload photos
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.interRegular,
                    fontSize: 13,
                    color: Colors.grey,
                  }}
                >
                  Upload clear photos of your tiffin meals
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.previewContainer}>
                {photos.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.image} />
                ))}
              </View>
            )}
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.addMore}>+ Add More Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section - Basic Information */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Image source={Images.loc} style={{ height: 16, width: 16 }} />
            <Text style={styles.heading}>Location Details</Text>
          </View>
          <CommonDropdown
            items={ROLES}
            label="Area/Locality *"
            placeholder="Select Area"
            value={area}
            setValue={(val:any)=>{setArea(val)}}
            containerStyle={{ marginBottom: 0, marginTop: 20 }}
          />
          <LabeledInput
            label="Nearby Landmarks"
            placeholder="e.g., Near VNIT, Medical College..."
            value={landmark}
            onChangeText={setLandmark}
            labelStyle={styles.label}
            containerStyle={styles.inputContainer}
            inputStyle={{marginTop:0}}
            inputContainerStyle={styles.inputBox}
          />
          <LabeledInput
            label="Full Address"
            placeholder="Enter complete address with pincode"
            value={address}
            onChangeText={setAddress}
            multiline
            textAlignVertical="auto"
            labelStyle={styles.label}
            inputContainerStyle={[styles.inputBox, styles.textArea]}
            containerStyle={styles.descContainer}
            inputStyle={styles.textAreaInput}
          />
          <LabeledInput
            label="Service Radius (sq km) *"
            placeholder="5"
            value={radius}
            onChangeText={setRadius}
            labelStyle={styles.label}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputBox}
            keyboardType="numeric"
            inputStyle={{marginTop:0}}
          />
        </View>

        {/* Section - Contact Information */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Image
              source={Images.profile}
              style={{ height: 16, width: 16, tintColor: Colors.title }}
            />
            <Text style={styles.heading}>Contact Information</Text>
          </View>
          <LabeledInput
            label="Phone Number *"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            labelStyle={styles.label}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputBox}
            keyboardType="numeric"
            inputStyle={{marginTop:0}}
          />
          <LabeledInput
            label="WhatsApp Number *"
            placeholder="Enter WhatsApp number"
            value={whatsapp}
            onChangeText={setWhatsapp}
            labelStyle={styles.label}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputBox}
            keyboardType="numeric"
            inputStyle={{marginTop:0}}
          />
        </View>

        {/* Buttons */}
        <CommonButton
          title="+ Create Tiffin Listing"
          onPress={() => {
            router.push("/(service)/confirmService");
          }}
        />
        <CommonButton
          title="Preview"
          buttonStyle={{
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderColor: Colors.primary,
            marginTop: 16,
            marginBottom:IS_ANDROID ? 50 : 5
          }}
          textStyle={{ color: Colors.primary }}
          onPress={() => {
            router.push("/(service)/previewService");
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default BasicInfoForm;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16, backgroundColor: Colors.white },
  card: {
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  heading: { fontSize: 16, fontFamily: fonts.interSemibold },
  label: { color: Colors.title, fontSize: 14, fontFamily: fonts.interRegular },
  inputContainer: { marginTop: 20, paddingHorizontal: 0 },
  inputBox: { backgroundColor: Colors.white, borderColor: Colors.lightGrey },
  textArea: { minHeight: 100 },
  descContainer: { marginBottom: 50, marginTop: 20, paddingHorizontal: 0 },
  textAreaInput: { minHeight: 80 },
  addMore: {
    textAlign: "center",
    color: Colors.orange,
    fontFamily: fonts.interBold,
    fontSize: 14,
    paddingVertical: 10,
  },
  uploadBox: {
    height: 108,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.lightGrey,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  previewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
});
