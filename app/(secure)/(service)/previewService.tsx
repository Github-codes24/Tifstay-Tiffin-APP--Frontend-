// screens/MealDetails.tsx
import CommonButton from "@/components/CommonButton";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

const MealDetails = () => {
  const { tiffin, isPreview, formData }: any = useLocalSearchParams();
  const parsedTiffin = tiffin ? JSON.parse(tiffin) : null;
  const parsedFormData = formData ? JSON.parse(formData as string) : null;
  const { token } = useAuthStore();

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Enable LayoutAnimation on Android
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      // @ts-ignore
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const buildFormData = (data: any) => {
    const formData = new FormData();

    formData.append("tiffinName", data.tiffinName);
    formData.append("description", data.description);
    formData.append("foodType", data.foodType);
    formData.append("mealTimings", JSON.stringify(data.mealTimings));
    formData.append("orderTypes", JSON.stringify(data.orderTypes));
    formData.append("pricing", JSON.stringify(data.pricing));
    formData.append("serviceFeatures", JSON.stringify(data.serviceFeatures));
    formData.append("location", JSON.stringify(data.location));
    formData.append("contactInfo", JSON.stringify(data.contactInfo));
    formData.append("whatsIncludes", JSON.stringify(data.whatsIncludes));

    // Append photos
    const photoKey =
      data.foodType.toLowerCase() === "veg" ? "vegPhotos" : "nonVegPhotos";
    (data.photos || []).forEach((uri: string, index: number) => {
      formData.append(photoKey, {
        uri,
        name: `${photoKey}_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    return formData;
  };

  const handleCreateListing = async () => {
    if (!parsedFormData) {
      Alert.alert("Error", "No form data available.");
      return;
    }

    try {
      setLoading(true);

      // Rebuild FormData from raw object
      const formDataToSend = buildFormData(parsedFormData);

      const response = await fetch(
        "https://tifstay-project-be.onrender.com/api/tiffinService/createTiffinService",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formDataToSend, // <-- now this is real FormData
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
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Meal Image */}
        <View style={{ paddingHorizontal: 16 }}>
          <Image
            source={
              parsedTiffin?.vegPhotos?.[0]
                ? { uri: parsedTiffin.vegPhotos[0] }
                : parsedTiffin?.nonVegPhotos?.[0]
                ? { uri: parsedTiffin.nonVegPhotos[0] }
                : require("@/assets/images/tiffin.png")
            }
            style={styles.image}
          />
        </View>

        {/* Title + Description */}
        <Text style={styles.title}>
          {parsedTiffin?.tiffinName ?? "Maharashtrian Ghar Ka Khana"}
        </Text>
        <Text style={styles.description}>{parsedTiffin?.description}</Text>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={[styles.row, styles.vegTag]}>
            <Image source={Images.veg} style={styles.iconSmall} />
            <Text style={styles.tag}>
              {parsedTiffin?.foodType?.type ?? "Veg"}
            </Text>
          </View>

          <View style={styles.row}>
            <Image source={Images.loc} style={styles.iconSmall} />
            <Text style={styles.info}>
              {parsedTiffin?.location?.area ?? "Dharampeth"}
            </Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="#555" />
            <Text style={styles.info}>7:00 AM - 10:00 PM</Text>
          </View>
        </View>

        {/* Pricing Card */}
        {parsedTiffin?.pricing?.map((plan: any, index: number) => {
          const isExpanded = expandedIndex === index;
          return (
            <View key={plan?.planType ?? index} style={styles.priceCard}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.priceTitle}>{plan?.planType}</Text>

                <TouchableOpacity
                  onPress={() => toggleExpand(index)}
                  hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                >
                  <Image
                    source={Images.back}
                    style={[
                      styles.arrowIcon,
                      {
                        transform: [
                          { rotate: isExpanded ? "270deg" : "90deg" },
                        ],
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {isExpanded && (
                <>
                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.priceText}>
                        Dining {plan?.perMealDining}/day
                      </Text>
                      <Text style={styles.priceText}>
                        Dining {plan?.weeklyDining}/week
                      </Text>
                      <Text style={styles.priceText}>
                        Dining {plan?.monthlyDining}/month
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.priceText}>
                        Delivery {plan?.perMealDelivery}/day
                      </Text>
                      <Text style={styles.priceText}>
                        Delivery {plan?.weeklyDelivery}/week
                      </Text>
                      <Text style={styles.priceText}>
                        Delivery {plan?.monthlyDelivery}/month
                      </Text>
                    </View>
                  </View>

                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      {plan?.offers ?? "10% OFF"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          );
        })}

        {/* Meal Preference */}
        <Text style={styles.sectionTitle}>Meal Preference</Text>
        {parsedTiffin?.mealTimings?.map((meal: any) => (
          <Text key={meal.mealType} style={styles.listItem}>
            • {meal?.mealType} ({meal?.startTime} - {meal?.endTime})
          </Text>
        ))}

        {/* What's Included */}
        <Text style={styles.sectionTitle}>{"What's included"}</Text>
        <Text style={styles.listItem}>
          •{" "}
          {parsedTiffin?.foodType?.whatIncludeInVeg ??
            parsedTiffin?.whatsIncludes ??
            "2 Roti + 1 Sabzi + Dal + Rice + Pickle"}
        </Text>
        <Text style={styles.listItem}>
          •{" "}
          {parsedTiffin?.foodType?.whatIncludeInNonVeg ??
            "2 Roti + 1 Sabzi + Dal + Rice + Pickle"}
        </Text>

        {/* Order Type */}
        <Text style={styles.sectionTitle}>Order Type</Text>
        {parsedTiffin?.orderTypes?.map((order: any, idx: number) => (
          <Text key={idx} style={styles.listItem}>
            • {order}
          </Text>
        ))}

        {/* Why Choose Us */}
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        {parsedTiffin?.serviceFeatures?.map((feature: any, idx: number) => (
          <Text key={idx} style={styles.listItem}>
            • {feature}
          </Text>
        ))}

        {/* Location */}
        <View style={styles.card}>
          <Text style={styles.infoTitle}>Location</Text>
          <Text style={styles.infoListItem}>
            {parsedTiffin?.location?.nearbyLandmarks}
          </Text>
          <Text style={styles.infoListItem}>
            {parsedTiffin?.location?.fullAddress}
          </Text>
          <Text style={styles.infoListItem}>
            Service Radius: {parsedTiffin?.location?.serviceRadius} sq km
          </Text>
        </View>

        {/* Contact Info */}
        <View style={[styles.card, styles.noTopMargin]}>
          <Text style={styles.infoTitle}>Contact Information</Text>
          <View style={styles.contactRow}>
            <View style={styles.contactBox}>
              <Image source={Images.call} style={styles.iconMedium} />
              <Text style={styles.contactText}>
                {parsedTiffin?.contactInfo?.phone}
              </Text>
            </View>
            <View style={styles.contactBox}>
              <Image source={Images.chat} style={styles.iconMedium} />
              <Text style={styles.contactText}>
                {parsedTiffin?.contactInfo?.whatsapp}
              </Text>
            </View>
          </View>
        </View>

        {isPreview === "true" && (
          <>
            <CommonButton
              title={loading ? "Creating..." : "+ Create Tiffin Listing"}
              buttonStyle={styles.createButton}
              onPress={handleCreateListing}
              disabled={loading}
            />
            <Text style={[styles.listItem, styles.reviewNote]}>
              Your listing will be reviewed and approved within 24 hours
            </Text>
          </>
        )}
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

export default MealDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 30 },
  image: { width: "100%", height: 270, borderRadius: 15, marginBottom: 12 },
  title: {
    fontSize: 18,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 16,
    flexWrap: "wrap",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  vegTag: {
    backgroundColor: Colors.green,
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tag: { color: Colors.white, fontFamily: fonts.interMedium, fontSize: 12 },
  info: { color: Colors.grey, fontFamily: fonts.interMedium, fontSize: 12 },
  priceCard: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    margin: 16,
    borderRadius: 12,
    position: "relative",
  },
  priceTitle: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    marginBottom: 12,
    color: Colors.primary,
  },
  priceRow: { flexDirection: "row", gap: 16 },
  priceText: {
    fontSize: 12,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
    marginBottom: 6,
  },
  discountBadge: {
    position: "absolute",
    top: "60%",
    right: 12,
    backgroundColor: "#3A88FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: { fontSize: 12, color: "#fff", fontFamily: fonts.interRegular },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
    color: Colors.title,
  },
  listItem: {
    fontSize: 12,
    color: Colors.grey,
    paddingHorizontal: 16,
    marginBottom: 4,
    fontFamily: fonts.interMedium,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    marginBottom: 8,
    color: Colors.title,
  },
  infoListItem: {
    fontSize: 12,
    color: Colors.grey,
    fontFamily: fonts.interMedium,
    marginBottom: 4,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DFE1E6",
  },
  noTopMargin: { marginTop: 0 },
  contactRow: { flexDirection: "row", gap: 8 },
  contactBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DFE1E6",
    padding: 8,
    borderRadius: 36,
    gap: 4,
  },
  contactText: {
    fontFamily: fonts.interMedium,
    fontSize: 14,
    color: Colors.title,
  },
  createButton: { marginHorizontal: 16, marginTop: 16 },
  reviewNote: { marginTop: 10, textAlign: "center" },
  iconSmall: { height: 16, width: 16 },
  iconMedium: { height: 20, width: 20 },
  arrowIcon: { height: 24, width: 24 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});
