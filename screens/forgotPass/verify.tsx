import React, { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import { fonts } from "@/constants/typography";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonButton from "@/components/CommonButton";
import { Images } from "@/constants/Images";

function OtpBox({
  value,
  onChange,
  onKeyPress,
  inputRef,
  autoFocus,
}: {
  value: string;
  onChange: (text: string) => void;
  onKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  inputRef: React.RefObject<TextInput | null>;
  autoFocus?: boolean;
}) {
  return (
    <TextInput
      ref={inputRef}
      value={value}
      onChangeText={onChange}
      onKeyPress={onKeyPress}
      keyboardType="number-pad"
      maxLength={1}
      style={styles.otpBox}
      autoFocus={!!autoFocus}
    />
  );
}

export default function VerifyScreen() {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useMemo<React.RefObject<TextInput | null>[]>(() => {
    return [0, 1, 2, 3].map(() => React.createRef<TextInput>());
  }, []);

  useEffect(() => {
    if (countdown === 0) return; // stop at 0
    const t = setInterval(() => {
      setCountdown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const onVerify = () => {
    router.replace("/recovery");
  };

  const focusInput = (index: number) => {
    const ref = inputRefs[index];
    ref?.current?.focus?.();
  };

  const handleChange = (index: number, text: string) => {
    const sanitized = text.replace(/[^0-9]/g, "");
    setDigits((prev) => {
      const next = [...prev];
      next[index] = sanitized.slice(-1);
      return next;
    });

    if (sanitized && index < inputRefs.length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (digits[index]) {
        // If current has a value, clear it
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }
      // Current empty: move to previous and clear it
      if (index > 0) {
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
        focusInput(index - 1);
      }
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
        <Text style={styles.title}>Verify Account</Text>
        <Text
          style={{
            textAlign: "center",
            color: Colors.title,
            fontFamily: fonts.interRegular,
            fontSize: 13,
          }}
        >
          Enter 4 digit otp
        </Text>
        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <OtpBox
              key={i}
              value={d}
              inputRef={inputRefs[i]}
              autoFocus={i === 0}
              onChange={(txt) => handleChange(i, txt)}
              onKeyPress={(e) => handleKeyPress(i, e)}
            />
          ))}
        </View>
        {/* </View> */}
        <Text
          style={{
            textAlign: "center",
            marginTop: 33,
            color: Colors.grey,
            fontFamily: fonts.interRegular,
            fontSize: 13,
          }}
        >
          Didn’t Receive Code?
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: Colors.grey,
            marginTop: 8,
            fontFamily: fonts.interRegular,
            fontSize: 13,
          }}
        >
          Resend code in {countdown}
        </Text>

        <CommonButton
          title="Verify"
          onPress={onVerify}
          buttonStyle={{ marginTop: 36, marginHorizontal: 16 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: { flex: 1, backgroundColor: Colors.white },
  content: { paddingHorizontal: 16 },
  hero: {
    width: 24,
    height: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.interSemibold,
    marginBottom: 28,
    textAlign: "center",
    color: Colors.title,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.grey,
    marginTop: 8,
    textAlign: "center",
  },
  otpRow: {
    flexDirection: "row",
    gap: 32,
    marginTop: 14,
    justifyContent: "center",
  },
  otpBox: {
    width: 56,
    height: 53,
    borderRadius: 10,
    backgroundColor: Colors.inputColor,
    textAlign: "center",
    color: Colors.grey,
    fontSize: 16,
    fontFamily: fonts.interRegular,
    justifyContent: "center",
  },
  resend: { textAlign: "center", marginTop: 24, color: Colors.grey },
});
