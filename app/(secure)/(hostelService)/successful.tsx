import CommonButton from "@/components/CommonButton";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useServiceStore from "@/store/serviceStore";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function SuccessFul() {
  const { clearFormData } = useServiceStore();

  useEffect(() => {
    // Clear any remaining form data when component mounts
    clearFormData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
        <Image
          source={Images.logo}
          style={styles.appLogo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { marginBottom: 10 }]}>
          Listing Created!
        </Text>
        <Text style={styles.footerText}>
          Your hostel service listing has been submitted for review.
        </Text>
        <View style={{ width: "100%", marginTop: 20 }}>
          <CommonButton
            buttonStyle={{ marginHorizontal: 16 }}
            title="Go to Home"
            onPress={() => {
              router.push("/(secure)/(tabs)/(dashboard)");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  appLogo: {
    width: 87,
    height: 87,
    marginBottom: 7,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.interSemibold,
    marginBottom: 28,
    textAlign: "center",
    color: Colors.title,
  },
  footerText: {
    fontSize: 14,
    color: Colors.grey,
    textAlign: "center",
    fontFamily: fonts.interRegular,
    paddingHorizontal: 50,
  },
});
