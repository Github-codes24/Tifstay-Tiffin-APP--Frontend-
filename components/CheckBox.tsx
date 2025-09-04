// components/MealCheckbox.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "@/constants/typography";
import { Colors } from "@/constants/Colors";

interface MealCheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  containerStyle? : ViewStyle
  labelStyle?: TextStyle
}

const MealCheckbox: React.FC<MealCheckboxProps> = ({ label, checked, onToggle ,containerStyle , labelStyle}) => {
  return (
    <TouchableOpacity style={[styles.container , containerStyle]} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkedBox]}>
        {checked && <Ionicons name="checkmark" size={12} color="white" />}
      </View>
      <Text style={[styles.label , labelStyle]}>{label}</Text>
    </TouchableOpacity>
  )
};

export default MealCheckbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 6,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.orange, // orange border
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkedBox: {
    backgroundColor: Colors.orange, // orange fill
    borderColor: Colors.orange,
  },
  label: {
    fontSize: 12,
    color: "#252525",
    fontFamily:fonts.interMedium
  },
});
