// components/TimePicker.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleConfirm = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${(hours % 12 || 12)}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
    onChange(formattedTime);
    setPickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setPickerVisible(true)}
      >
        <Text style={styles.timeText}>{value || "Select Time"}</Text>
        <Ionicons name="time-outline" size={20} color="#555" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
      />
    </View>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  container: { marginVertical: 6 },
  label: { fontSize: 14, marginBottom: 4, color: "#333" },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  timeText: { fontSize: 16, color: "#000" },
});
