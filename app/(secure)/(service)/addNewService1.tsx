// screens/BasicInfoForm.tsx
import MealCheckbox from "@/components/CheckBox";
import CommonButton from "@/components/CommonButton";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { IS_ANDROID } from "@/constants/Platform";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const BasicInfoForm = () => {
  const { token, userServiceType } = useAuthStore();
  const { formData, extraData, isEdit, id } = useLocalSearchParams();
  // const parsedData = formData ? JSON.parse(formData as string) : null;
  const parsedRxtra = extraData ? JSON.parse(extraData as string) : null;
  // ✅ Parse only once
  const parsedData = useMemo(
    () => (formData ? JSON.parse(formData as string) : null),
    [formData]
  );

  const parsedExtra = useMemo(
    () => (extraData ? JSON.parse(extraData as string) : null),
    [extraData]
  );

  useEffect(() => {
    if (!parsedExtra) return;

    if (parsedExtra.location) {
      setArea(parsedExtra.location.area || "");
      setLandmark(parsedExtra.location.nearbyLandmarks || "");
      setAddress(parsedExtra.location.fullAddress || "");
      setRadius(String(parsedExtra.location.serviceRadius || ""));
    }

    if (parsedExtra.contactInfo) {
      setPhone(String(parsedExtra.contactInfo.phone || ""));
      setWhatsapp(String(parsedExtra.contactInfo.whatsapp || ""));
    }

    if (parsedExtra.features) {
      setFeatures((prev) => ({
        ...prev,
        ...parsedExtra.features,
      }));
    } else if (parsedExtra.serviceFeatures) {
      setFeatures((prev) => {
        const formatted = { ...prev };
        Object.keys(formatted).forEach((key) => {
          formatted[key as keyof typeof formatted] =
            parsedExtra.serviceFeatures?.some(
              (f: string) =>
                f.toLowerCase().replace(/\s+/g, "") === key.toLowerCase()
            ) || false;
        });
        return formatted;
      });
    }

    // 🖼️ Photos
    if (parsedExtra.photos?.length > 0) {
      setPhotos(parsedExtra.photos);
    } else if (parsedExtra.vegPhotos?.length > 0) {
      setPhotos(parsedExtra.vegPhotos);
    } else if (parsedExtra.nonVegPhotos?.length > 0) {
      setPhotos(parsedExtra.nonVegPhotos);
    }
  }, []);

  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Feature toggles
  const [features, setFeatures] = useState({
    "Fresh ingredients daily": false,
    "Hygienic preparation": false,
    "Monthly subscription available": false,
    "Oil-free cooking option": false,
    "Home-style cooking": false,
    "On-time delivery": false,
    "Customizable spice level": false,
    "Organic vegetables": false,
  });

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Photos state
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formDataToSendState, setFormDataToSendState] =
    useState<FormData | null>(null);
  const [modifyDataState, setModifyDataState] = useState<any>(null);

  // Preview logic
  const handlePreview = () => {
    if (!parsedData) return;

    const formDataToSend = new FormData();

    // Text fields
    formDataToSend.append("tiffinName", parsedData.tiffinName || "");
    formDataToSend.append("description", parsedData.description || "");
    formDataToSend.append("foodType", parsedData.foodType || "");

    // Meal Timings
    const mealTimings = (parsedData.mealTimings || [])
      .filter((m: any) => m.checked)
      .map(({ mealType, startTime, endTime }: any) => ({
        mealType,
        startTime,
        endTime,
      }));
    formDataToSend.append("mealTimings", JSON.stringify(mealTimings));

    // Order Types
    const orderTypes = parsedData?.orderTypes
      ? Object.entries(parsedData.orderTypes)
          .filter(([_, v]) => v)
          .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
      : [];
    formDataToSend.append("orderTypes", JSON.stringify(orderTypes));

    // Pricing
    formDataToSend.append("pricing", JSON.stringify(parsedData?.pricing || []));

    // Service Features
    const serviceFeatures = parsedData?.features
      ? Object.entries(parsedData.features)
          .filter(([_, v]) => v)
          .map(([k]) =>
            k
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
          )
      : [];
    formDataToSend.append("serviceFeatures", JSON.stringify(serviceFeatures));

    // Location
    const location = {
      area: area || parsedData?.location?.area || "",
      nearbyLandmarks: landmark || parsedData?.location?.nearbyLandmarks || "",
      fullAddress: address || parsedData?.location?.fullAddress || "",
      serviceRadius: Number(radius || parsedData?.location?.serviceRadius || 5),
    };
    formDataToSend.append("location", JSON.stringify(location));

    // Contact Info
    const contactInfo = {
      phone: Number(phone || parsedData?.contactInfo?.phone || 0),
      whatsapp: Number(whatsapp || parsedData?.contactInfo?.whatsapp || 0),
    };
    formDataToSend.append("contactInfo", JSON.stringify(contactInfo));

    // Photos
    const photoKey =
      (parsedData?.foodType || "").toLowerCase() === "veg"
        ? "vegPhotos"
        : "nonVegPhotos";
    (photos || []).forEach((uri: string, index: number) => {
      formDataToSend.append(photoKey, {
        uri,
        name: `${photoKey}_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    // Whats included
    formDataToSend.append(
      "whatsIncludes",
      JSON.stringify(parsedData?.includedDescription)
    );

    // Modify Data built same as FormData for preview
    const modifyData = {
      tiffinName: parsedData.tiffinName || "",
      description: parsedData.description || "",
      foodType: parsedData.foodType || "",
      mealTimings,
      orderTypes,
      pricing: parsedData?.pricing || [],
      serviceFeatures,
      location,
      contactInfo,
      photos: photos.length > 0 ? photos : parsedData.photos || [],
      whatsIncludes: parsedData?.includedDescription || "",
      ownerId: parsedData.ownerId || "",
      _id: parsedData._id || "",
      status: parsedData.status || "",
      isAvailable: parsedData.isAvailable ?? true,
      totalOrders: parsedData.totalOrders || 0,
      averageRating: parsedData.averageRating || 0,
      isDisabled: parsedData.isDisabled ?? false,
      totalReviews: parsedData.totalReviews || 0,
      createdAt: parsedData.createdAt || "",
      updatedAt: parsedData.updatedAt || "",
      visibilityStatus: parsedData.visibilityStatus || "",
      nonVegPhotos: parsedData.nonVegPhotos || [],
      vegPhotos: parsedData.vegPhotos || [],
      offlineDetails: {
        isOffline: false,
        offlineType: null,
        isPermanent: false,
      },
    };
    setModifyDataState(modifyData);
    // Prepare a raw object to pass
    const rawDataToSend = {
      tiffinName: parsedData?.tiffinName || "",
      description: parsedData?.description || "",
      foodType: parsedData?.foodType || "",
      mealTimings: (parsedData?.mealTimings || []).filter(
        (m: any) => m.checked
      ),
      orderTypes: parsedData?.orderTypes
        ? Object.entries(parsedData.orderTypes)
            .filter(([_, v]) => v)
            .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
        : [],
      pricing: parsedData?.pricing || [],
      serviceFeatures: parsedData?.features
        ? Object.entries(parsedData.features)
            .filter(([_, v]) => v)
            .map(([k]) =>
              k
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
            )
        : [],
      location: {
        area: area || parsedData?.location?.area || "",
        nearbyLandmarks:
          landmark || parsedData?.location?.nearbyLandmarks || "",
        fullAddress: address || parsedData?.location?.fullAddress || "",
        serviceRadius: Number(
          radius || parsedData?.location?.serviceRadius || 5
        ),
      },
      contactInfo: {
        phone: Number(phone || parsedData?.contactInfo?.phone || 0),
        whatsapp: Number(whatsapp || parsedData?.contactInfo?.whatsapp || 0),
      },
      photos: photos.length > 0 ? photos : parsedData?.photos || [],
      whatsIncludes: parsedData?.includedDescription || "",
    };
    router.push({
      pathname: "/(secure)/(service)/previewService",
      params: {
        formData: JSON.stringify(rawDataToSend),
        tiffin: JSON.stringify(modifyData),
        isPreview: "true",
      },
    });
  };

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

  // Create listing
  const handleCreateListing = async () => {
    try {
      setLoading(true);

      const formDataToSend = new FormData();

      // Text fields
      formDataToSend.append("tiffinName", parsedData?.tiffinName || "");
      formDataToSend.append("description", parsedData?.description || "");
      formDataToSend.append("foodType", parsedData?.foodType || "");

      // Meal Timings
      const mealTimings = (parsedData?.mealTimings || [])
        .filter((m: any) => m.checked)
        .map(({ mealType, startTime, endTime }: any) => ({
          mealType,
          startTime,
          endTime,
        }));
      formDataToSend.append("mealTimings", JSON.stringify(mealTimings));

      // Order Types
      const orderTypes = parsedData?.orderTypes
        ? Object.entries(parsedData.orderTypes)
            .filter(([_, v]) => v)
            .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
        : [];
      formDataToSend.append("orderTypes", JSON.stringify(orderTypes));

      // Pricing
      formDataToSend.append(
        "pricing",
        JSON.stringify(parsedData?.pricing || [])
      );

      // Service Features
      const serviceFeatures = Object.entries(features)
        .filter(([_, v]) => v)
        .map(([k]) =>
          k.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
        );

      formDataToSend.append("serviceFeatures", []);

      // Location
      const location = {
        area: area || parsedData?.area || "",
        nearbyLandmarks: landmark || parsedData?.landmark || "",
        fullAddress: address || parsedData?.address || "",
        serviceRadius: Number(radius || parsedData?.radius || 5),
      };
      formDataToSend.append("location", JSON.stringify(location));

      // Contact info
      const contactInfo = {
        phone: Number(phone || parsedData?.phone || 0),
        whatsapp: Number(whatsapp || parsedData?.whatsapp || 0),
      };
      formDataToSend.append("contactInfo", JSON.stringify(contactInfo));

      // Images
      const photoKey =
        (parsedData?.foodType || "").toLowerCase() === "veg"
          ? "vegPhotos"
          : "nonVegPhotos";
      (photos || []).forEach((uri: string, index: number) => {
        formDataToSend.append(photoKey, {
          uri,
          name: `${photoKey}_${index}.jpg`,
          type: "image/jpeg",
        } as any);
      });

      // Whats included
      formDataToSend.append("whatsIncludes", parsedData?.includedDescription);
      console.log(formDataToSend);
      const response = await fetch(
        isEdit === "true"
          ? `https://tifstay-project-be.onrender.com/api/tiffinService/updateTiffinService/${id}`
          : "https://tifstay-project-be.onrender.com/api/tiffinService/createTiffinService",
        {
          method: isEdit === "true" ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Tiffin service created successfully!");
        router.push("/(secure)/(service)/confirmService");
      } else {
        Alert.alert("Error", data?.message || "Failed to create listing.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <CommonHeader title="Add New Tiffen Service" actionText="Reset" />
      </SafeAreaView>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
      >
        {/* === Service Features === */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Image
              source={Images.emptyStar}
              style={{ height: 16, width: 16 }}
            />
            <Text style={styles.heading}>Service Features</Text>
          </View>
          <Text style={styles.subText}>
            Select features that apply to your service
          </Text>

          {Object.keys(features).map((key) => (
            <MealCheckbox
              key={key}
              label={key.replace(/([A-Z])/g, " $1")}
              checked={features[key as keyof typeof features]}
              onToggle={() => toggleFeature(key as keyof typeof features)}
              containerStyle={{ marginBottom: 16 }}
              labelStyle={{
                color: features[key as keyof typeof features]
                  ? Colors.orange
                  : Colors.grey,
              }}
            />
          ))}
        </View>

        {/* === Photos Section === */}
        <View style={[styles.card, { padding: 0 }]}>
          <View style={styles.photoHeader}>
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
                <Text style={styles.uploadHint}>
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

        {/* === Location Section === */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Image source={Images.loc} style={{ height: 16, width: 16 }} />
            <Text style={styles.heading}>Location Details</Text>
          </View>

          <LabeledInput
            label="Area/Locality *"
            placeholder="Enter your area or locality"
            value={area}
            onChangeText={setArea}
            labelStyle={styles.label}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputBox}
            inputStyle={{ marginTop: 0 }}
          />

          <LabeledInput
            label="Nearby Landmarks"
            placeholder="e.g., Near VNIT, Medical College..."
            value={landmark}
            onChangeText={setLandmark}
            labelStyle={styles.label}
            containerStyle={styles.inputContainer}
            inputStyle={{ marginTop: 0 }}
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
            inputStyle={{ marginTop: 0 }}
          />
        </View>

        {/* === Contact Info === */}
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
            inputStyle={{ marginTop: 0 }}
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
            inputStyle={{ marginTop: 0 }}
          />
        </View>

        {/* === Buttons === */}
        <CommonButton
          title={
            isEdit === "true"
              ? "Edit tiffin listing"
              : "+ Create Tiffin Listing"
          }
          onPress={handleCreateListing}
          disabled={loading}
        />

        <CommonButton
          title="Preview"
          buttonStyle={{
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderColor: Colors.primary,
            marginTop: 16,
            marginBottom: IS_ANDROID ? 50 : 5,
          }}
          textStyle={{ color: Colors.primary }}
          onPress={handlePreview}
        />
      </KeyboardAwareScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
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
  subText: {
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 18,
  },
  label: { color: Colors.title, fontSize: 14, fontFamily: fonts.interRegular },
  inputContainer: { marginTop: 20, paddingHorizontal: 0 },
  inputBox: { backgroundColor: Colors.white, borderColor: Colors.lightGrey },
  textArea: { minHeight: 100 },
  descContainer: { marginBottom: 4, marginTop: 20, paddingHorizontal: 0 },
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
  uploadHint: {
    fontFamily: fonts.interRegular,
    fontSize: 13,
    color: Colors.grey,
  },
  previewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  photoHeader: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    padding: 15,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});
