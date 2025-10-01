/* eslint-disable react-hooks/exhaustive-deps */
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import apiService from "@/services/hostelApiService";
import { RoomData } from "@/types/hostel";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const RoomDetailsScreen = () => {
  const { roomId } = useLocalSearchParams();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRoomById(roomId as string);

      if (response.success && response.data?.room) {
        setRoomData(response.data.room);
      } else {
        Alert.alert("Error", response.error || "Failed to fetch room details");
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
      Alert.alert("Error", "Failed to fetch room details");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (screenWidth - 32));
    setActiveImageIndex(index);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!roomData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.description}>No room data available</Text>
      </View>
    );
  }

  const roomPhotos =
    roomData.photos && roomData.photos.length > 0
      ? roomData.photos
      : ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Card */}
      <View style={styles.card}>
        {/* Image Swiper */}
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {roomPhotos.map((photo, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: photo }} style={styles.roomImage} />
              </View>
            ))}
          </ScrollView>

          {/* Photo Counter */}
          <View style={styles.photoCounterContainer}>
            <Text style={styles.photoCounter}>
              {activeImageIndex + 1}/{roomPhotos.length}
            </Text>
          </View>

          {/* Dots Indicator */}
          {roomPhotos.length > 1 && (
            <View style={styles.dotsContainer}>
              {roomPhotos.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === activeImageIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <Text style={styles.roomTitle}>Room No.: {roomData.roomNumber}</Text>
        <Text style={styles.subTitle}>
          Total Beds: {roomData.totalBedsCount}
        </Text>

        <Text style={styles.description}>{roomData.roomDescription}</Text>

        {/* Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Bed No.</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Customer</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>
              Availability
            </Text>
          </View>

          {/* Table Rows */}
          {roomData.totalBeds.map((bed) => (
            <View key={bed._id} style={styles.tableRow}>
              <View
                style={{
                  flex: 1.2,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={Images.bad1}
                  style={{ marginRight: 4, height: 16, width: 16 }}
                />
                <Text style={styles.tableCell}>Bed {bed.bedNumber}</Text>
              </View>
              <Text
                style={[
                  styles.tableCell,
                  {
                    flex: 1,
                    color:
                      bed.status === "Unoccupied" ? Colors.green : Colors.grey,
                  },
                ]}
              >
                {bed.status === "Unoccupied" ? "Available" : "Occupied"}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {bed.status === "Occupied" ? "Customer" : "NA"}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {bed.availability}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#A5A5A5",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  imageWrapper: {
    width: screenWidth - 32,
    height: 240,
  },
  roomImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  photoCounterContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCounter: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: fonts.interMedium,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.white,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  roomTitle: {
    fontSize: 18,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 4,
    marginTop: 8,
  },
  subTitle: {
    fontSize: 12,
    fontFamily: fonts.interMedium,
    color: Colors.title,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginBottom: 16,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "rgba(94, 155, 237, 0.2)",
  },
  tableHeaderText: {
    fontSize: 12,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  tableCell: {
    fontFamily: fonts.interRegular,
    fontSize: 10,
    color: Colors.grey,
  },
});

export default RoomDetailsScreen;
