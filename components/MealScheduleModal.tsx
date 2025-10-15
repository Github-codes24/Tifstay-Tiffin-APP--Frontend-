import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import useServiceStore from "@/store/serviceStore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface MealScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  tiffinServiceId: string;
  serviceName: string;
}

const MealScheduleModal: React.FC<MealScheduleModalProps> = ({
  visible,
  onClose,
  tiffinServiceId,
  serviceName,
}) => {
  const { mealSchedule, getMealSchedule, updateMealSchedule, isLoading } =
    useServiceStore();
  const [editedSchedule, setEditedSchedule] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    if (visible && tiffinServiceId) {
      getMealSchedule(tiffinServiceId);
    }
  }, [visible, tiffinServiceId]);

  useEffect(() => {
    if (mealSchedule) {
      setEditedSchedule(JSON.parse(JSON.stringify(mealSchedule)));
      setHasChanges(false);
    }
  }, [mealSchedule]);

  const handleTimeChange = (
    dayIndex: number,
    mealIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newSchedule = { ...editedSchedule };
    newSchedule.weeklySchedule[dayIndex].mealTimings[mealIndex][field] = value;
    setEditedSchedule(newSchedule);
    setHasChanges(true);
  };

  const handleAvailabilityToggle = (dayIndex: number, mealIndex: number) => {
    const newSchedule = { ...editedSchedule };
    const currentValue =
      newSchedule.weeklySchedule[dayIndex].mealTimings[mealIndex].isAvailable;
    newSchedule.weeklySchedule[dayIndex].mealTimings[mealIndex].isAvailable =
      !currentValue;
    setEditedSchedule(newSchedule);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const customDaySchedules = editedSchedule.weeklySchedule.map(
        (daySchedule: any) => ({
          day: daySchedule.day,
          mealTimings: daySchedule.mealTimings.map((meal: any) => ({
            mealType: meal.mealType,
            startTime: meal.startTime,
            endTime: meal.endTime,
            isAvailable: meal.isAvailable,
          })),
        })
      );

      await updateMealSchedule(tiffinServiceId, customDaySchedules);
      Alert.alert("Success", "Meal schedule updated successfully");
      setHasChanges(false);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to update meal schedule");
    }
  };

  const renderStatus = (isAvailable: boolean, onPress: () => void) => {
    return (
      <Pressable onPress={onPress} style={styles.statusButton}>
        {isAvailable ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : (
          <Text style={styles.cross}>✕</Text>
        )}
      </Pressable>
    );
  };

  const toggleDayExpanded = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Pressable onPress={onClose} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </Pressable>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{serviceName}</Text>
              <Text style={styles.headerSubtitle}>Weekly Meal Schedule</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        {!editedSchedule || isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading schedule...</Text>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>
                  Full Week Meal Schedule
                </Text>

                {/* Table Header */}
                <View style={[styles.row, styles.tableHeader]}>
                  <Text
                    style={[styles.cell, styles.headerCell, styles.dayCell]}
                  >
                    Day
                  </Text>
                  <Text style={[styles.cell, styles.headerCell]}>
                    Breakfast
                  </Text>
                  <Text style={[styles.cell, styles.headerCell]}>Lunch</Text>
                  <Text style={[styles.cell, styles.headerCell]}>Dinner</Text>
                </View>

                {/* Table Rows */}
                {editedSchedule?.weeklySchedule?.map(
                  (daySchedule: any, dayIndex: number) => {
                    const isExpanded = expandedDay === daySchedule.day;
                    const breakfast = daySchedule.mealTimings.find(
                      (m: any) => m.mealType === "Breakfast"
                    );
                    const lunch = daySchedule.mealTimings.find(
                      (m: any) => m.mealType === "Lunch"
                    );
                    const dinner = daySchedule.mealTimings.find(
                      (m: any) => m.mealType === "Dinner"
                    );

                    return (
                      <View key={daySchedule.day}>
                        {/* Main Row */}
                        <Pressable
                          style={styles.row}
                          onPress={() => toggleDayExpanded(daySchedule.day)}
                        >
                          <Text
                            style={[
                              styles.cell,
                              styles.dayCell,
                              styles.dayText,
                            ]}
                          >
                            {daySchedule.day}
                          </Text>
                          <View style={styles.cell}>
                            {breakfast &&
                              renderStatus(breakfast.isAvailable, () =>
                                handleAvailabilityToggle(
                                  dayIndex,
                                  daySchedule.mealTimings.indexOf(breakfast)
                                )
                              )}
                          </View>
                          <View style={styles.cell}>
                            {lunch &&
                              renderStatus(lunch.isAvailable, () =>
                                handleAvailabilityToggle(
                                  dayIndex,
                                  daySchedule.mealTimings.indexOf(lunch)
                                )
                              )}
                          </View>
                          <View style={styles.cell}>
                            {dinner &&
                              renderStatus(dinner.isAvailable, () =>
                                handleAvailabilityToggle(
                                  dayIndex,
                                  daySchedule.mealTimings.indexOf(dinner)
                                )
                              )}
                          </View>
                        </Pressable>

                        {/* Expanded Time Edit Section */}
                        {isExpanded && (
                          <View style={styles.expandedSection}>
                            <Text style={styles.expandedTitle}>
                              Edit Timings for {daySchedule.day}
                            </Text>

                            {daySchedule.mealTimings.map(
                              (meal: any, mealIndex: number) => (
                                <View
                                  key={meal._id || mealIndex}
                                  style={styles.mealEditRow}
                                >
                                  <View style={styles.mealEditHeader}>
                                    <Text style={styles.mealEditType}>
                                      {meal.mealType}
                                    </Text>
                                    <Pressable
                                      onPress={() =>
                                        handleAvailabilityToggle(
                                          dayIndex,
                                          mealIndex
                                        )
                                      }
                                      style={[
                                        styles.toggleButton,
                                        meal.isAvailable &&
                                          styles.toggleButtonActive,
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          styles.toggleButtonText,
                                          meal.isAvailable &&
                                            styles.toggleButtonTextActive,
                                        ]}
                                      >
                                        {meal.isAvailable
                                          ? "Enabled"
                                          : "Disabled"}
                                      </Text>
                                    </Pressable>
                                  </View>

                                  {meal.isAvailable && (
                                    <View style={styles.timeInputsRow}>
                                      <View style={styles.timeInputGroup}>
                                        <Text style={styles.timeInputLabel}>
                                          Start Time
                                        </Text>
                                        <TextInput
                                          style={styles.timeInput}
                                          value={meal.startTime}
                                          onChangeText={(value) =>
                                            handleTimeChange(
                                              dayIndex,
                                              mealIndex,
                                              "startTime",
                                              value
                                            )
                                          }
                                          placeholder="8:00 AM"
                                          placeholderTextColor="#9CA3AF"
                                        />
                                      </View>

                                      <View style={styles.timeInputGroup}>
                                        <Text style={styles.timeInputLabel}>
                                          End Time
                                        </Text>
                                        <TextInput
                                          style={styles.timeInput}
                                          value={meal.endTime}
                                          onChangeText={(value) =>
                                            handleTimeChange(
                                              dayIndex,
                                              mealIndex,
                                              "endTime",
                                              value
                                            )
                                          }
                                          placeholder="10:00 AM"
                                          placeholderTextColor="#9CA3AF"
                                        />
                                      </View>
                                    </View>
                                  )}
                                </View>
                              )
                            )}
                          </View>
                        )}
                      </View>
                    );
                  }
                )}
              </View>

              <View style={styles.instructionBox}>
                <Text style={styles.instructionText}>
                  💡 Tap on any day to edit meal timings
                </Text>
                <Text style={styles.instructionSubtext}>
                  Tap ✓ or ✕ to quickly enable/disable meals
                </Text>
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.button,
                  styles.saveButton,
                  !hasChanges && styles.disabledButton,
                ]}
                onPress={handleSave}
                disabled={!hasChanges || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: Colors.title,
    fontFamily: fonts.interMedium,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 12,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#D1D5DB",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCell: {
    fontFamily: fonts.interSemibold,
    fontSize: 13,
    color: Colors.title,
  },
  dayCell: {
    flex: 1.2,
    alignItems: "flex-start",
  },
  dayText: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  statusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  checkmark: {
    fontSize: 18,
    color: "#10B981",
    fontWeight: "bold",
  },
  cross: {
    fontSize: 18,
    color: "#EF4444",
    fontWeight: "bold",
  },
  expandedSection: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  expandedTitle: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 12,
  },
  mealEditRow: {
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  mealEditHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mealEditType: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  toggleButtonActive: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
  },
  toggleButtonText: {
    fontSize: 12,
    fontFamily: fonts.interSemibold,
    color: "#EF4444",
  },
  toggleButtonTextActive: {
    color: "#10B981",
  },
  timeInputsRow: {
    flexDirection: "row",
    gap: 12,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeInputLabel: {
    fontSize: 12,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
    marginBottom: 6,
  },
  timeInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    fontFamily: fonts.interRegular,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    color: Colors.title,
  },
  instructionBox: {
    marginTop: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  instructionText: {
    fontSize: 13,
    fontFamily: fonts.interMedium,
    color: "#1E40AF",
    marginBottom: 4,
  },
  instructionSubtext: {
    fontSize: 12,
    fontFamily: fonts.interRegular,
    color: "#3B82F6",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: Colors.white,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: fonts.interSemibold,
    color: Colors.primary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: fonts.interSemibold,
    color: Colors.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default MealScheduleModal;
