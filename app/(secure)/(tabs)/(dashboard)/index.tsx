import CommonButton from "@/components/CommonButton";
import HostelCard from "@/components/HostelCard";
import OfflineModal from "@/components/OfflineModal";
import TiffinCard from "@/components/TiffinCard";
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
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS_PER_PAGE = 10;
const SCROLL_BOTTOM_PADDING = { paddingBottom: IS_IOS ? 120 : 20 };

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
    tiffinServices, // ✅ Add tiffin services
    getAllHostelServices,
    getAllTiffinServices, // ✅ Add tiffin method
    getTotalServicesCount,
    totalServicesCount,
    getRequestedServicesCount,
    requestedServicesCount,
    getAcceptedServicesCount,
    acceptedServicesCount,
    getCancelledServicesCount,
    cancelledServicesCount,
    getReviewsSummary,
    overallRating,
    totalReviews,
    pagination,
    updateHostelServiceOnlineStatus,
    getEarningsAnalytics,
    earningsAnalyticsData,
  } = useServiceStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const isTiffinProvider = useMemo(
    () => userServiceType === "tiffin_provider",
    [userServiceType]
  );

  const profileImage = useMemo(
    () => (isTiffinProvider ? Images.user : { uri: user?.profileImage }),
    [isTiffinProvider, user?.profileImage]
  );

  const headerTitle = useMemo(
    () => (isTiffinProvider ? user?.name : user?.fullName || ""),
    [isTiffinProvider, user?.fullName, user?.name]
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

  // ✅ Get the correct services based on user type
  const currentServices = useMemo(() => {
    return isTiffinProvider ? tiffinServices : hostelServices;
  }, [isTiffinProvider, tiffinServices, hostelServices]);

  // Separate online and offline services
  const onlineServices = useMemo(() => {
    if (!currentServices) return [];
    return currentServices.filter(
      (service: any) => service.isAvailable === true
    );
  }, [currentServices]);

  const offlineServices = useMemo(() => {
    if (!currentServices) return [];
    return currentServices.filter(
      (service: any) => service.isAvailable === false
    );
  }, [currentServices]);

  // Filter ONLY online services for search and filter
  const filteredOnlineServices = useMemo(() => {
    let filtered = [...onlineServices];

    // Apply filter by service type (hostel type or tiffin food type)
    if (selectedFilter !== "all") {
      if (isTiffinProvider) {
        filtered = filtered.filter(
          (service: any) => service.foodType === selectedFilter
        );
      } else {
        filtered = filtered.filter(
          (service: any) => service.hostelType === selectedFilter
        );
      }
    }

    return filtered;
  }, [onlineServices, selectedFilter, isTiffinProvider]);

  const totalOnlineServices = useMemo(
    () => filteredOnlineServices?.length || 0,
    [filteredOnlineServices]
  );

  const offlineServicesCount = useMemo(
    () => offlineServices?.length || 0,
    [offlineServices]
  );

  const serviceCountText = useMemo(
    () =>
      `${totalOnlineServices} service${totalOnlineServices !== 1 ? "s" : ""}`,
    [totalOnlineServices]
  );

  const displayRating = useMemo(() => {
    return overallRating > 0 ? overallRating.toFixed(1) : "0.0";
  }, [overallRating]);

  const displayReviewCount = useMemo(() => {
    return `(${totalReviews})`;
  }, [totalReviews]);

  const loadData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        if (isTiffinProvider) {
          await Promise.all([
            getAllTiffinServices(page, ITEMS_PER_PAGE),
            getUserProfile(userServiceType),
            getTotalServicesCount(),
            getRequestedServicesCount(),
            getAcceptedServicesCount(),
            getCancelledServicesCount(),
            getReviewsSummary(),
            getEarningsAnalytics(userServiceType),
          ]);
        } else {
          await Promise.all([
            getAllHostelServices(page, ITEMS_PER_PAGE),
            getUserProfile(userServiceType),
            getTotalServicesCount(),
            getRequestedServicesCount(),
            getAcceptedServicesCount(),
            getCancelledServicesCount(),
            getReviewsSummary(),
            getEarningsAnalytics(userServiceType),
          ]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      getAllHostelServices,
      getAllTiffinServices,
      getUserProfile,
      userServiceType,
      getTotalServicesCount,
      getRequestedServicesCount,
      getAcceptedServicesCount,
      getCancelledServicesCount,
      getReviewsSummary,
      getEarningsAnalytics,
      isTiffinProvider,
    ]
  );

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

  const handleToggleOffline = useCallback(() => {
    setShowOfflineModal(true);
  }, []);

  const handleManageService = useCallback(() => {
    if (isTiffinProvider) {
      router.push("/(secure)/(tabs)/(dashboard)/service");
    }
  }, [isTiffinProvider]);

  const handleAddService = useCallback(() => {
    const route = isTiffinProvider
      ? "/(secure)/(service)/addNewService"
      : "/(secure)/(hostelService)/addNewHostelService";
    router.push(route);
  }, [isTiffinProvider]);

  const handleViewEarnings = useCallback((userServiceType: string) => {
    router.push("/(secure)/(tabs)/earnings");
  }, []);

  const handleViewReviews = useCallback(() => {
    router.push("/review");
  }, []);

  const handleOfflineSuccess = useCallback(() => {
    setShowOfflineModal(false);
    loadData(currentPage);
  }, [loadData, currentPage]);

  const handleGoOnline = useCallback(
    async (serviceId: string, serviceName: string) => {
      Alert.alert(
        "Bring Service Online",
        `Are you sure you want to bring "${serviceName}" back online?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes, Go Online",
            style: "default",
            onPress: async () => {
              setLoading(true);
              try {
                const response = await updateHostelServiceOnlineStatus([
                  serviceId,
                ]);

                if (response.success) {
                  Alert.alert("Success", "Service is now online!", [
                    {
                      text: "OK",
                      onPress: () => {
                        loadData(currentPage);
                      },
                    },
                  ]);
                } else {
                  throw new Error(
                    response.error || "Failed to bring service online"
                  );
                }
              } catch (error: any) {
                console.error("❌ Error bringing service online:", error);
                Alert.alert(
                  "Error",
                  error?.message ||
                    "Failed to bring service online. Please try again."
                );
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    },
    [currentPage, loadData, updateHostelServiceOnlineStatus]
  );

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

  const renderPagination = useCallback(() => {
    if (!pagination || pagination.totalCount <= ITEMS_PER_PAGE) return null;

    const {
      currentPage: current,
      totalPages,
      hasNextPage,
      hasPrevPage,
    } = pagination;

    return (
      <View style={styles.paginationContainer}>
        <PaginationButton
          onPress={() => handlePageChange(current - 1)}
          disabled={!hasPrevPage}
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
          disabled={!hasNextPage}
          iconName="chevron-forward"
        />
      </View>
    );
  }, [pagination, handlePageChange]);

  const renderOnlineServices = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (isTiffinProvider) {
      // ✅ Render tiffin cards
      return filteredOnlineServices.map((tiffin: any) => (
        <TiffinCard
          key={tiffin._id}
          tiffin={tiffin}
          onEditPress={() => {
            router.push({
              pathname: "/(secure)/(service)/addNewService",
              params: {
                mode: "edit",
                tiffinId: tiffin._id,
              },
            });
          }}
        />
      ));
    }

    // ✅ Render hostel cards
    return filteredOnlineServices.map((hostel: any) => (
      <HostelCard
        hostel={hostel}
        key={hostel._id}
        onEditPress={() => {
          router.push({
            pathname: "/(secure)/(hostelService)/addNewHostelService",
            params: {
              mode: "edit",
              hostelId: hostel._id,
            },
          });
        }}
      />
    ));
  }, [loading, isTiffinProvider, filteredOnlineServices]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // ✅ Get service name based on type
  const getServiceName = (service: any) => {
    return isTiffinProvider ? service.tiffinName : service.hostelName;
  };

  useEffect(() => {
    loadData(1);
  }, [userServiceType]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={profileImage} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{headerTitle}</Text>
          <TouchableOpacity onPress={handleManageService}>
            <Text style={styles.subtitle}>{headerSubtitle}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.onlineButton}
          onPress={handleToggleOffline}
        >
          <Text style={styles.onlineButtonText}>Go Offline</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={SCROLL_BOTTOM_PADDING}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <StatsCard {...statsConfig[0]} />
          <StatsCard {...statsConfig[1]} />
        </View>

        <View style={styles.statsRowLast}>
          <StatsCard {...statsConfig[2]} />
          <StatsCard {...statsConfig[3]} />
        </View>

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
              onPress={() => handleViewEarnings(userServiceType)}
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image source={Images.total} style={styles.icon16} />
            <Text style={styles.sectionTitle}>Earnings Overview</Text>
          </View>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsValue}>
              {earningsAnalyticsData?.totalEarnings}
            </Text>
            <Text style={styles.earningsChange}>
              {earningsAnalyticsData?.percentageChange}%
            </Text>
          </View>
          <View style={styles.earningsRowSecond}>
            <Text style={styles.subText}>{earningsAnalyticsData?.period}</Text>
            <Text style={styles.subText}>vs last week</Text>
          </View>
        </View>

        <View style={styles.reviewBox}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewTitle}>Reviews</Text>
            <TouchableOpacity onPress={handleViewReviews}>
              <Text style={styles.linkText}>See All Reviews</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewRow}>
            <Image source={Images.star} style={styles.icon20} />
            <Text style={styles.reviewScore}>{displayRating}</Text>
            <Text style={styles.subText}>{displayReviewCount}</Text>
          </View>
        </View>

        {/* Online Services Section */}
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceTitle}>{serviceTitle} (Online)</Text>
          <Text style={styles.serviceCount}>{serviceCountText}</Text>
        </View>

        {renderOnlineServices}

        {renderPagination()}

        {/* Offline Services Section */}
        {offlineServicesCount > 0 && (
          <>
            <View style={styles.offlineServicesHeader}>
              <View style={styles.offlineHeaderLeft}>
                <Ionicons name="pause-circle" size={20} color={Colors.red} />
                <Text style={styles.offlineServicesTitle}>
                  Offline Services
                </Text>
              </View>
              <Text style={styles.offlineServicesCount}>
                {offlineServicesCount} offline
              </Text>
            </View>

            {offlineServices.map((service: any) => {
              const serviceName = getServiceName(service);

              return (
                <View key={service._id} style={styles.offlineServiceWrapper}>
                  {isTiffinProvider ? (
                    <TiffinCard
                      tiffin={service}
                      onEditPress={() => {
                        router.push({
                          pathname: "/(secure)/(service)/addNewService",
                          params: {
                            mode: "edit",
                            tiffinId: service._id,
                          },
                        });
                      }}
                    />
                  ) : (
                    <HostelCard
                      hostel={service}
                      onEditPress={() => {
                        router.push({
                          pathname:
                            "/(secure)/(hostelService)/addNewHostelService",
                          params: {
                            mode: "edit",
                            hostelId: service._id,
                          },
                        });
                      }}
                    />
                  )}

                  {/* Go Online Button */}
                  <TouchableOpacity
                    style={styles.goOnlineButton}
                    onPress={() => handleGoOnline(service._id, serviceName)}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <>
                        <Ionicons
                          name="play-circle"
                          size={20}
                          color={Colors.white}
                        />
                        <Text style={styles.goOnlineButtonText}>
                          Bring Online
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Offline Info Card */}
                  <View style={styles.offlineInfoCard}>
                    {service.offlineDetails?.reason && (
                      <View style={styles.offlineInfoRow}>
                        <Ionicons
                          name="information-circle"
                          size={16}
                          color={Colors.orange}
                        />
                        <Text style={styles.offlineInfoLabel}>Reason:</Text>
                        <Text style={styles.offlineInfoValue}>
                          {service.offlineDetails.reason}
                        </Text>
                      </View>
                    )}

                    {service.offlineDetails?.comeBackOption && (
                      <View style={styles.offlineInfoRow}>
                        <Ionicons
                          name="time"
                          size={16}
                          color={Colors.primary}
                        />
                        <Text style={styles.offlineInfoLabel}>Back in:</Text>
                        <Text style={styles.offlineInfoValue}>
                          {service.offlineDetails.comeBackOption}
                        </Text>
                      </View>
                    )}

                    {service.offlineDetails?.offlineAt && (
                      <View style={styles.offlineInfoRow}>
                        <Ionicons
                          name="calendar"
                          size={16}
                          color={Colors.grey}
                        />
                        <Text style={styles.offlineInfoLabel}>
                          Offline since:
                        </Text>
                        <Text style={styles.offlineInfoValue}>
                          {formatDate(service.offlineDetails.offlineAt)}
                        </Text>
                      </View>
                    )}

                    {service.offlineDetails?.offlineType && (
                      <View style={styles.offlineInfoRow}>
                        <Ionicons
                          name="options"
                          size={16}
                          color={Colors.grey}
                        />
                        <Text style={styles.offlineInfoLabel}>Type:</Text>
                        <Text style={styles.offlineInfoValue}>
                          {service.offlineDetails.offlineType === "immediate"
                            ? "Immediate"
                            : "Scheduled"}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </>
        )}

        <CommonButton title="+ Add New Service" onPress={handleAddService} />
      </ScrollView>

      <OfflineModal
        visible={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        onSuccess={handleOfflineSuccess}
      />
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
    marginBottom: 24,
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
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
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

  // Offline Services Styles
  offlineServicesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: Colors.lightGrey,
  },
  offlineHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  offlineServicesTitle: {
    fontFamily: fonts.interSemibold,
    fontSize: 16,
    color: Colors.red,
  },
  offlineServicesCount: {
    fontFamily: fonts.interMedium,
    fontSize: 13,
    color: Colors.red,
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlineServiceWrapper: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFE5E5",
    backgroundColor: "#FFF9F9",
    padding: 12,
  },
  goOnlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    marginTop: 12,
  },
  goOnlineButtonText: {
    fontSize: 15,
    fontFamily: fonts.interSemibold,
    color: Colors.white,
  },
  offlineInfoCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  offlineInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  offlineInfoLabel: {
    fontSize: 13,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
    minWidth: 90,
  },
  offlineInfoValue: {
    fontSize: 13,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    flex: 1,
  },

  icon16: { height: 16, width: 16 },
  icon20: { height: 20, width: 20, marginBottom: 4 },
  icon24: { height: 24, width: 24 },
});
