import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface TiffinCardProps {
  tiffin: any;
  onEditPress?: () => void;
  onViewPress?: () => void;
  onReviewPress?: () => void;
}

const TiffinCard: React.FC<TiffinCardProps> = ({
  tiffin,
  onEditPress,
  onViewPress,
}) => {
  const handleViewReviews = () => {
    router.push({
      pathname: "/review",
      params: { tiffinId: tiffin._id },
    });
  };

  // Get the first veg photo or fallback
  const tiffinImage =
    tiffin?.vegPhotos?.[0] || tiffin?.nonVegPhotos?.[0] || Images.food;

  // Get first pricing plan
  const firstPricing = tiffin?.pricing?.[0];
  const pricePerMeal =
    firstPricing?.perMealDining || firstPricing?.perMealDelivery || 120;
  const discount = firstPricing?.offers || "";

  return (
    <View style={styles.card}>
      {/* Left Side - Image */}
      <Image
        source={
          typeof tiffinImage === "string" ? { uri: tiffinImage } : tiffinImage
        }
        style={styles.image}
        resizeMode="cover"
      />

      {/* Right Side - All Content */}
      <View style={styles.rightContent}>
        {/* Title and Badge */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {tiffin?.tiffinName || "Tiffin Service"}
          </Text>
          <View
            style={[
              styles.badge,
              tiffin?.isAvailable ? styles.activeBadge : styles.offlineBadge,
            ]}
          >
            <Text style={styles.badgeText}>
              {tiffin?.isAvailable ? "Active" : "Offline"}
            </Text>
          </View>
        </View>

        {/* Location */}
        <Text style={styles.location}>
          {tiffin?.location?.area || "Location"}
        </Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>₹{pricePerMeal}/meal</Text>
            <Text style={styles.label}>Price</Text>
          </View>
          {discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}</Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {/* Bookings */}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tiffin?.totalOrders || 15}</Text>
            <Text style={styles.label}>Bookings</Text>
          </View>

          {/* Radio Button */}
          <View style={styles.radioButton} />

          {/* Rating */}
          <View style={styles.ratingItem}>
            <View style={styles.ratingRow}>
              <Image source={Images.star} style={styles.starIcon} />
              <Text style={styles.statValue}>
                {tiffin?.averageRating?.toFixed(1) || "4.7"}
              </Text>
              <Text style={styles.reviewText}>
                ({tiffin?.totalReviews || 8})
              </Text>
            </View>
            <Text style={styles.label}>Rating</Text>
          </View>

          {/* Type */}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tiffin?.foodType || "Veg"}</Text>
            <Text style={styles.label}>Type</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onViewPress}
            activeOpacity={0.7}
          >
            <Image source={Images.view} style={styles.btnIcon} />
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onEditPress}
            activeOpacity={0.7}
          >
            <Image source={Images.edit} style={styles.btnIcon} />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons - Row 2 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewReviews}
            activeOpacity={0.7}
          >
            <Image source={Images.star} style={styles.btnIcon} />
            <Text style={styles.buttonText}>View Reviews</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 82,
    height: 82,
    borderRadius: 12,
    marginRight: 12,
  },
  rightContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fonts.interSemibold,
    color: "#1A1A1A",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: Colors.primary,
  },
  offlineBadge: {
    backgroundColor: Colors.red,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fonts.interMedium,
    color: Colors.white,
  },
  location: {
    fontSize: 13,
    fontFamily: fonts.interRegular,
    color: "#6B7280",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  price: {
    fontSize: 12,
    fontFamily: fonts.interSemibold,
    color: Colors.primary,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  discountBadge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 10,
    fontFamily: fonts.interMedium,
    color: Colors.white,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 7,
  },
  statItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: 12,
    fontFamily: fonts.interSemibold,
    color: "#1A1A1A",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginTop: 2,
  },
  ratingItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 2,
  },
  starIcon: {
    height: 14,
    width: 14,
  },
  reviewText: {
    fontSize: 12,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 7,
    marginTop: 7,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 2,
    flex: 1,
  },
  btnIcon: {
    height: 16,
    width: 16,
  },
  buttonText: {
    fontSize: 10,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
});

export default TiffinCard;
