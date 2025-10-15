import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import apiService from "@/services/hostelApiService";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth - 32;
const IMAGE_WIDTH = CARD_WIDTH - 24;
const IMAGE_HEIGHT = 240;

interface BedData {
  _id: string;
  bedNumber: number;
  status: "Occupied" | "Unoccupied";
  availability: string;
}

interface RoomData {
  _id: string;
  roomNumber: number;
  totalBeds: BedData[];
  totalBedsCount: number;
  roomDescription: string;
  photos: string[];
}

interface RoomsResponse {
  hostelServiceId: string;
  hostelName: string;
  totalRooms: number;
  rooms: RoomData[];
}

const RoomDetailsScreen = () => {
  const { hostelId } = useLocalSearchParams();
  const [roomsData, setRoomsData] = useState<RoomsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    if (hostelId) {
      fetchRooms();
    }
  }, [hostelId]);

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const response = await apiService.getAllRoomsByHostelId(
        hostelId as string
      );

      if (response.success && response.data?.data?.rooms) {
        const data = response.data.data;
        setRoomsData(data);

        const initialIndices: { [key: string]: number } = {};
        data.rooms.forEach((room: RoomData) => {
          initialIndices[room._id] = 0;
        });
        setImageIndices(initialIndices);
      } else {
        Alert.alert("Error", response.error || "Failed to fetch rooms");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch room details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageScroll = (roomId: string, offsetX: number) => {
    const index = Math.round(offsetX / IMAGE_WIDTH);
    setImageIndices((prev) => ({
      ...prev,
      [roomId]: index,
    }));
  };

  const handleRoomScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + 32));
    setCurrentRoomIndex(index);
  };

  const renderImageCarousel = (room: RoomData) => {
    const roomPhotos =
      room.photos && room.photos.length > 0
        ? room.photos
        : ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"];

    const currentImageIndex = imageIndices[room._id] || 0;

    return (
      <View style={styles.imageContainer}>
        <FlatList
          data={roomPhotos}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={IMAGE_WIDTH} // ✅ FIXED: Use IMAGE_WIDTH instead of CARD_WIDTH
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            handleImageScroll(room._id, event.nativeEvent.contentOffset.x);
          }}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item }}
                style={styles.roomImage}
                defaultSource={Images.hostel1}
                resizeMode="cover"
              />
            </View>
          )}
          keyExtractor={(item, index) => `${room._id}-image-${index}`}
        />

        {/* Photo Counter */}
        <View style={styles.photoCounterContainer}>
          <Text style={styles.photoCounter}>
            {currentImageIndex + 1}/{roomPhotos.length}
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
                  index === currentImageIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderRoomCard = ({ item: room }: { item: RoomData }) => {
    return (
      <View style={styles.card}>
        {renderImageCarousel(room)}

        <Text style={styles.roomTitle}>Room No.: {room.roomNumber}</Text>
        <Text style={styles.subTitle}>Total Beds: {room.totalBedsCount}</Text>

        <Text style={styles.description}>{room.roomDescription}</Text>
        <View style={styles.tableContainer}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Bed No.</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Customer</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>
              Availability
            </Text>
          </View>

          {room.totalBeds?.map((bed, index) => (
            <View key={bed._id || index} style={styles.tableRow}>
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
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading rooms...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!roomsData || !roomsData.rooms || roomsData.rooms.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.description}>No rooms available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={roomsData.rooms}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 32} // card width + margin
        decelerationRate="fast"
        contentContainerStyle={styles.roomsContainer}
        onMomentumScrollEnd={handleRoomScroll}
        renderItem={renderRoomCard}
        keyExtractor={(item) => item._id}
      />

      {roomsData.rooms.length > 1 && (
        <View style={styles.roomCounterContainer}>
          <Text style={styles.roomCounterText}>
            Room {currentRoomIndex + 1} of {roomsData.totalRooms}
          </Text>
        </View>
      )}

      {roomsData.rooms.length > 1 && (
        <View style={styles.roomDotsContainer}>
          {roomsData.rooms.map((_, index) => (
            <View
              key={index}
              style={[
                styles.roomDot,
                index === currentRoomIndex && styles.roomDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
  },
  roomsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#A5A5A5",
    marginRight: 32,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
    height: IMAGE_HEIGHT,
    borderRadius: 10,
    overflow: "hidden",
  },
  imageWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  roomImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
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
  roomCounterContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  roomCounterText: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomDotsContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  roomDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },
  roomDotActive: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default RoomDetailsScreen;
