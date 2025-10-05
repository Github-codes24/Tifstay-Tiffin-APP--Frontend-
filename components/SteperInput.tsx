import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface StepperInputProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
  min?: number;
  max?: number;
  currency?: string;
  containerStyle?: ViewStyle;
  showCurrency?: boolean;
}

const StepperInput: React.FC<StepperInputProps> = ({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  currency = "₹",
  containerStyle,
  showCurrency = true,
}) => {
  const [inputValue, setInputValue] = useState(String(value));

  const handleIncrease = () => {
    const newValue = value + step;
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  const handleDecrease = () => {
    const newValue = value - step;
    if (min !== undefined && newValue < min) return;
    onChange(newValue);
  };

  const handleChangeText = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");
    setInputValue(numeric);

    if (numeric === "") {
      onChange(min !== undefined ? min : 0);
      return;
    }

    const num = parseInt(numeric, 10);
    if (!isNaN(num)) {
      let finalValue = num;
      if (min !== undefined && finalValue < min) finalValue = min;
      if (max !== undefined && finalValue > max) finalValue = max;
      onChange(finalValue);
    }
  };

  const handleBlur = () => {
    // Ensure the display value is synced
    setInputValue(String(value));
  };

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const isMaxDisabled = max !== undefined && value >= max;
  const isMinDisabled = min !== undefined && value <= min;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        {showCurrency && currency && (
          <Text style={styles.currency}>{currency}</Text>
        )}
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#D1D5DB"
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handleIncrease}
            disabled={isMaxDisabled}
            activeOpacity={0.6}
          >
            <Ionicons
              name="caret-up"
              size={14}
              color={isMaxDisabled ? "#D1D5DB" : "#1E40AF"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDecrease}
            disabled={isMinDisabled}
            activeOpacity={0.6}
          >
            <Ionicons
              name="caret-down"
              size={14}
              color={isMinDisabled ? "#D1D5DB" : "#6B7280"}
            />
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
    marginRight: 4,
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
