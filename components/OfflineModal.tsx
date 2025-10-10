import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import useServiceStore from "@/store/serviceStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

interface OfflineReason {
  value: string;
  label: string;
}

const OFFLINE_REASONS: OfflineReason[] = [
  { value: "Emergency maintenance", label: "Emergency maintenance" },
  { value: "Scheduled maintenance", label: "Scheduled maintenance" },
  { value: "Vacation/Holiday", label: "Vacation/Holiday" },
  { value: "Temporary closure", label: "Temporary closure" },
  { value: "Inventory/Supply issues", label: "Inventory/Supply issues" },
  { value: "Staff shortage", label: "Staff shortage" },
  { value: "Other reason", label: "Other reason" },
];

const COMEBACK_OPTIONS = [
  "30 minutes",
  "2 hours",
  "Tomorrow opening time",
  "Until I turn myself on",
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
    hostelServices,
    updateHostelServiceOfflineStatus,
    updateHostelServiceOnlineStatus,
  } = useServiceStore();

  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedComebackOption, setSelectedComebackOption] =
    useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Separate online and offline services
  const onlineServices =
    hostelServices?.filter((service) => service.isAvailable === true) || [];
  const offlineServices =
    hostelServices?.filter((service) => service.isAvailable === false) || [];

  // Filter online services
  const filteredOnlineServices = onlineServices.filter((service) =>
    service.hostelName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter offline services
  const filteredOfflineServices = offlineServices.filter((service) =>
    service.hostelName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceToggle = useCallback((serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedServices.length === filteredOnlineServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredOnlineServices.map((s) => s._id));
    }
  }, [selectedServices, filteredOnlineServices]);

  const mapOfflineType = (option: string): "immediate" | "scheduled" => {
    return option === "Until I turn myself on" ? "scheduled" : "immediate";
  };

  const handleContinue = async () => {
    // Validation
    if (!selectedReason) {
      Alert.alert("Error", "Please select a reason for going offline");
      return;
    }

    if (selectedServices.length === 0) {
      Alert.alert("Error", "Please select at least one service");
      return;
    }

    if (!selectedComebackOption) {
      Alert.alert("Error", "Please select when you'll be back");
      return;
    }

    setLoading(true);

    try {
      const offlineType = mapOfflineType(selectedComebackOption);

      const payload = {
        hostelServiceIds: selectedServices,
        offlineType,
        reason: selectedReason,
        comeBackOption: selectedComebackOption,
      };

      console.log("📤 Sending offline request:", payload);

      const response = await updateHostelServiceOfflineStatus(payload);

      if (response.success) {
        Alert.alert(
          "Success",
          `${selectedServices.length} service(s) updated to offline status`,
          [
            {
              text: "OK",
              onPress: () => {
                resetModal();
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
    }
  };

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

  const resetModal = () => {
    setSelectedReason("");
    setSelectedServices([]);
    setSelectedComebackOption("");
    setSearchQuery("");
  };

  const handleClose = () => {
    if (!loading) {
      resetModal();
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const renderOnlineServiceItem = ({ item }: { item: any }) => {
    const isSelected = selectedServices.includes(item._id);

    return (
      <TouchableOpacity
        style={[styles.serviceItem, isSelected && styles.serviceItemSelected]}
        onPress={() => handleServiceToggle(item._id)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.hostelName}</Text>
          <Text style={styles.serviceType}>{item.hostelType}</Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color={Colors.white} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderOfflineServiceItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.offlineServiceItem}>
        <View style={styles.offlineServiceHeader}>
          <View style={styles.serviceInfo}>
            <View style={styles.offlineServiceNameRow}>
              <Text style={styles.serviceName}>{item.hostelName}</Text>
              <View style={styles.offlineBadge}>
                <Text style={styles.offlineBadgeText}>Offline</Text>
              </View>
            </View>
            <Text style={styles.serviceType}>{item.hostelType}</Text>
          </View>
        </View>

        {/* Offline Details */}
        {item.offlineDetails && (
          <View style={styles.offlineDetails}>
            {item.offlineDetails.reason && (
              <View style={styles.offlineDetailRow}>
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color={Colors.orange}
                />
                <Text style={styles.offlineDetailText}>
                  {item.offlineDetails.reason}
                </Text>
              </View>
            )}
            {item.offlineDetails.comeBackOption && (
              <View style={styles.offlineDetailRow}>
                <Ionicons name="time-outline" size={14} color={Colors.grey} />
                <Text style={styles.offlineDetailText}>
                  Back in: {item.offlineDetails.comeBackOption}
                </Text>
              </View>
            )}
            {item.offlineDetails.offlineAt && (
              <View style={styles.offlineDetailRow}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={Colors.grey}
                />
                <Text style={styles.offlineDetailText}>
                  Since: {formatDate(item.offlineDetails.offlineAt)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Bring Online Button */}
        <TouchableOpacity
          style={styles.bringOnlineButton}
          onPress={() => handleBringOnline(item._id, item.hostelName)}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Ionicons name="play-circle" size={18} color={Colors.green} />
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
      <SafeAreaView
        style={styles.fullScreenContainer}
        edges={["top", "left", "right"]}
      >
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            disabled={loading}
            style={styles.closeButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={Colors.title} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Services</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Scrollable Content */}
        <FlatList
          data={[{ key: "content" }]}
          renderItem={() => (
            <View style={styles.content}>
              {/* Subtitle */}
              <Text style={styles.subtitle}>
                Select online services to take offline or bring offline services
                back online
              </Text>

              {/* Search Bar */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Search Services</Text>
                <View style={styles.searchContainer}>
                  <Ionicons
                    name="search-outline"
                    size={20}
                    color={Colors.grey}
                    style={styles.searchIcon}
                  />
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
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={Colors.grey}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Online Services Section */}
              {filteredOnlineServices.length > 0 && (
                <>
                  {/* Reason Selection */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>
                      Why are you going offline?{" "}
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.reasonContainer}>
                      {OFFLINE_REASONS.map((reason) => (
                        <TouchableOpacity
                          key={reason.value}
                          style={[
                            styles.reasonChip,
                            selectedReason === reason.value &&
                              styles.reasonChipSelected,
                          ]}
                          onPress={() => setSelectedReason(reason.value)}
                          disabled={loading}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.reasonChipText,
                              selectedReason === reason.value &&
                                styles.reasonChipTextSelected,
                            ]}
                          >
                            {reason.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Online Service Selection */}
                  <View style={styles.section}>
                    <View style={styles.selectAllContainer}>
                      <Text style={styles.sectionLabel}>
                        Select Online Services{" "}
                        <Text style={styles.required}>*</Text>
                      </Text>
                      <TouchableOpacity
                        onPress={handleSelectAll}
                        disabled={loading}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.selectAllText}>
                          {selectedServices.length ===
                          filteredOnlineServices.length
                            ? "Deselect All"
                            : "Select All"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.serviceListContainer}>
                      {filteredOnlineServices.map((service) => (
                        <View key={service._id}>
                          {renderOnlineServiceItem({ item: service })}
                        </View>
                      ))}
                    </View>

                    {selectedServices.length > 0 && (
                      <View style={styles.selectedCount}>
                        <Text style={styles.selectedCountText}>
                          {selectedServices.length} service
                          {selectedServices.length !== 1 ? "s" : ""} selected
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Comeback Options */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>
                      When will you be back?{" "}
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.comebackContainer}>
                      {COMEBACK_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.comebackChip,
                            selectedComebackOption === option &&
                              styles.comebackChipSelected,
                          ]}
                          onPress={() => setSelectedComebackOption(option)}
                          disabled={loading}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={
                              option === "30 minutes" || option === "2 hours"
                                ? "time-outline"
                                : option === "Tomorrow opening time"
                                ? "sunny-outline"
                                : "power-outline"
                            }
                            size={20}
                            color={
                              selectedComebackOption === option
                                ? Colors.white
                                : Colors.primary
                            }
                          />
                          <Text
                            style={[
                              styles.comebackChipText,
                              selectedComebackOption === option &&
                                styles.comebackChipTextSelected,
                            ]}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}

              {/* Offline Services Section */}
              {filteredOfflineServices.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.offlineServicesHeader}>
                    <Ionicons
                      name="pause-circle"
                      size={20}
                      color={Colors.red}
                    />
                    <Text style={styles.offlineServicesTitle}>
                      Currently Offline Services
                    </Text>
                    <View style={styles.offlineCountBadge}>
                      <Text style={styles.offlineCountText}>
                        {filteredOfflineServices.length}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.offlineServiceListContainer}>
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
                    <Ionicons
                      name="information-circle-outline"
                      size={48}
                      color={Colors.grey}
                    />
                    <Text style={styles.emptyText}>No services found</Text>
                  </View>
                )}
            </View>
          )}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
        />

        {/* Fixed Footer - Only show if there are online services */}
        {filteredOnlineServices.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.continueButton, loading && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.continueButtonText}>
                    Continue & Go Offline
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={Colors.white}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  closeButton: {
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    paddingTop: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 15,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 12,
  },
  required: {
    color: Colors.red,
  },
  reasonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  reasonChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
  },
  reasonChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  reasonChipText: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  reasonChipTextSelected: {
    color: Colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.interRegular,
    color: Colors.title,
  },
  selectAllContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectAllText: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.primary,
  },
  serviceListContainer: {
    gap: 10,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.white,
  },
  serviceItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F7FF",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 13,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectedCount: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedCountText: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.green,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 15,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginTop: 12,
  },
  comebackContainer: {
    gap: 12,
  },
  comebackChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
  },
  comebackChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  comebackChipText: {
    fontSize: 15,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  comebackChipTextSelected: {
    color: Colors.white,
  },

  // Offline Services Styles
  offlineServicesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  offlineServicesTitle: {
    fontSize: 15,
    fontFamily: fonts.interSemibold,
    color: Colors.red,
    flex: 1,
  },
  offlineCountBadge: {
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlineCountText: {
    fontSize: 12,
    fontFamily: fonts.interSemibold,
    color: Colors.red,
  },
  offlineServiceListContainer: {
    gap: 12,
  },
  offlineServiceItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FFE5E5",
    backgroundColor: "#FFF9F9",
  },
  offlineServiceHeader: {
    marginBottom: 12,
  },
  offlineServiceNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  offlineBadge: {
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  offlineBadgeText: {
    fontSize: 10,
    fontFamily: fonts.interSemibold,
    color: Colors.white,
  },
  offlineDetails: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginBottom: 12,
  },
  offlineDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  offlineDetailText: {
    fontSize: 12,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
    flex: 1,
  },
  bringOnlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.green,
    borderRadius: 10,
    paddingVertical: 12,
  },
  bringOnlineButtonText: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.green,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
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
  continueButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: Colors.grey,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.white,
  },
});

export default OfflineModal;
