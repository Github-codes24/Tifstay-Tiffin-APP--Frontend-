import { Colors } from "@/constants/Colors";
import React, { useState, useRef } from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";

const CustomSwitch = () => {
  const [isOn, setIsOn] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const toggleSwitch = () => {
    setIsOn(!isOn);

    Animated.timing(translateX, {
      toValue: !isOn ? 12 : 0,  
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={[styles.switchContainer, isOn ? styles.switchOn : styles.switchOff]}
      activeOpacity={0.8}
      onPress={toggleSwitch}
    >
      <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 34,
    height: 16,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  switchOn: {
    backgroundColor: Colors.lightBlue,
  },
  switchOff: {
    backgroundColor: Colors.lightBg,
  },
  knob: {
    width: 14,
    height: 8,
    borderRadius: 4, // half of height for pill shape
    backgroundColor: "#fff",
  },
});

export default CustomSwitch;
