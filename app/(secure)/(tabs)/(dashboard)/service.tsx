import LabeledInput from "@/components/labeledInput";
import MealScheduleModal from "@/components/MealScheduleModal"; // Create this component
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useServiceStore from "@/store/serviceStore";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ServiceStatus() {
  const {
    tiffinServices,
    getTiffinServiceList, // ✅ Use getTiffinServiceList instead
    isLoading,
    currentDay,
  } = useServiceStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // ✅ Fetch tiffin services when screen is focused
  useFocusEffect(
    useCallback(() => {
      getTiffinServiceList(); // ✅ Call the correct method
    }, [])
  );

  // ✅ Filter services based on search query
  const filteredServices = tiffinServices.filter(
    (service) =>
      service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) // ✅ Added optional chaining
  );

  const handleSeeDetails = (service: any) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const getNextScheduledSlot = (service: any) => {
    if (!service.currentDaySchedule) {
      return "No schedule set";
    }

    const schedule = service.currentDaySchedule;
    const availableMeals = schedule.mealTimings.filter(
      (meal: any) => meal.isAvailable
    );

    if (availableMeals.length === 0) {
      return "No meals available today";
    }

    // Get first available meal
    const firstMeal = availableMeals[0];
    return `${schedule.day}, ${firstMeal.startTime} - ${firstMeal.endTime}`;
  };

  const getCurrentSlot = (service: any) => {
    if (!service.currentDaySchedule) {
      return null;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const schedule = service.currentDaySchedule;

    for (const meal of schedule.mealTimings) {
      if (!meal.isAvailable) continue;

      const startTime = parseTime(meal.startTime);
      const endTime = parseTime(meal.endTime);

      if (currentTime >= startTime && currentTime <= endTime) {
        return {
          type: "Current",
          text: `${meal.mealType}: ${meal.startTime} - ${meal.endTime}`,
        };
      }
    }

    return null;
  };

  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  if (isLoading && tiffinServices.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LabeledInput
        placeholder="Search your service"
        leftIconSource={Images.search}
        containerStyle={{ paddingHorizontal: 0, marginBottom: 20 }}
        inputContainerStyle={{ backgroundColor: Colors.searchColor }}
        inputStyle={{ fontSize: 14 }}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredServices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? "No services found matching your search"
              : "No tiffin services available"}
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredServices.map((service) => {
            const currentSlot = getCurrentSlot(service);
            const hasCustomSchedule = service.currentDaySchedule !== null;

            return (
              <View key={service.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    {hasCustomSchedule && (
                      <View style={styles.customBadge}>
                        <Text style={styles.customBadgeText}>Custom</Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      hasCustomSchedule
                        ? styles.activeBadge
                        : styles.inactiveBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        hasCustomSchedule
                          ? styles.activeText
                          : styles.inactiveText,
                      ]}
                    >
                      {hasCustomSchedule ? "Active" : "Not Set"}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider}></View>

                {/* Current/Next Slot Info */}
                <View style={styles.slotContainer}>
                  {currentSlot ? (
                    <View>
                      <Text style={styles.slotLabel}>
                        Current delivery slot
                      </Text>
                      <Text style={styles.slotValue}>{currentSlot.text}</Text>
                    </View>
                  ) : hasCustomSchedule ? (
                    <View>
                      <Text style={styles.slotLabel}>Next delivery slot</Text>
                      <Text style={styles.slotValue}>
                        {getNextScheduledSlot(service)}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.slotLabel}>Meal schedule</Text>
                      <Text style={styles.slotValue}>
                        No custom timing set - Using default timings
                      </Text>
                    </View>
                  )}

                  <Pressable onPress={() => handleSeeDetails(service)}>
                    <Text style={styles.linkText}>See Details</Text>
                  </Pressable>
                </View>

                {/* Today's Schedule Summary */}
                {hasCustomSchedule && (
                  <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>
                      {" Today's Schedule"} ({currentDay})
                    </Text>
                    <View style={styles.mealsList}>
                      {service.currentDaySchedule.mealTimings
                        .filter((meal: any) => meal.isAvailable)
                        .map((meal: any, index: number) => (
                          <View key={index} style={styles.mealItem}>
                            <View style={styles.mealDot} />
                            <Text style={styles.mealText}>
                              {meal.mealType}: {meal.startTime} - {meal.endTime}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Meal Schedule Modal */}
      {selectedService && (
        <MealScheduleModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedService(null);
          }}
          tiffinServiceId={selectedService.id}
          serviceName={selectedService.name}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.searchColor,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
    flex: 1,
  },
  customBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  customBadgeText: {
    fontSize: 10,
    fontFamily: fonts.interMedium,
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: "#E8F5E9",
  },
  inactiveBadge: {
    backgroundColor: "#FFF3E0",
  },
  statusText: {
    fontSize: 11,
    fontFamily: fonts.interMedium,
  },
  activeText: {
    color: "#2E7D32",
  },
  inactiveText: {
    color: "#E65100",
  },
  divider: {
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    borderStyle: "dashed",
    marginBottom: 14,
  },
  slotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotLabel: {
    fontSize: 12,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginBottom: 4,
  },
  slotValue: {
    fontSize: 13,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: fonts.interMedium,
    textDecorationLine: "underline",
  },
  summaryContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  summaryTitle: {
    fontSize: 12,
    fontFamily: fonts.interMedium,
    color: Colors.title,
    marginBottom: 8,
  },
  mealsList: {
    gap: 6,
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mealDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  mealText: {
    fontSize: 11,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
});
