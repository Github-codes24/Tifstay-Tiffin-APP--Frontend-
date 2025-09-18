import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "@/constants/typography";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";

const RoomDetailsScreen = () => {
  const beds = [
    { id: "1", name: "Bed 1", status: "Occupied", customer: "Audrey", availability: "1st–30th Sep" },
    { id: "2", name: "Bed 2", status: "Occupied", customer: "Gloria", availability: "1st–30th Sep" },
    { id: "3", name: "Bed 3", status: "Available", customer: "NA", availability: "1st–7th Sep" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" }}
          style={styles.roomImage}
        />

        <Text style={styles.roomTitle}>Room No.: 101</Text>
        <Text style={styles.subTitle}>Total Beds: 3</Text>

        <Text style={styles.description}>
          Lorem ipsum dolor sit amet consectetur. Adipiscing semper ut arcu et
          nec massa iaculis condimentum semper. Pharetra felis ac adipiscing
          facilisi. Neque id dui sed pulvinar.
        </Text>

        {/* Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Bed No.</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Customer</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Availability</Text>
          </View>

          {/* Table Rows */}
          {beds.map((bed) => (
            <View key={bed.id} style={styles.tableRow}>
              <View style={{ flex: 1.2, flexDirection: "row", alignItems: "center" }}>
                <Image source={Images.bad1} style={{ marginRight: 4 , height:16,width:16}} />
                <Text style={styles.tableCell}>{bed.name}</Text>
              </View>
              <Text
                style={[
                  styles.tableCell,
                  { flex: 1, color: bed.status === "Available" ? Colors.green : Colors.grey },
                ]}
              >
                {bed.status}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{bed.customer}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{bed.availability}</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#A5A5A5",
  },
  roomImage: {
    width: "100%",
    height: 240,
    borderRadius: 10,
    marginBottom: 12,
  },
  roomTitle: {
    fontSize: 18,
fontFamily:fonts.interSemibold,
    color: Colors.title,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 12,
fontFamily:fonts.interMedium,
    color: Colors.title,
    marginBottom: 8,
  },
  description: {
   fontSize: 16,
fontFamily:fonts.interRegular,
    color: Colors.grey,
    // lineHeight: 18,
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
fontFamily:fonts.interMedium,
    color: Colors.title,
  },
  tableCell: {
fontFamily:fonts.interRegular,
    fontSize: 10,
    color: Colors.grey,
  },
});

export default RoomDetailsScreen;