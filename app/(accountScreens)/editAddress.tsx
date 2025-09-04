import CommonButton from "@/components/CommonButton";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddressScreen = () => {
  const [isHome, setIsHome] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={Images.map} style={styles.mapImage} />

        <LabeledInput
          label="Address"
          containerStyle={styles.inputMargin}
          inputContainerStyle={styles.inputTall}
          value="123 Main Street, Dharampeth, Nagpur - 440010"
          multiline
          labelStyle={styles.label}
        />

        <View style={styles.row}>
          <LabeledInput
            label="Street"
            containerStyle={styles.flexInput}
            inputContainerStyle={styles.input}
            value="123 Main Street"
            multiline
            labelStyle={styles.label}
          />
          <LabeledInput
            label="Post Code"
            containerStyle={styles.flexInput}
            inputContainerStyle={styles.input}
            value="440010"
            multiline
            labelStyle={styles.label}
          />
        </View>

        <View style={styles.labelSection}>
          <Text style={styles.labelTitle}>Label as</Text>
          <View style={styles.labelRow}>
            <TouchableOpacity
              onPress={() => setIsHome(true)}
              style={[
                styles.iconWrapper,
                isHome ? styles.inactiveBg : styles.activeBg,
              ]}
            >
              <Image
                source={Images.home1}
                style={[
                  styles.icon,
                  { tintColor: isHome ? Colors.primary : Colors.white },
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsHome(false)}
              style={[
                styles.iconWrapper,
                isHome ? styles.activeBg : styles.inactiveBg,
              ]}
            >
              <Image
                source={Images.degree}
                style={[
                  styles.icon,
                  { tintColor: isHome ? Colors.white : Colors.primary },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <CommonButton title="Save" buttonStyle={styles.saveButton} onPress={() => {}} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  mapImage: {
    width: "100%",
    height: 226,
    resizeMode: "cover",
    marginTop:28
  },
  inputMargin: {
    marginTop: 20,
  },
  inputTall: {
    minHeight: 75,
  },
  input: {
    minHeight: 56,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  row: {
    flexDirection: "row",
    marginTop: 48,
  },
  flexInput: {
    flex: 1,
  },
  labelSection: {
    marginTop: 24,
    paddingHorizontal:16
  },
  labelTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  labelRow: {
    flexDirection: "row",
    gap: 12,
  },
  iconWrapper: {
    height: 52,
    width: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBg: {
    backgroundColor: Colors.primary,
  },
  inactiveBg: {
    backgroundColor: Colors.inputColor,
  },
  icon: {
    height: 24,
    width: 24,
  },
  saveButton: {
    marginTop: 40,
  },
});
