// components/StepperInput.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "@/constants/typography";
import { Colors } from "@/constants/Colors";

interface StepperInputProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
  min?: number;
  max?: number;
  currency?: string;
  containerStyle?: ViewStyle
}

const StepperInput: React.FC<StepperInputProps> = ({
  label,
  value,
  onChange,
  step = 10,
  min = 0,
  max = 1000,
  currency = "₹",
  containerStyle
}) => {
  const [inputValue, setInputValue] = useState(String(value));

  const handleIncrease = () => {
    if (value + step <= max) onChange(value + step);
  };

  const handleDecrease = () => {
    if (value - step >= min) onChange(value - step);
  };

  const handleChangeText = (text: string) => {
    // Allow only numbers
    const numeric = text.replace(/[^0-9]/g, "");
    setInputValue(numeric);

    const num = parseInt(numeric, 10);
    if (!isNaN(num)) {
      // Clamp value between min and max
      const clamped = Math.min(Math.max(num, min), max);
      onChange(clamped);
    }
  };

  // Sync when parent updates value externally
  React.useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  return (
    <View style={[styles.wrapper , containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        <Text style={styles.currency}>{currency}</Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleChangeText}
          keyboardType="numeric"
        />
        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleIncrease}>
            <Ionicons name="caret-up" size={14} color="#1E40AF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDecrease}>
            <Ionicons name="caret-down" size={14} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StepperInput;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.interRegular,
    marginBottom: 8,
    color: Colors.title,
  },
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
  },
  currency: {
    fontSize: 13,
    color: Colors.grey,
    // marginRight: 4,
    fontFamily: fonts.interRegular,

  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
    padding: 0,
  },
  buttons: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
