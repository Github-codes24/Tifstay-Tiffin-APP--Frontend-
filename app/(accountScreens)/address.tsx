import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { router } from "expo-router";
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
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            right: 19,
            top: 19,
          }}
        >
          <TouchableOpacity onPress={() => {router.push('/(accountScreens)/editAddress')}}>
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
    fontSize: 14,
    fontFamily: fonts.interSemibold,
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
    width: 52,
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
    height: 20,
    width: 20,
    marginLeft: 10,
    // marginTop: -25,
  },
});
