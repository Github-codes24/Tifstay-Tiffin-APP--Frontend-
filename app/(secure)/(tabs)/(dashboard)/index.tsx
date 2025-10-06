import CommonButton from "@/components/CommonButton";
import TiffinCard from "@/components/CommonServiceCard";
import HostelCard from "@/components/HostelCard";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { IS_IOS } from "@/constants/Platform";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import useServiceStore from "@/store/serviceStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Constants
const ITEMS_PER_PAGE = 10;
const SCROLL_BOTTOM_PADDING = { paddingBottom: IS_IOS ? 120 : 20 };

// Extracted Components for better performance
const StatsCard = React.memo<{
  icon: any;
  count: number;
  label: string;
  color: string;
}>(function StatsCard({ icon, count, label, color }) {
  return (
    <View style={styles.card}>
      <Image source={icon} style={styles.icon24} />
      <Text style={[styles.cardNumber, { color }]}>{count}</Text>
      <Text style={[styles.cardText, { color }]}>{label}</Text>
    </View>
  );
});

const PaginationButton = React.memo<{
  onPress: () => void;
  disabled: boolean;
  iconName: "chevron-back" | "chevron-forward";
}>(function PaginationButton({ onPress, disabled, iconName }) {
  return (
    <TouchableOpacity
      style={[
        styles.paginationButton,
        disabled && styles.paginationButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons
        name={iconName}
        size={20}
        color={disabled ? Colors.grey : Colors.primary}
      />
    </TouchableOpacity>
  );
});

const PageNumber = React.memo<{
  page: number;
  isActive: boolean;
  onPress: () => void;
}>(function PageNumber({ page, isActive, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.pageNumber, isActive && styles.pageNumberActive]}
      onPress={onPress}
    >
      <Text
        style={[styles.pageNumberText, isActive && styles.pageNumberTextActive]}
      >
        {page}
      </Text>
    </TouchableOpacity>
  );
});

