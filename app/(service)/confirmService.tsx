import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import CommonButton from "@/components/CommonButton";
import { router } from "expo-router";

export default function SuccessFul() {
  return (
    <SafeAreaView style={styles.container}>
        <View
          style={{ justifyContent: "center", flex: 1, alignItems: "center"}}
        >
          <Image
            source={Images.logo}
            style={styles.appLogo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { marginBottom: 10 }]}>Listing Created!</Text>
          <Text style={styles.footerText}>Your tiffin service listing has been submitted for review.</Text>
          <View style={{width:'100%' , marginTop:20}}>
          <CommonButton buttonStyle={{marginHorizontal:16}} title="Go to Home" onPress={()=>{router.push('/(tabs)/(dashboard)')}}/>
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
  slide: {
    marginTop: 71,
    justifyContent: "center",
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
    color:Colors.title
  },
  footer: {
    marginTop: 57,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.grey,
    textAlign: "center",
    fontFamily: fonts.interRegular,
    paddingHorizontal:50
  },
  registerText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: fonts.interSemibold,
  },
});
