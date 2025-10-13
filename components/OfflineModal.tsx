import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import useServiceStore from "@/store/serviceStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SelectionPopup from "./SelectionPopup";

const HOSTEL_TYPES = [
  "All Types",
  "Boys",
  "Girls",
  "Co-living",
  "PG",
  "Hostel",
];

interface OfflineModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isTiffinProvider: boolean;
}

const OfflineModal: React.FC<OfflineModalProps> = ({
  visible,
  onClose,
  onSuccess,
  isTiffinProvider,
}) => {
  const {
    hostelServicesList,
    getHostelServicesList,
    updateHostelServiceOfflineStatus,
    updateHostelServiceOnlineStatus,
    getOfflineReasons,
    getComebackOptions,
  } = useServiceStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All Types");
  const [loading, setLoading] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // API fetched data
  const [offlineReasons, setOfflineReasons] = useState<any[]>([]);
  const [comebackOptions, setComebackOptions] = useState<any[]>([]);

  // Popup states
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [showComebackPopup, setShowComebackPopup] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedServiceName, setSelectedServiceName] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedComebackOption, setSelectedComebackOption] =
    useState<string>("");
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (visible) {
      fetchInitialData();
    }
  }, [visible]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        getHostelServicesList(1, 100),
        fetchOfflineReasons(),
        fetchComebackOptions(),
      ]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfflineReasons = async () => {
    try {
      const response = await getOfflineReasons("immediate");

      if (response.success && response.data?.data?.reasons) {
        const reasons = response.data.data.reasons;

        const formattedReasons = reasons.map((reason: string) => ({
          value: reason,
          label: reason,
          icon: getReasonIcon(reason),
        }));

        setOfflineReasons(formattedReasons);
      } else {
        console.warn("⚠️ Using fallback offline reasons");
        setOfflineReasons([
          {
            value: "Emergency maintenance",
            label: "Emergency maintenance",
            icon: "warning",
          },
          {
            value: "Scheduled maintenance",
            label: "Scheduled maintenance",
            icon: "calendar",
          },
          {
            value: "Vacation/Holiday",
            label: "Vacation/Holiday",
            icon: "sunny",
          },
          {
            value: "Temporary closure",
            label: "Temporary closure",
            icon: "close-circle",
          },
          { value: "Staff shortage", label: "Staff shortage", icon: "people" },
          { value: "Other", label: "Other", icon: "ellipsis-horizontal" },
        ]);
      }
    } catch (error) {
      console.error("❌ Error fetching offline reasons:", error);
      setOfflineReasons([
        {
          value: "Emergency maintenance",
          label: "Emergency maintenance",
          icon: "warning",
        },
        { value: "Vacation/Holiday", label: "Vacation/Holiday", icon: "sunny" },
        { value: "Staff shortage", label: "Staff shortage", icon: "people" },
        { value: "Other", label: "Other", icon: "ellipsis-horizontal" },
      ]);
    }
  };

  const fetchComebackOptions = async () => {
    try {
      const response = await getComebackOptions();

      if (response.success && response.data?.data?.comebackOptions) {
        const options = response.data.data.comebackOptions;

        const formattedOptions = options.map((option: string) => ({
          value: option,
          label: option,
          icon: getComebackIcon(option),
        }));

        setComebackOptions(formattedOptions);
      } else {
        console.warn("⚠️ Using fallback comeback options");
        setComebackOptions([
          { value: "30 minutes", label: "30 minutes", icon: "time-outline" },
          { value: "2 hours", label: "2 hours", icon: "time-outline" },
          {
            value: "Until I turn myself on",
            label: "Until I turn myself on",
            icon: "power-outline",
          },
          {
            value: "Tomorrow opening time",
            label: "Tomorrow opening time",
            icon: "sunny-outline",
          },
        ]);
      }
    } catch (error) {
      console.error("❌ Error fetching comeback options:", error);
      setComebackOptions([
        { value: "30 minutes", label: "30 minutes", icon: "time-outline" },
        { value: "2 hours", label: "2 hours", icon: "time-outline" },
        {
          value: "Until I turn myself on",
          label: "Until I turn myself on",
          icon: "power-outline",
        },
      ]);
    }
  };

  const getReasonIcon = (reason: string): string => {
    const iconMap: { [key: string]: string } = {
      "Emergency maintenance": "warning",
      "Scheduled maintenance": "calendar",
      "Vacation/Holiday": "sunny",
      "Festival / Holiday": "sunny",
      "Temporary closure": "close-circle",
      "Inventory/Supply issues": "cube",
      "Staff shortage": "people",
      "Kitchen closed today": "restaurant",
      "Delivery staff not available": "bicycle",
      "Near closing time": "time",
      "Renovation/Relocation": "construct",
      "permanently shut": "ban",
      "Going out of station": "airplane",
      Other: "ellipsis-horizontal",
    };
    return iconMap[reason] || "information-circle";
  };

  const getComebackIcon = (option: string): string => {
    const iconMap: { [key: string]: string } = {
      "30 minutes": "time-outline",
      "2 hours": "time-outline",
      "Tomorrow opening time": "sunny-outline",
      "Until I turn myself on": "power-outline",
    };
    return iconMap[option] || "time-outline";
  };

  // Separate online and offline services
  const onlineServices =
    hostelServicesList?.filter((service) => !service.isOffline) || [];
  const offlineServices =
    hostelServicesList?.filter((service) => service.isOffline === true) || [];

  // Apply filters
  const searchFilteredOnlineServices = onlineServices.filter((service) =>
    service.hostelName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchFilteredOfflineServices = offlineServices.filter((service) =>
    service.hostelName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOnlineServices =
    selectedFilter === "All Types"
      ? searchFilteredOnlineServices
      : searchFilteredOnlineServices.filter(
          (service) => service.hostelType === selectedFilter
        );

  const filteredOfflineServices =
    selectedFilter === "All Types"
      ? searchFilteredOfflineServices
      : searchFilteredOfflineServices.filter(
          (service) => service.hostelType === selectedFilter
        );

  // Handle service click - open reason popup
  const handleServiceClick = useCallback(
    (serviceId: string, serviceName: string) => {
      setSelectedServiceId(serviceId);
      setSelectedServiceName(serviceName);
      setSelectedReason("");
      setSelectedComebackOption("");
      setShowReasonPopup(true);
    },
    []
  );

  // Handle reason continue
  const handleReasonContinue = useCallback(() => {
    if (!selectedReason) {
      Alert.alert("Error", "Please select a reason");
      return;
    }
    setShowReasonPopup(false);
    setShowComebackPopup(true);
  }, [selectedReason]);

  // Handle comeback selection and API call
  const handleComebackContinue = useCallback(async () => {
    if (!selectedComebackOption) {
      Alert.alert("Error", "Please select when you'll be back");
      return;
    }

    setShowComebackPopup(false);
    setLoading(true);

    try {
      const offlineType: "immediate" | "scheduled" =
        selectedComebackOption === "Until I turn myself on"
          ? "scheduled"
          : "immediate";

      const payload = {
        hostelServiceIds: [selectedServiceId],
        offlineType,
        reason: selectedReason,
        comeBackOption: selectedComebackOption,
      };

      const response = await updateHostelServiceOfflineStatus(payload);

      if (response.success) {
        Alert.alert("Success", `"${selectedServiceName}" is now offline`, [
          {
            text: "OK",
            onPress: () => {
              fetchInitialData();
              onSuccess();
            },
          },
        ]);
      } else {
        throw new Error(response.error || "Failed to update offline status");
      }
    } catch (error: any) {
      console.error("❌ Error updating offline status:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to update offline status. Please try again."
      );
    } finally {
      setLoading(false);
      resetSelection();
    }
  }, [
    selectedServiceId,
    selectedServiceName,
    selectedReason,
    selectedComebackOption,
  ]);

  const handleBringOnline = async (serviceId: string, serviceName: string) => {
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
                      fetchInitialData();
                      onSuccess();
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
  };

  const resetSelection = () => {
    setSelectedServiceId("");
    setSelectedServiceName("");
    setSelectedReason("");
    setSelectedComebackOption("");
  };

  const resetModal = () => {
    setSearchQuery("");
    setSelectedFilter("All Types");
    resetSelection();
  };

  const handleClose = () => {
    if (!loading) {
      resetModal();
      onClose();
    }
  };

  const renderOnlineServiceItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => handleServiceClick(item._id, item.hostelName)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <View style={styles.serviceCardHeader}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.serviceCardName} numberOfLines={1}>
            {item.hostelName}
          </Text>
        </View>
        <Text style={styles.serviceCardType}>
          {item.hostelType || "Not specified"}
        </Text>
        <View style={styles.serviceCardFooter}>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.green} />
            <Text style={styles.statusBadgeText}>Online</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderOfflineServiceItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.offlineServiceCard}>
        <View style={styles.serviceCardHeader}>
          <View style={styles.offlineIndicator} />
          <Text style={styles.serviceCardName} numberOfLines={1}>
            {item.hostelName}
          </Text>
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineBadgeText}>Offline</Text>
          </View>
        </View>
        <Text style={styles.serviceCardType}>
          {item.hostelType || "Not specified"}
        </Text>

        {/* Offline Details */}
        <View style={styles.offlineDetailsCard}>
          {item.reason && (
            <View style={styles.offlineDetailRow}>
              <Ionicons
                name="information-circle"
                size={16}
                color={Colors.orange}
              />
              <Text style={styles.offlineDetailLabel}>Reason:</Text>
              <Text style={styles.offlineDetailValue}>{item.reason}</Text>
            </View>
          )}
          {item.offlineAt && (
            <View style={styles.offlineDetailRow}>
              <Ionicons name="calendar" size={16} color={Colors.grey} />
              <Text style={styles.offlineDetailLabel}>Since:</Text>
              <Text style={styles.offlineDetailValue}>{item.offlineAt}</Text>
            </View>
          )}
          {item.comeBackAt && (
            <View style={styles.offlineDetailRow}>
              <Ionicons name="time" size={16} color={Colors.primary} />
              <Text style={styles.offlineDetailLabel}>Back at:</Text>
              <Text style={styles.offlineDetailValue}>{item.comeBackAt}</Text>
            </View>
          )}
        </View>

        {/* Bring Online Button */}
        <TouchableOpacity
          style={styles.bringOnlineButton}
          onPress={() => handleBringOnline(item._id, item.hostelName)}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Ionicons name="play-circle" size={20} color={Colors.white} />
          <Text style={styles.bringOnlineButtonText}>Bring Online</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
      statusBarTranslucent={false}
    >
      <View style={[styles.fullScreenContainer, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            disabled={loading}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color={Colors.title} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Services</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={Colors.grey} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by service name..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={Colors.grey}
                editable={!loading}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={20} color={Colors.grey} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter Dropdown */}
          <View style={styles.filterSection}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons name="filter" size={20} color={Colors.primary} />
              <Text style={styles.filterButtonText}>{selectedFilter}</Text>
              <Ionicons
                name={showFilterDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.grey}
              />
            </TouchableOpacity>

            {showFilterDropdown && (
              <View style={styles.filterDropdown}>
                {HOSTEL_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      selectedFilter === type && styles.filterOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedFilter(type);
                      setShowFilterDropdown(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedFilter === type &&
                          styles.filterOptionTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                    {selectedFilter === type && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Services List */}
          <FlatList
            data={[{ key: "content" }]}
            renderItem={() => (
              <View style={styles.contentContainer}>
                {/* Online Services */}
                {filteredOnlineServices.length > 0 && (
                  <View style={styles.servicesSection}>
                    <View style={styles.sectionHeader}>
                      <View style={styles.sectionHeaderLeft}>
                        <View style={styles.sectionIconCircle}>
                          <Ionicons
                            name="power"
                            size={18}
                            color={Colors.green}
                          />
                        </View>
                        <Text style={styles.sectionTitle}>Online Services</Text>
                      </View>
                      <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>
                          {filteredOnlineServices.length}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.servicesGrid}>
                      {filteredOnlineServices.map((service) => (
                        <View key={service._id}>
                          {renderOnlineServiceItem({ item: service })}
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Offline Services */}
                {filteredOfflineServices.length > 0 && (
                  <View style={styles.servicesSection}>
                    <View style={styles.sectionHeader}>
                      <View style={styles.sectionHeaderLeft}>
                        <View
                          style={[
                            styles.sectionIconCircle,
                            styles.sectionIconCircleRed,
                          ]}
                        >
                          <Ionicons
                            name="pause-circle"
                            size={18}
                            color={Colors.red}
                          />
                        </View>
                        <Text
                          style={[styles.sectionTitle, styles.sectionTitleRed]}
                        >
                          Offline Services
                        </Text>
                      </View>
                      <View style={[styles.countBadge, styles.countBadgeRed]}>
                        <Text
                          style={[
                            styles.countBadgeText,
                            styles.countBadgeTextRed,
                          ]}
                        >
                          {filteredOfflineServices.length}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.servicesGrid}>
                      {filteredOfflineServices.map((service) => (
                        <View key={service._id}>
                          {renderOfflineServiceItem({ item: service })}
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Empty State */}
                {filteredOnlineServices.length === 0 &&
                  filteredOfflineServices.length === 0 && (
                    <View style={styles.emptyContainer}>
                      <View style={styles.emptyIconCircle}>
                        <Ionicons
                          name="search-outline"
                          size={48}
                          color={Colors.grey}
                        />
                      </View>
                      <Text style={styles.emptyTitle}>No services found</Text>
                      <Text style={styles.emptySubtitle}>
                        Try adjusting your search or filter criteria
                      </Text>
                    </View>
                  )}
              </View>
            )}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          </View>
        )}
      </View>

      {/* Reason Selection Popup */}
      <SelectionPopup
        visible={showReasonPopup}
        title="Reason for going offline"
        subtitle={`Why is "${selectedServiceName}" going offline?`}
        options={
          offlineReasons.length > 0
            ? offlineReasons
            : [
                {
                  value: "Emergency maintenance",
                  label: "Emergency maintenance",
                  icon: "warning",
                },
                {
                  value: "Vacation/Holiday",
                  label: "Vacation/Holiday",
                  icon: "sunny",
                },
                {
                  value: "Staff shortage",
                  label: "Staff shortage",
                  icon: "people",
                },
                { value: "Other", label: "Other", icon: "ellipsis-horizontal" },
              ]
        }
        selectedValue={selectedReason}
        onSelect={setSelectedReason}
        onBack={() => setShowReasonPopup(false)}
        onContinue={handleReasonContinue}
        continueText="Continue"
      />

      {/* Comeback Time Selection Popup */}
      <SelectionPopup
        visible={showComebackPopup}
        title="When would you come back?"
        subtitle={`Select when "${selectedServiceName}" will be back online`}
        options={
          comebackOptions.length > 0
            ? comebackOptions
            : [
                {
                  value: "30 minutes",
                  label: "30 minutes",
                  icon: "time-outline",
                },
                { value: "2 hours", label: "2 hours", icon: "time-outline" },
                {
                  value: "Until I turn myself on",
                  label: "Until I turn myself on",
                  icon: "power-outline",
                },
              ]
        }
        selectedValue={selectedComebackOption}
        onSelect={setSelectedComebackOption}
        onBack={() => {
          setShowComebackPopup(false);
          setShowReasonPopup(true);
        }}
        onContinue={handleComebackContinue}
        continueText="Go Offline"
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  mainContent: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: Colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.interRegular,
    color: Colors.title,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  filterButtonText: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  filterDropdown: {
    marginTop: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterOptionSelected: {
    backgroundColor: "#F0F7FF",
  },
  filterOptionText: {
    fontSize: 15,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  filterOptionTextSelected: {
    color: Colors.primary,
    fontFamily: fonts.interSemibold,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  servicesSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionIconCircleRed: {
    backgroundColor: "#FFE5E5",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.interSemibold,
    color: Colors.green,
  },
  sectionTitleRed: {
    color: Colors.red,
  },
  countBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeRed: {
    backgroundColor: "#FFE5E5",
  },
  countBadgeText: {
    fontSize: 13,
    fontFamily: fonts.interSemibold,
    color: Colors.green,
  },
  countBadgeTextRed: {
    color: Colors.red,
  },
  servicesGrid: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  serviceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  offlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },
  serviceCardName: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  offlineBadge: {
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  offlineBadgeText: {
    fontSize: 11,
    fontFamily: fonts.interSemibold,
    color: Colors.white,
  },
  serviceCardType: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginBottom: 12,
  },
  serviceCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: fonts.interSemibold,
    color: Colors.green,
  },
  offlineServiceCard: {
    backgroundColor: "#FFF9F9",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#FFE5E5",
  },
  offlineDetailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  offlineDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  offlineDetailLabel: {
    fontSize: 13,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
    minWidth: 60,
  },
  offlineDetailValue: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  bringOnlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.green,
    borderRadius: 12,
    paddingVertical: 14,
  },
  bringOnlineButtonText: {
    fontSize: 15,
    fontFamily: fonts.interSemibold,
    color: Colors.white,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  loadingCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
});

export default OfflineModal;
