import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { router } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const TiffinCard = ({ tiffin }: any) => {
  console.log(tiffin);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Image */}
        <Image
          source={
            tiffin?.photos?.[0]
              ? { uri: tiffin.photos[0] }
              : tiffin?.vegPhotos?.[0]
              ? { uri: tiffin.vegPhotos[0] }
              : tiffin?.nonVegPhotos?.[0]
              ? { uri: tiffin.nonVegPhotos[0] }
              : require("../assets/images/tiffin.png")
          }
          style={styles.image}
          resizeMode="cover"
        />
        {/* Info Section */}
        <View style={styles.info}>
          <View style={styles.rowBetween}>
            <Text style={styles.title} numberOfLines={1}>
              {tiffin?.tiffinName}
            </Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>
                {tiffin?.isAvailable && "Active"}
              </Text>
            </View>
          </View>

          <Text style={styles.location}>{tiffin?.location?.area}</Text>

          <View style={[styles.row, styles.mt16]}>
            <View>
              <Text style={styles.price}>
                {tiffin?.pricing[0]?.perMealDining}/meal
              </Text>
              <Text style={styles.label}>Price</Text>
            </View>
            <View style={styles.discount}>
              <Text style={styles.discountText}>
                {tiffin?.pricing[0]?.offers || "10% Discount"}
              </Text>
            </View>
          </View>

          <View style={[styles.rowBetween, styles.mt16]}>
            <View style={styles.gap6}>
              <Text style={styles.booking}>{tiffin?.totalOrders}</Text>
              <Text style={styles.label}>Bookings</Text>
            </View>

            <View style={styles.ratingWrapper}>
              <TouchableOpacity style={styles.radioBtn} />
              <View style={styles.gap6}>
                <View style={styles.ratingRow}>
                  <Image source={Images.star} style={styles.starIcon} />
                  <Text style={styles.rating}>
                    {tiffin?.averageRating}{" "}
                    <Text style={styles.review}>
                      ({tiffin?.totalReviews}) reviews
                    </Text>
                  </Text>
                </View>
                <Text style={styles.label}>Rating</Text>
              </View>
            </View>

            <View style={styles.gap6}>
              <Text style={styles.type}>
                {tiffin?.foodType === "Both Veg & Non-Veg"
                  ? "Veg/non-Veg"
                  : tiffin?.foodType}
              </Text>
              <Text style={styles.label}>Type</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.push({
                  pathname: "/(secure)/(service)/previewService",
                  params: {
                    tiffin: JSON.stringify(tiffin),
                    isPreview: "false",
                  },
                });
              }}
            >
              <Image source={Images.view} style={styles.btnIcon} />
              <Text style={styles.btnText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.push({
                  pathname: "/(secure)/(service)/addNewService",
                  params: {
                    formData: JSON.stringify(tiffin),
                    isEdit: "true",
                    id: tiffin?._id,
                  },
                });
              }}
            >
              <Image source={Images.edit} style={styles.btnIcon} />
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button}>
              <Image source={Images.delete} style={styles.btnIcon} />
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    overflow: "hidden",
    padding: 10,
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  image: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    flexShrink: 1,
    marginRight: 10,
    fontFamily: fonts.interSemibold,
  },
  location: {
    fontSize: 12,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontFamily: fonts.interSemibold,
    fontSize: 12,
    color: Colors.primary,
  },
  discount: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
  },
  discountText: {
    fontSize: 9,
    color: Colors.white,
    fontFamily: fonts.interRegular,
  },
  activeBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeText: {
    fontSize: 9,
    color: Colors.white,
    fontFamily: fonts.interRegular,
  },
  booking: {
    fontSize: 12,
    color: Colors.title,
    textAlign: "left",
    fontFamily: fonts.interSemibold,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 12,
    fontFamily: fonts.interSemibold,
    marginLeft: 4,
  },
  review: {
    fontSize: 12,
    color: "#666",
  },
  type: {
    fontSize: 12,
    color: Colors.title,
    textAlign: "center",
    fontFamily: fonts.interSemibold,
    maxWidth: 50,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
    justifyContent: "center",
  },
  btnIcon: {
    height: 16,
    width: 16,
  },
  btnText: {
    marginLeft: 6,
    fontSize: 12,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.interRegular,
  },
  radioBtn: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: Colors.primary,
  },
  gap6: {
    gap: 6,
  },
  mt16: {
    marginTop: 16,
  },
  starIcon: {
    height: 14,
    width: 14,
  },
});

export default TiffinCard;
