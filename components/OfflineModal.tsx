import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import useServiceStore from "@/store/serviceStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SelectionPopup from "./SelectionPopup";

const HOSTEL_TYPES = ["Boys Hostel", "Girls Hostel", "Both"];
const SERVICE_STATUS = ["Online Services", "Offline Services"];
const ITEMS_PER_PAGE = 10;

interface OfflineModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const OfflineModal: React.FC<OfflineModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { userServiceType } = useAuthStore();
  const {
    hostelServicesList,
    tiffinServices,
    getHostelServicesList,
    getAllTiffinServices,
    updateHostelServiceOfflineStatus,
    updateHostelServiceOnlineStatus,
    getOfflineReasons,
    getComebackOptions,
    pagination,
  } = useServiceStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHostelType, setSelectedHostelType] = useState<string | null>(
    null
  );
  const [selectedServiceStatus, setSelectedServiceStatus] =
    useState<string>("Online Services");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showHostelTypeDropdown, setShowHostelTypeDropdown] = useState(false);
  const [showServiceStatusDropdown, setShowServiceStatusDropdown] =
    useState(false);

  // Multi-select states
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // API fetched data
  const [offlineReasons, setOfflineReasons] = useState<any[]>([]);
  const [comebackOptions, setComebackOptions] = useState<any[]>([]);

  // Popup states
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [showComebackPopup, setShowComebackPopup] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedComebackOption, setSelectedComebackOption] =
    useState<string>("");

  const insets = useSafeAreaInsets();

  // Determine if tiffin provider
  const isTiffinProvider = userServiceType === "tiffin_provider";

  // Get the correct services list based on user type
  const servicesList = isTiffinProvider ? tiffinServices : hostelServicesList;

  useEffect(() => {
    if (visible) {
      fetchInitialData(1);
    }
  }, [visible, userServiceType]);

  const fetchInitialData = async (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    try {
      if (isTiffinProvider) {
        await Promise.all([
          getAllTiffinServices(page, ITEMS_PER_PAGE),
          fetchOfflineReasons(),
          fetchComebackOptions(),
        ]);
      } else {
        await Promise.all([
          getHostelServicesList(page, ITEMS_PER_PAGE),
          fetchOfflineReasons(),
          fetchComebackOptions(),
        ]);
      }
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

  // Get service name based on type
  const getServiceName = (service: any) => {
    return isTiffinProvider ? service.tiffinName : service.hostelName;
  };

  // Get service type (only for hostel)
  const getServiceType = (service: any) => {
    return isTiffinProvider
      ? "Tiffin Service"
      : service.hostelType || "Not specified";
  };

  // Filter services based on status (Online/Offline)
  const filteredByStatus =
    servicesList?.filter((service: any) => {
      const isOnline = service.isOffline === false || !service.isOffline;
      if (selectedServiceStatus === "Online Services") {
        return isOnline;
      } else {
        return service.isOffline === true;
      }
    }) || [];

  // Apply search filter
  const searchFiltered = filteredByStatus.filter((service: any) =>
    getServiceName(service)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply hostel type filter (only for hostels)
  const filteredServices =
    !isTiffinProvider && selectedHostelType
      ? searchFiltered.filter(
          (service: any) => service.hostelType === selectedHostelType
        )
      : searchFiltered;

  // Pagination
  const totalPages = pagination?.totalPages || 1;
  const currentPageNumber = pagination?.currentPage || currentPage;
  const hasNextPage = pagination?.hasNext || false;
  const hasPrevPage = pagination?.hasPrev || false;

  // Handle checkbox selection
  const toggleServiceSelection = (serviceId: string) => {
    if (selectedServiceIds.includes(serviceId)) {
      setSelectedServiceIds(
        selectedServiceIds.filter((id) => id !== serviceId)
      );
    } else {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  };

  // Select all services on current page
  const toggleSelectAll = () => {
    if (selectedServiceIds.length === filteredServices.length) {
      setSelectedServiceIds([]);
    } else {
      setSelectedServiceIds(
        filteredServices.map((service: any) => service._id)
      );
    }
  };

  // Handle bulk action button
  const handleBulkAction = () => {
    if (selectedServiceIds.length === 0) {
      Alert.alert("No Selection", "Please select at least one service");
      return;
    }

    if (selectedServiceStatus === "Online Services") {
      // Go offline
      setShowReasonPopup(true);
    } else {
      // Bring online
      handleBulkBringOnline();
    }
  };

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
        hostelServiceIds: selectedServiceIds,
        offlineType,
        reason: selectedReason,
        comeBackOption: selectedComebackOption,
      };

      const response = await updateHostelServiceOfflineStatus(payload);

      if (response.success) {
        Alert.alert(
          "Success",
          `${selectedServiceIds.length} service(s) are now offline`,
          [
            {
              text: "OK",
              onPress: () => {
                setSelectedServiceIds([]);
                fetchInitialData(currentPage);
                onSuccess();
              },
            },
          ]
        );
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
  }, [selectedServiceIds, selectedReason, selectedComebackOption, currentPage]);

  const handleBulkBringOnline = async () => {
    Alert.alert(
      "Bring Services Online",
      `Are you sure you want to bring ${selectedServiceIds.length} service(s) back online?`,
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
              const response = await updateHostelServiceOnlineStatus(
                selectedServiceIds
              );

              if (response.success) {
                Alert.alert(
                  "Success",
                  `${selectedServiceIds.length} service(s) are now online!`,
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        setSelectedServiceIds([]);
                        fetchInitialData(currentPage);
                        onSuccess();
                      },
                    },
                  ]
                );
              } else {
                throw new Error(
                  response.error || "Failed to bring services online"
                );
              }
            } catch (error: any) {
              console.error("❌ Error bringing services online:", error);
              Alert.alert(
                "Error",
                error?.message ||
                  "Failed to bring services online. Please try again."
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
    setSelectedReason("");
    setSelectedComebackOption("");
  };

  const resetModal = () => {
    setSearchQuery("");
    setSelectedHostelType(null);
    setSelectedServiceStatus("Online Services");
    setSelectedServiceIds([]);
    setCurrentPage(1);
    resetSelection();
  };

  const handleClose = () => {
    if (!loading) {
      resetModal();
      onClose();
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setSelectedServiceIds([]);
      fetchInitialData(page);
    }
  };

  const renderServiceItem = ({ item }: { item: any }) => {
    const serviceName = getServiceName(item);
    const serviceType = getServiceType(item);
    const isSelected = selectedServiceIds.includes(item._id);
    const isOffline = item.isOffline === true;

    return (
      <TouchableOpacity
        style={[
          styles.serviceCard,
          isSelected && styles.serviceCardSelected,
          isOffline && styles.serviceCardOffline,
        ]}
        onPress={() => toggleServiceSelection(item._id)}
        activeOpacity={0.7}
        disabled={loading}
      >
        <View style={styles.serviceCardContent}>
          <View style={styles.serviceCardLeft}>
            <View
              style={[styles.checkbox, isSelected && styles.checkboxSelected]}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              )}
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName} numberOfLines={1}>
                {serviceName}
              </Text>
              {!isTiffinProvider && (
                <Text style={styles.serviceType}>{serviceType}</Text>
              )}
            </View>
          </View>
          <View
            style={[
              styles.statusIndicator,
              isOffline && styles.statusIndicatorOffline,
            ]}
          />
        </View>

        {isOffline && (
          <View style={styles.offlineDetails}>
            {item.reason && (
              <Text style={styles.offlineDetailText}>
                <Text style={styles.offlineDetailLabel}>Reason: </Text>
                {item.reason}
              </Text>
            )}
            {item.offlineAt && (
              <Text style={styles.offlineDetailText}>
                <Text style={styles.offlineDetailLabel}>Since: </Text>
                {item.offlineAt}
              </Text>
            )}
            {item.comeBackAt && (
              <Text style={styles.offlineDetailText}>
                <Text style={styles.offlineDetailLabel}>Back at: </Text>
                {item.comeBackAt}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            !hasPrevPage && styles.paginationButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPageNumber - 1)}
          disabled={!hasPrevPage || loading}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={hasPrevPage ? Colors.primary : Colors.grey}
          />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paginationNumbers}
        >
          {pages.map((page) => (
            <TouchableOpacity
              key={page}
              style={[
                styles.paginationNumber,
                currentPageNumber === page && styles.paginationNumberActive,
              ]}
              onPress={() => handlePageChange(page)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.paginationNumberText,
                  currentPageNumber === page &&
                    styles.paginationNumberTextActive,
                ]}
              >
                {page}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.paginationButton,
            !hasNextPage && styles.paginationButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPageNumber + 1)}
          disabled={!hasNextPage || loading}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={hasNextPage ? Colors.primary : Colors.grey}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const isOfflineView = selectedServiceStatus === "Offline Services";
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
          <Text style={styles.headerTitle}>
            {isTiffinProvider
              ? "Manage Tiffin Services"
              : "Manage Hostel Services"}
          </Text>
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
                placeholder="Search by name"
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

          {/* Filters Section */}
          <View style={styles.filtersRow}>
            {/* Hostel Type Filter - Only for hostels */}
            {!isTiffinProvider && (
              <View style={styles.filterWrapper}>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => {
                    setShowHostelTypeDropdown(!showHostelTypeDropdown);
                    setShowServiceStatusDropdown(false);
                  }}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterButtonText}>
                    {selectedHostelType || "Hostel Type"}
                  </Text>
                  <Ionicons
                    name={
                      showHostelTypeDropdown ? "chevron-up" : "chevron-down"
                    }
                    size={18}
                    color={Colors.grey}
                  />
                </TouchableOpacity>

                {showHostelTypeDropdown && (
                  <View style={styles.filterDropdown}>
                    <TouchableOpacity
                      style={styles.filterOption}
                      onPress={() => {
                        setSelectedHostelType(null);
                        setShowHostelTypeDropdown(false);
                      }}
                    >
                      <Text style={styles.filterOptionText}>All Types</Text>
                      {!selectedHostelType && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={Colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                    {HOSTEL_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={styles.filterOption}
                        onPress={() => {
                          setSelectedHostelType(type);
                          setShowHostelTypeDropdown(false);
                        }}
                      >
                        <Text style={styles.filterOptionText}>{type}</Text>
                        {selectedHostelType === type && (
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
            )}

            {/* Service Status Filter */}
            <View
              style={[styles.filterWrapper, isTiffinProvider && { flex: 1 }]}
            >
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => {
                  setShowServiceStatusDropdown(!showServiceStatusDropdown);
                  setShowHostelTypeDropdown(false);
                }}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={styles.filterButtonText}>
                  {selectedServiceStatus}
                </Text>
                <Ionicons
                  name={
                    showServiceStatusDropdown ? "chevron-up" : "chevron-down"
                  }
                  size={18}
                  color={Colors.grey}
                />
              </TouchableOpacity>

              {showServiceStatusDropdown && (
                <View style={styles.filterDropdown}>
                  {SERVICE_STATUS.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={styles.filterOption}
                      onPress={() => {
                        setSelectedServiceStatus(status);
                        setShowServiceStatusDropdown(false);
                        setSelectedServiceIds([]);
                      }}
                    >
                      <Text style={styles.filterOptionText}>{status}</Text>
                      {selectedServiceStatus === status && (
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
          </View>

          {/* Services List Header */}
          <View style={styles.listHeader}>
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={toggleSelectAll}
              disabled={loading || filteredServices.length === 0}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedServiceIds.length === filteredServices.length &&
                    filteredServices.length > 0 &&
                    styles.checkboxSelected,
                ]}
              >
                {selectedServiceIds.length === filteredServices.length &&
                  filteredServices.length > 0 && (
                    <Ionicons name="checkmark" size={16} color={Colors.white} />
                  )}
              </View>
              <Text style={styles.selectAllText}>
                Select All ({selectedServiceIds.length}/
                {filteredServices.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Services List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading services...</Text>
            </View>
          ) : filteredServices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={48} color={Colors.grey} />
              </View>
              <Text style={styles.emptyTitle}>No services found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredServices}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Pagination */}
          {renderPagination()}

          {/* Bulk Action Button */}
          {selectedServiceIds.length > 0 && (
            <View style={styles.bulkActionContainer}>
              <TouchableOpacity
                style={[
                  styles.bulkActionButton,
                  isOfflineView
                    ? styles.bulkActionButtonOnline
                    : styles.bulkActionButtonOffline,
                ]}
                onPress={handleBulkAction}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isOfflineView ? "play-circle" : "pause-circle"}
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.bulkActionButtonText}>
                  {isOfflineView
                    ? `Bring Online (${selectedServiceIds.length})`
                    : `Go Offline (${selectedServiceIds.length})`}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
        subtitle={`Why are these ${selectedServiceIds.length} service(s) going offline?`}
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
        subtitle={`Select when these ${selectedServiceIds.length} service(s) will be back online`}
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
  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 12,
  },
  filterWrapper: {
    flex: 1,
    position: "relative",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
    flex: 1,
  },
  filterDropdown: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 1000,
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectAllText: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.grey,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  serviceCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  serviceCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F7FF",
  },
  serviceCardOffline: {
    backgroundColor: "#FFF9F9",
    borderColor: "#FFE5E5",
  },
  serviceCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  serviceCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 2,
  },
  serviceType: {
    fontSize: 13,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.green,
  },
  statusIndicatorOffline: {
    backgroundColor: Colors.red,
  },
  offlineDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#FFE5E5",
    gap: 4,
  },
  offlineDetailText: {
    fontSize: 12,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  offlineDetailLabel: {
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
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
  paginationNumbers: {
    flexDirection: "row",
    gap: 8,
  },
  paginationNumber: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  paginationNumberActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  paginationNumberText: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  paginationNumberTextActive: {
    color: Colors.white,
    fontFamily: fonts.interSemibold,
  },
  bulkActionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bulkActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
  },
  bulkActionButtonOffline: {
    backgroundColor: Colors.red,
  },
  bulkActionButtonOnline: {
    backgroundColor: Colors.green,
  },
  bulkActionButtonText: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
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
});

export default OfflineModal;
