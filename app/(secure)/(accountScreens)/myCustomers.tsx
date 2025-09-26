import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const customers = [
  {
    id: "1",
    name: "Ralph Edwards",
    startDate: "Tiffin Start 16 August",
    subscription: "Monthly",
    image: Images.user,
  },
  {
    id: "2",
    name: "Annette Black",
    startDate: "Tiffin Start 16 August",
    subscription: "Weekly",
    image: Images.user,
  },
  {
    id: "3",
    name: "Kathryn Murphy",
    startDate: "Tiffin Start 16 August",
    subscription: "Weekly",
    image: Images.user,
  },
  {
    id: "4",
    name: "Darlene Robertson",
    startDate: "Tiffin Start 16 August",
    subscription: "Monthly",
    image: Images.user,
  },
  {
    id: "5",
    name: "Devon Lane",
    startDate: "Tiffin Start 16 August",
    subscription: "Weekly",
    image: Images.user,
  },
  {
    id: "6",
    name: "Theresa Webb",
    startDate: "Tiffin Start 16 August",
    subscription: "Monthly",
    image: Images.user,
  },
];

export default function MyCustomersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push("/(secure)/(accountScreens)/customerInfo");
            }}
            style={styles.customerRow}
          >
            <Image source={item.image} style={styles.profileImage} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.startDate}>{item.startDate}</Text>
            </View>
            <Text style={styles.subscription}>{item.subscription}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerTitle: { fontSize: 18, fontWeight: "600", marginLeft: 8 },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  profileImage: { width: 44, height: 44, borderRadius: 22, marginRight: 14 },
  info: { flex: 1 },
  name: { fontSize: 14, fontFamily: fonts.interMedium, color: Colors.grey },
  startDate: {
    fontSize: 12,
    color: Colors.lightGrey,
    fontFamily: fonts.interRegular,
    marginTop: 2,
  },
  subscription: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
  },
});
