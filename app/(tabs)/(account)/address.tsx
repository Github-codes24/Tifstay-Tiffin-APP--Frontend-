import { Images } from "@/constants/Images";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";


const AddressScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
     

      <Text style={styles.locationLabel}>Location</Text>

      <View style={styles.card}>
        <Image source={Images.home} style={styles.image} resizeMode="contain" />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.address}>
            123 Main Street, Dharampeth, {"\n"}Nagpur - 440010
          </Text>
        </View>

        <TouchableOpacity onPress={() => {}}>
          <Image
            source={Images.editicon}
            style={styles.actionIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Image
            source={Images.delete}
            style={styles.actionIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddressScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  locationLabel: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    margin: 16,
    backgroundColor: "#F7F5FF",
    borderRadius: 12,
    height: 101,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 52,
    width: 51.57,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: "700",
    color: "#0A051F",
    fontSize: 14,
  },
  address: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
  },
  actionIcon: {
    height: 15.68,
    width: 14.11,
    marginLeft: 10,
    marginTop: -25,
  },
});