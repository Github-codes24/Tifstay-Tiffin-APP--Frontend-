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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slide}>
        <Image
          source={Images.logo}
          style={styles.appLogo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Get started with Tifstay</Text>
        <LabeledInput
          value={email}
          onChangeText={setEmail}
          leftIconSource={Images.email}
          leftIconStyle={{ height: 14, width: 20 }}
          placeholder="example@gmail.com"
        />
        <LabeledInput
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          onPress={() => {
            setShowPassword(!showPassword);
          }}
          leftIconSource={Images.lock}
          containerStyle={{ marginTop: 16 }}
          rightIconSource={Images.openeye}
          leftIconStyle={{ height: 20.7, width: 20.7 }}
          placeholder="Password"
        />
        <TouchableOpacity style={{ padding: 16, alignItems: "flex-end" }} onPress={()=>{router.push('/forgotpass')}}>
          <Text
            style={{
              fontFamily: fonts.interRegular,
              color: Colors.grey,
              fontSize: 13,
            }}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>
        <CommonButton
          title="Continue"
          buttonStyle={{ marginHorizontal: 16, marginTop: 8 }}
          onPress={() => {}}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/register");
          }}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
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
    position: "absolute",
    bottom: 50,
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
