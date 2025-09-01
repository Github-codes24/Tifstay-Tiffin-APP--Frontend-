// components/CommonButton.tsx
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface CommonButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

const CommonButton: React.FC<CommonButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // width:'100%',
    backgroundColor:Colors.primary, // default blue
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.white,
    fontSize: 14,
    fontFamily:fonts.interBold
  },
});

export default CommonButton;