export default function ServiceOfflineScreen() {
  const { getUserProfile, user, userServiceType } = useAuthStore();
  const {
    hostelServices,
    getAllHostelServices,
    getTotalServicesCount,
    totalServicesCount,
    getRequestedServicesCount,
    requestedServicesCount,
    getAcceptedServicesCount,
    acceptedServicesCount,
    getCancelledServicesCount,
    cancelledServicesCount,
    pagination,
  } = useServiceStore();

  const [isOnline, setIsOnline] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const isTiffinProvider = useMemo(
    () => userServiceType === "tiffin_provider",
    [userServiceType]
  );

  // Memoized values
  const profileImage = useMemo(
    () => (isTiffinProvider ? Images.user : { uri: user?.profileImage }),
    [isTiffinProvider, user?.profileImage]
  );

  const headerTitle = useMemo(
    () =>
      isTiffinProvider ? "Maharashtrian Ghar Ka Khana" : user?.fullName || "",
    [isTiffinProvider, user?.fullName]
  );

  const headerSubtitle = useMemo(
    () =>
      isTiffinProvider
        ? "Manage your tiffin services"
        : "Manage your hostel properties",
    [isTiffinProvider]
  );

  const serviceTitle = useMemo(
    () => (isTiffinProvider ? "My Tiffin/Restaurant" : "My PG/Hostel"),
    [isTiffinProvider]
  );

  const totalServices = useMemo(
    () => pagination?.totalCount || hostelServices?.length || 0,
    [pagination?.totalCount, hostelServices?.length]
  );

  const serviceCountText = useMemo(
    () => `${totalServices} service${totalServices !== 1 ? "s" : ""}`,
    [totalServices]
  );

  // Optimized data loading with Promise.all
  const loadData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        await Promise.all([
          getAllHostelServices(page, ITEMS_PER_PAGE),
          getUserProfile(userServiceType),
          getTotalServicesCount(),
          getRequestedServicesCount(),
          getAcceptedServicesCount(),
          getCancelledServicesCount(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      getAllHostelServices,
      getUserProfile,
      userServiceType,
      getTotalServicesCount,
      getRequestedServicesCount,
      getAcceptedServicesCount,
      getCancelledServicesCount,
    ]
  );

  // Optimized page change handler
  const handlePageChange = useCallback(
    (page: number) => {
      if (
        page !== currentPage &&
        page >= 1 &&
        page <= (pagination?.totalPages || 1)
      ) {
        setCurrentPage(page);
        loadData(page);
      }
    },
    [currentPage, pagination?.totalPages, loadData]
  );

  // Optimized toggle handler
  const handleToggleOnline = useCallback(() => {
    const newOnlineState = !isOnline;
    setIsOnline(newOnlineState);
    if (newOnlineState && isTiffinProvider) {
      router.push("/(secure)/(tabs)/(dashboard)/service");
    }
  }, [isOnline, isTiffinProvider]);

  // Navigation handlers
  const handleAddService = useCallback(() => {
    const route = isTiffinProvider
      ? "/(secure)/(service)/addNewService"
      : "/(secure)/(hostelService)/addNewHostelService";
    router.push(route);
  }, [isTiffinProvider]);

  const handleViewEarnings = useCallback(() => {
    router.push("/(secure)/(tabs)/earnings");
  }, []);

  const handleViewReviews = useCallback(() => {
    router.push("/review");
  }, []);

  // Stats configuration
  const statsConfig = useMemo(
    () => [
      {
        icon: isTiffinProvider ? Images.order : Images.hostel,
        count: totalServicesCount,
        label: isTiffinProvider ? "New Orders" : "Total Hostels",
        color: Colors.primary,
      },
      {
        icon: Images.req,
        count: requestedServicesCount,
        label: isTiffinProvider ? "Order Request" : "Request",
        color: Colors.orange,
      },
      {
        icon: isTiffinProvider ? Images.complete : Images.bad,
        count: acceptedServicesCount,
        label: isTiffinProvider ? "Completed Orders" : "Accepted",
        color: Colors.green,
      },
      {
        icon: Images.cancel,
        count: cancelledServicesCount,
        label: isTiffinProvider ? "Canceled Orders" : "Canceled",
        color: Colors.red,
      },
    ],
    [
      isTiffinProvider,
      totalServicesCount,
      requestedServicesCount,
      acceptedServicesCount,
      cancelledServicesCount,
    ]
  );

  // Optimized pagination rendering
  const renderPagination = useCallback(() => {
    if (!pagination || pagination.totalCount <= ITEMS_PER_PAGE) return null;

    const { currentPage: current, totalPages, hasNext, hasPrev } = pagination;

    return (
      <View style={styles.paginationContainer}>
        <PaginationButton
          onPress={() => handlePageChange(current - 1)}
          disabled={!hasPrev}
          iconName="chevron-back"
        />

        <View style={styles.pageNumbersContainer}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PageNumber
              key={page}
              page={page}
              isActive={current === page}
              onPress={() => handlePageChange(page)}
            />
          ))}
        </View>

        <PaginationButton
          onPress={() => handlePageChange(current + 1)}
          disabled={!hasNext}
          iconName="chevron-forward"
        />
      </View>
    );
  }, [pagination, handlePageChange]);

  // Optimized service list rendering
  const renderServices = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (isTiffinProvider) {
      return <TiffinCard />;
    }

    return hostelServices?.map((hostel: any) => (
      <HostelCard hostel={hostel} key={hostel._id} />
    ));
  }, [loading, isTiffinProvider, hostelServices]);

  useEffect(() => {
    loadData(1);
  }, [userServiceType]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={profileImage} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{headerTitle}</Text>
          <Text style={styles.subtitle}>{headerSubtitle}</Text>
        </View>
        <TouchableOpacity
          style={styles.onlineButton}
          onPress={handleToggleOnline}
        >
          <Text style={styles.onlineButtonText}>
            {isOnline ? "Go Offline" : "Go Online"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      {!isOnline ? (
        <View style={styles.body}>
          <Text style={styles.infoText}>
            You have marked your service as offline
          </Text>
          <Image source={Images.storeclose} style={styles.shopImage} />
          <Text style={styles.footerText}>
            Your Service will be offline until you turn it on
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={SCROLL_BOTTOM_PADDING}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats */}
          <View style={styles.statsRow}>
            <StatsCard {...statsConfig[0]} />
            <StatsCard {...statsConfig[1]} />
          </View>

          <View style={styles.statsRowLast}>
            <StatsCard {...statsConfig[2]} />
            <StatsCard {...statsConfig[3]} />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image source={Images.watch} style={styles.icon16} />
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionButtonPrimary}
                onPress={handleAddService}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.actionText}>Add Service</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButtonOrange}
                onPress={handleViewEarnings}
              >
                <Ionicons
                  name="trending-up-outline"
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.actionText}>View Earnings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Earnings Overview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image source={Images.total} style={styles.icon16} />
              <Text style={styles.sectionTitle}>Earnings Overview</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsValue}>₹3250</Text>
              <Text style={styles.earningsChange}>+18%</Text>
            </View>
            <View style={styles.earningsRowSecond}>
              <Text style={styles.subText}>{"This week's total"}</Text>
              <Text style={styles.subText}>vs last week</Text>
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.reviewBox}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewTitle}>Reviews</Text>
              <TouchableOpacity onPress={handleViewReviews}>
                <Text style={styles.linkText}>See All Reviews</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reviewRow}>
              <Image source={Images.star} style={styles.icon20} />
              <Text style={styles.reviewScore}>4.9</Text>
              <Text style={styles.subText}>(25 reviews)</Text>
            </View>
          </View>

          {/* Services */}
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceTitle}>{serviceTitle}</Text>
            <Text style={styles.serviceCount}>{serviceCountText}</Text>
          </View>

          {renderServices}

          {/* Pagination */}
          {renderPagination()}

          <CommonButton title="+ Add New Service" onPress={handleAddService} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  header: { flexDirection: "row", alignItems: "center", padding: 15 },
  logo: { width: 40, height: 40, borderRadius: 24, marginRight: 10 },
  headerText: { flex: 1 },
  title: { fontSize: 16, fontFamily: fonts.interMedium, color: Colors.title },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },

  onlineButton: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  onlineButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: fonts.interMedium,
  },

  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    fontFamily: fonts.interMedium,
    color: Colors.title,
    marginBottom: 20,
  },
  shopImage: { width: 208, height: 208, marginBottom: 20 },
  footerText: {
    fontSize: 16,
    fontFamily: fonts.interMedium,
    color: Colors.title,
    marginBottom: 20,
    textAlign: "center",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  statsRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 10,
  },
  card: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    alignItems: "center",
  },
  cardNumber: {
    fontSize: 36,
    fontFamily: fonts.interSemibold,
    marginTop: 6,
  },
  cardText: { fontSize: 13, fontFamily: fonts.interRegular, marginTop: 2 },

  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    padding: 16,
    marginBottom: 24,
    marginHorizontal: 6,
  },
  sectionHeader: { flexDirection: "row", gap: 5, alignItems: "center" },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 20,
  },
  actionButtonPrimary: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.primary,
  },
  actionButtonOrange: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.orange,
  },
  actionText: {
    color: Colors.white,
    fontFamily: fonts.interSemibold,
    fontSize: 14,
  },

  earningsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  earningsRowSecond: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
  },
  earningsValue: {
    fontSize: 30,
    fontFamily: fonts.interSemibold,
    color: Colors.orange,
  },
  earningsChange: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  subText: {
    fontSize: 13,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
    marginTop: 4,
  },

  reviewBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 26,
    paddingHorizontal: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewTitle: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.title,
  },
  linkText: {
    color: Colors.orange,
    fontFamily: fonts.interRegular,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  reviewRow: { flexDirection: "row", alignItems: "center" },
  reviewScore: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    color: "#FCA613",
    marginLeft: 6,
    marginRight: 4,
  },

  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 16,
  },
  serviceTitle: {
    fontFamily: fonts.interSemibold,
    fontSize: 16,
    color: Colors.title,
  },
  serviceCount: {
    fontFamily: fonts.interRegular,
    fontSize: 13,
    color: Colors.grey,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 12,
  },

  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Pagination Styles
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

  icon16: { height: 16, width: 16 },
  icon20: { height: 20, width: 20, marginBottom: 4 },
  icon24: { height: 24, width: 24 },
});
