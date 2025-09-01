import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import LabeledInput from "@/components/labeledInput";
import CommonButton from "@/components/CommonButton";
import { router } from "expo-router";

export default function ForgotPass() {
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slide}>
        <Image
          source={Images.logo}
          style={styles.appLogo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Forgot Password?</Text>
        <LabeledInput
          value={email}
          onChangeText={setEmail}
          leftIconSource={Images.email}
          leftIconStyle={{ height: 14, width: 20 }}
          placeholder="example@gmail.com"
        />
        <CommonButton
          title="Send Recovery Link"
          buttonStyle={{ marginHorizontal: 16, marginTop: 24 }}
          onPress={() => {router.push('/verify')}}
        />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Remember it. </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/login");
          }}
        >
          <Text style={styles.registerText}>Login</Text>
        </TouchableOpacity>
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
  },
  footer: {
    marginTop:57,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.grey,
    textAlign: "center",
    fontFamily:fonts.interRegular
  },
  registerText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: fonts.interSemibold,
  },
});
