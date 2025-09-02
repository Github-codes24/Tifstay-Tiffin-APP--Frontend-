import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from "react-native";

interface CommonTextInputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

const CommonTextInput: React.FC<CommonTextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && { height: 100, textAlignVertical: "top" },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor="#999"
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#0A051F",
    marginHorizontal: 10,
  },
  input: {
    height: 56,
    borderColor: "#e0e0e0",
    // borderWidth: 1,
    borderRadius: 8,
    color: "#666060",
    paddingHorizontal: 12,
    marginHorizontal: 12,
    backgroundColor: "#F8F5FF",
    fontSize: 14,
    fontWeight: "400",
  },
});

export default CommonTextInput;
