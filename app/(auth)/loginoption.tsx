import ServiceButton from "@/components/ServiceButton";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { router } from "expo-router";
import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function InitialLogin() {
  const { setUserServiceType } = useAuthStore();
  const handleSelectService = async (serviceType: any) => {
    try {
      setUserServiceType(serviceType);
      router.push("/login");
    } catch (error) {
      console.error("Error saving service type:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slide}>
        <Image
          source={Images.logo}
          style={styles.appLogo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Choose Your Service</Text>
        <Text style={styles.description}>Please select your category</Text>

        <ServiceButton
          icon={Images.cap}
          rightIcon={Images.warrow}
          title="I'm a Tiffin/Restaurant Provider"
          subtitle="Want to list my Tiffin/Restaurant"
          onPress={() => handleSelectService("tiffinProvider")}
        />

        <ServiceButton
          icon={Images.building}
          containerStyle={styles.secondaryService}
          titleStyle={styles.secondaryTitle}
          subTitleStyle={styles.secondarySubtitle}
          rightIcon={Images.barrow}
          title="I'm a PG/Hostel Owner"
          subtitle="Want to list my PG/Hostel"
          onPress={() => handleSelectService("hostelOwner")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 28,
  },
  appLogo: {
    width: 87,
    height: 87,
    marginBottom: 7,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.interSemibold,
    marginBottom: 7,
    textAlign: "center",
    color: Colors.title,
  },
  description: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: "center",
    fontFamily: fonts.interRegular,
    marginBottom: 66,
  },
  secondaryService: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  secondaryTitle: {
    color: Colors.primary,
  },
  secondarySubtitle: {
    color: Colors.primary,
  },
});
