import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { IS_IOS } from "@/constants/Platform";
import { fonts } from "@/constants/typography";
import hostelApiService from "@/services/hostelApiService";
import tiffinApiService from "@/services/tiffinApiServices";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  DimensionValue,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ITEMS_PER_PAGE = 10;

type FilterType = "all" | "positive" | "negative" | "5" | "4" | "3" | "2" | "1";

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Positive", value: "positive" },
  { label: "Negative", value: "negative" },
  { label: "5", value: "5" },
  { label: "4", value: "4" },
  { label: "3", value: "3" },
  { label: "2", value: "2" },
  { label: "1", value: "1" },
];

interface RatingDistribution {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
}

interface ReviewItem {
  _id: string;
  review: string;
  rating: number;
  reviewDate: string;
  guestName: string;
  guestImage: string | null;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

const ReviewsScreen = () => {
  const params = useLocalSearchParams();
  const hostelId = params.hostelId as string | undefined;
  const tiffinId = params.tiffinId as string | undefined;
  const { userServiceType } = useAuthStore();

  const [active, setActive] = useState<FilterType>("all");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [overallRating, setOverallRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] =
    useState<RatingDistribution>({
      "1": "0.0",
      "2": "0.0",
      "3": "0.0",
      "4": "0.0",
      "5": "0.0",
    });
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 0,
    limit: ITEMS_PER_PAGE,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  });

  const isTiffinService = userServiceType === "tiffin_provider";

  // Convert filter type to API filter value
  const getFilterValue = useCallback((filter: FilterType): string => {
    switch (filter) {
      case "all":
        return "all";
      case "positive":
        return "4,5";
      case "negative":
        return "1,2,3";
      default:
        return filter; // "1", "2", "3", "4", "5"
    }
  }, []);

  // Calculate bar widths based on distribution (now using percentages)
  const getBarWidth = useCallback(
    (star: number): DimensionValue => {
      const percentage =
        ratingDistribution[star.toString() as keyof RatingDistribution];
      return `${percentage}%`;
    },
    [ratingDistribution]
  );

  // Fetch reviews based on filter
  const fetchReviews = useCallback(
    async (page: number, filter: FilterType) => {
      setLoading(true);
      try {
        const filterValue = getFilterValue(filter);
        let response;

        // ✅ If specific hostel or tiffin ID provided
        if (hostelId) {
          response = await hostelApiService.getReviewsByHostelId(
            hostelId,
            page,
            ITEMS_PER_PAGE,
            filterValue
          );
        } else if (tiffinId) {
          response = await tiffinApiService.getReviewsByTiffinId(
            tiffinId,
            page,
            ITEMS_PER_PAGE,
            filterValue
          );
        } else {
          // ✅ Get all reviews based on service type
          if (isTiffinService) {
            response = await tiffinApiService.getReviewsSummary(
              page,
              ITEMS_PER_PAGE,
              filterValue
            );
          } else {
            response = await hostelApiService.getReviewsSummary(
              page,
              ITEMS_PER_PAGE,
              filterValue
            );
          }
        }

        if (response.success && response.data) {
          // ✅ Handle response structure
          const data = response.data.data || response.data;

          setReviews(data.reviews || []);
          setOverallRating(parseFloat(data.overallRating) || 0);
          setTotalReviews(data.totalReviews || 0);
          setRatingDistribution(
            data.ratingDistribution || {
              "1": "0.0",
              "2": "0.0",
              "3": "0.0",
              "4": "0.0",
              "5": "0.0",
            }
          );
          setPagination(
            data.pagination || {
              currentPage: 1,
              totalPages: 0,
              limit: ITEMS_PER_PAGE,
              hasNextPage: false,
              hasPrevPage: false,
              nextPage: null,
              prevPage: null,
            }
          );
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    },
    [hostelId, tiffinId, isTiffinService, getFilterValue]
  );

  useEffect(() => {
    fetchReviews(1, active);
    setCurrentPage(1);
  }, [active, hostelId, tiffinId, isTiffinService]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== currentPage && page >= 1 && page <= pagination.totalPages) {
        setCurrentPage(page);
        fetchReviews(page, active);
      }
    },
    [currentPage, pagination.totalPages, active, fetchReviews]
  );

  const handleFilterChange = useCallback((filter: FilterType) => {
    setActive(filter);
  }, []);

  const renderStars = useCallback((count: number) => {
    return (
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
  }, []);

  const renderReview = useCallback(
    ({ item, index }: { item: ReviewItem; index: number }) => (
      <View
        style={[
          styles.reviewCard,
          index !== reviews.length - 1 && styles.reviewBorder,
        ]}
      >
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <Image
              source={item.guestImage ? { uri: item.guestImage } : Images.user}
              style={styles.avatar}
            />
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.guestName || "Anonymous"}</Text>
              <View style={styles.starWrapper}>{renderStars(item.rating)}</View>
            </View>
          </View>
          <Text style={styles.date}>{item.reviewDate}</Text>
        </View>
        <Text style={styles.reviewText}>{item.review}</Text>
      </View>
    ),
    [reviews.length, renderStars]
  );

  const renderPagination = useMemo(() => {
    if (pagination.totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            !pagination.hasPrevPage && styles.paginationButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={pagination.hasPrevPage ? Colors.primary : Colors.grey}
          />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pageNumbersContainer}
        >
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <TouchableOpacity
                key={page}
                style={[
                  styles.pageNumber,
                  currentPage === page && styles.pageNumberActive,
                ]}
                onPress={() => handlePageChange(page)}
              >
                <Text
                  style={[
                    styles.pageNumberText,
                    currentPage === page && styles.pageNumberTextActive,
                  ]}
                >
                  {page}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.paginationButton,
            !pagination.hasNextPage && styles.paginationButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={pagination.hasNextPage ? Colors.primary : Colors.grey}
          />
        </TouchableOpacity>
      </View>
    );
  }, [pagination, currentPage, handlePageChange]);

  return (
    <View style={styles.container}>
      {/* Rating Overview */}
      <View style={styles.ratingSection}>
        <View style={styles.leftRating}>
          <Text style={styles.avgRating}>
            {overallRating > 0 ? overallRating.toFixed(1) : "0.0"}
          </Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Image
                key={i}
                source={Images.star}
                style={[
                  styles.star,
                  {
                    tintColor:
                      i <= Math.round(overallRating) ? "#FCA613" : "#F5F5F5",
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.totalReviews}>({totalReviews})</Text>
        </View>

        <View style={styles.rightBars}>
          {[5, 4, 3, 2, 1].map((star) => (
            <View key={star} style={styles.barRow}>
              <Text style={styles.starText}>{star}</Text>
              <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: getBarWidth(star) }]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter, index) => {
          const isStarFilter = ["5", "4", "3", "2", "1"].includes(filter.value);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterBtn,
                active === filter.value && styles.activeBtn,
              ]}
              onPress={() => handleFilterChange(filter.value)}
            >
              {isStarFilter ? (
                <View style={styles.starFilterRow}>
                  <Text
                    style={[
                      styles.filterText,
                      active === filter.value && styles.activeText,
                    ]}
                  >
                    {filter.label}
                  </Text>
                  <Image
                    source={Images.star}
                    style={[
                      styles.starIcon,
                      {
                        tintColor:
                          active === filter.value ? Colors.white : Colors.grey,
                      },
                    ]}
                  />
                </View>
              ) : (
                <Text
                  style={[
                    styles.filterText,
                    active === filter.value && styles.activeText,
                  ]}
                >
                  {filter.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Reviews */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={renderReview}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: IS_IOS ? 110 : 20,
            paddingTop: reviews.length > 0 ? 16 : 0,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="chatbubble-outline"
                  size={48}
                  color={Colors.grey}
                />
              </View>
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptySubtitle}>
                {active !== "all"
                  ? `No ${active} reviews found. Try a different filter.`
                  : "Be the first to receive a review!"}
              </Text>
            </View>
          }
          ListFooterComponent={renderPagination}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  /** Rating Section **/
  ratingSection: {
    flexDirection: "row",
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
  rightBars: { flex: 1 },
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
    flex: 1,
    height: 6,
    backgroundColor: "#E1E6EB",
    borderRadius: 4,
    overflow: "hidden",
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
    lineHeight: 20,
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
  nameRow: { alignItems: "flex-start" },
  name: { fontFamily: fonts.interSemibold, color: Colors.title, fontSize: 14 },
  date: { fontSize: 12, color: Colors.grey, fontFamily: fonts.interMedium },
  reviewText: {
    fontSize: 13,
    color: Colors.grey,
    letterSpacing: 0.5,
    fontFamily: fonts.interRegular,
    marginTop: 8,
    lineHeight: 20,
  },

  /** Stars **/
  starRow: { flexDirection: "row" },
  starWrapper: { marginVertical: 4 },
  star: { width: 21, height: 21, marginRight: 2 },

  /** Loading & Empty States **/
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },

  /** Pagination **/
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
  },
  paginationButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  paginationButtonDisabled: {
    borderColor: Colors.lightGrey,
    backgroundColor: "#F5F5F5",
  },
  pageNumbersContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 12,
  },
  pageNumber: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  pageNumberActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pageNumberText: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  pageNumberTextActive: {
    color: Colors.white,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    textAlign: "center",
  },
});

export default ReviewsScreen;
