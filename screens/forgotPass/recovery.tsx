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
import LabeledInput from "@/components/labeledInput";
import CommonButton from "@/components/CommonButton";

export default function Recovery() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [sent, setIsSent] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      {!sent ? (
        <View style={styles.slide}>
          <Image
            source={Images.logo}
            style={styles.appLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>New Password</Text>
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
            placeholder="Enter new password"
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
            placeholder="Confirm new password"
          />
          <CommonButton
            title="Send Recovery Link"
            buttonStyle={{ marginHorizontal: 16, marginTop: 24 }}
            onPress={() => {
              setIsSent(true);
            }}
          />
        </View>
      ) : (
        <View
          style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
        >
          <Image
            source={Images.logo}
            style={styles.appLogo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { marginBottom: 10 }]}>Congrats !</Text>
          <Text style={styles.footerText}>Password reset successful.</Text>
        </View>
      )}
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
  },
  registerText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: fonts.interSemibold,
  },
});
