// screens/BasicInfoForm.tsx
import LabeledInput from "@/components/labeledInput";
import TimePicker from "@/components/TimePicker";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

const BasicInfoForm = () => {

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text>New service screen</Text>
    </ScrollView>
  );
};

export default BasicInfoForm;

const styles = StyleSheet.create({
  container: { padding: 16 , borderWidth:1 },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 4, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 16 },
});
