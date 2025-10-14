import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef } from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";

interface CustomSwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value = false, onValueChange }) => {
  const translateX = useRef(new Animated.Value(value ? 12 : 0)).current;

  // Sync animation with external value changes
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 12 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const toggleSwitch = () => {
    if (onValueChange) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.switchContainer, value ? styles.switchOn : styles.switchOff]}
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
    borderRadius: 4,
    backgroundColor: "#fff",
  },
});

export default CustomSwitch;