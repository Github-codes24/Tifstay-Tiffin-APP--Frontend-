import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { Images } from "@/constants/images";

const offers = [
  {
    id: "1",
    title: "New Offer",
    description: "10% Off on Tiffin/Restaurant /n Booking.",
    backgroundColor: "#4F95F2",
  },
  {
    id: "2",
    title: "Live",
    description: "10% Off on Tiffin/Restaurant \n Booking.",
    backgroundColor: "#28a745",
  },
  {
    id: "3",
    title: "Expired",
    description: "10% Off on Tiffin/Restaurant \n Booking.",
    backgroundColor: "#E51A1A",
  },
];

const OffersScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offers</Text>
      </View>

      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View
            style={[styles.card, { backgroundColor: item.backgroundColor }]}
          >
            <Image
              source={Images.celebration}
              style={styles.icon}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardText}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default OffersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    height: 100,
    borderRadius: 12,
    marginVertical: 8,
  },
  icon: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  cardText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
});
