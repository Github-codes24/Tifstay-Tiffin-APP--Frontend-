import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { IS_IOS } from "@/constants/Platform";
import { fonts } from "@/constants/typography";
import { Images } from "@/constants/Images";
import { Colors } from "@/constants/Colors";

const reviews = [
  {
    id: "1",
    name: "Autumn Phillips",
    date: "Monday, June 16, 2025",
    rating: 5,
    text: "I’ve been using this tiffin service for over a month now, and the food quality is consistently great. Fresh ingredients, clean packaging, and always on time. It honestly feels like a meal from home!",
  },
  {
    id: "2",
    name: "Rhonda Rhodes",
    date: "Wednesday, March 12, 2025",
    rating: 4,
    text: "What I love the most is the cleanliness and hygiene. Plus, I can track my orders and choose between lunch or dinner slots easily. Highly recommended.",
  },
  {
    id: "3",
    name: "Patricia Sanders",
    date: "Friday, April 11, 2025",
    rating: 3,
    text: "I stay in a hostel and don’t have time to cook – this service has been a lifesaver. The lunch is always warm and delivered on time. Customer support is also responsive.",
  },
];

const filters = ["All", "Positive", "Negative", "5", "4", "3", "2", "1"];

const ReviewsScreen = () => {
  const [active, setActive] = useState("All");

  const renderStars = (count: number) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Image
          key={i}
          source={Images.star}
          style={[
            styles.star,
            { tintColor: i <= count ? "#FCA613" : "#C1C7D0" },
          ]}
        />
      ))}
    </View>
  );

  // 🔹 Filtering logic
  const filteredReviews = reviews.filter((r) => {
    if (active === "All") return true;
    if (active === "Positive") return r.rating >= 4;
    if (active === "Negative") return r.rating <= 2;
    if (["5", "4", "3", "2", "1"].includes(active))
      return r.rating === Number(active);
    return true;
  });

  const renderReview = ({ index, item }: any) => (
    <View
      style={[
        styles.reviewCard,
        index !== filteredReviews.length - 1 && styles.reviewBorder,
      ]}
    >
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Image source={Images.user} style={styles.avatar} />
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.starWrapper}>{renderStars(item.rating)}</View>
          </View>
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Rating Overview */}
      <View style={styles.ratingSection}>
        <View style={styles.leftRating}>
          <Text style={styles.avgRating}>4.9</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Image
                key={i}
                source={Images.star}
                style={[
                  styles.star,
                  { tintColor: i <= 4 ? "#FCA613" : "#F5F5F5" },
                ]}
              />
            ))}
          </View>
          <Text style={styles.totalReviews}>(105)</Text>
        </View>

        <View style={styles.rightBars}>
          {[5, 4, 3, 2, 1].map((star) => (
            <View key={star} style={styles.barRow}>
              <Text style={styles.starText}>{star}</Text>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width:
                        star === 5
                          ? "90%"
                          : star === 4
                          ? "20%"
                          : star === 3
                          ? "5%"
                          : "2%",
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Filters */}
      <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter, index) => {
          const isStarFilter = ["5", "4", "3", "2", "1"].includes(filter);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.filterBtn, active === filter && styles.activeBtn]}
              onPress={() => setActive(filter)}
            >
              {isStarFilter ? (
                <View style={styles.starFilterRow}>
                  <Text
                    style={[
                      styles.filterText,
                      active === filter && styles.activeText,
                    ]}
                  >
                    {filter}
                  </Text>
                  <Image
                    source={Images.star}
                    style={[
                      styles.starIcon,
                      {
                        tintColor:
                          active === filter ? Colors.white : Colors.grey,
                      },
                    ]}
                  />
                </View>
              ) : (
                <Text
                  style={[
                    styles.filterText,
                    active === filter && styles.activeText,
                  ]}
                >
                  {filter}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      </View>
      {/* Reviews */}
      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReview}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: IS_IOS ? 110 : 0,
          paddingTop: filteredReviews.length > 0 ? 16 : 0, 
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text
              style={{ color: Colors.grey, fontFamily: fonts.interRegular }}
            >
              No reviews found
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  /** Rating Section **/
  ratingSection: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftRating: { alignItems: "center", marginRight: 12 },
  avgRating: { fontSize: 30, fontFamily: fonts.interSemibold, color: "#000" },
  totalReviews: {
    fontSize: 16,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
    marginTop: 4,
  },
  rightBars: {},
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  starText: {
    width: 16,
    fontSize: 11,
    marginRight: 6,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
  },
  barBackground: {
    height: 6,
    backgroundColor: "#E1E6EB",
    borderRadius: 4,
    overflow: "hidden",
    width: 172,
  },
  barFill: {
    height: 6,
    backgroundColor: "#9C9BA6",
    borderRadius: 4,
  },

  /** Filters **/
  filterBtn: {
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.filterBg,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  activeBtn: { backgroundColor: Colors.orange },
  filterText: {
    color: Colors.title,
    fontSize: 16,
    fontFamily: fonts.interRegular,
    lineHeight:20
  },
  activeText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: fonts.interMedium,
  },
  scrollContent: { paddingVertical: 8 },
  starFilterRow: { flexDirection: "row", alignItems: "center" },
  starIcon: { width: 12, height: 12, marginLeft: 4, resizeMode: "contain" },

  /** Review Cards **/
  reviewCard: { paddingVertical: 20 },
  reviewBorder: { borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  nameRow: { alignItems: "center" },
  name: { fontFamily: fonts.interSemibold, color: Colors.title, fontSize: 14 },
  date: { fontSize: 12, color: Colors.grey, fontFamily: fonts.interMedium },
  reviewText: {
    fontSize: 13,
    color: Colors.grey,
    letterSpacing: 1,
    fontFamily: fonts.interRegular,
    marginTop: 8,
    lineHeight: 20,
  },

  /** Stars **/
  starRow: { flexDirection: "row" },
  starWrapper: { marginVertical: 4 },
  star: { width: 21, height: 21, marginRight: 2 },
});

export default ReviewsScreen;
