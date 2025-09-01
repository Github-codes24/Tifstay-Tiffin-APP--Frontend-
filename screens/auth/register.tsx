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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name , setName] = useState('');
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
          value={name}
          onChangeText={setName}
          leftIconSource={Images.profile}
          leftIconStyle={{ height: 21, width: 21 }}
          placeholder="Name"
        />
        <LabeledInput
          value={email}
          onChangeText={setEmail}
          leftIconSource={Images.email}
          containerStyle={{ marginTop: 16 }}
          leftIconStyle={{ height: 14, width: 20 }}
          placeholder="Example@gmail.com"
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
        <CommonButton
          title="Continue"
          buttonStyle={{ marginHorizontal: 16, marginTop: 24 }}
          onPress={() => {}}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={()=>{router.push('/login')}}>
          <Text style={styles.registerText}>Log In</Text>
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
    color:Colors.title
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
