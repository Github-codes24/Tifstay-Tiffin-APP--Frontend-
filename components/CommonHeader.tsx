// components/CommonHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // you can use any icon library
import { fonts } from "@/constants/typography";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

interface CommonHeaderProps {
  title: string;
  onBackPress?: () => void;
  actionText?: string;
  onActionPress?: () => void;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  onBackPress = () => router.back(),
  actionText,
  onActionPress,
}) => {
  return (
    <View
      style={[
        styles.container,
        { justifyContent: !actionText ? "flex-start" : "space-between" },
      ]}
    >
      {/* Back Button */}
      <View style={{flexDirection:'row' , alignItems:'center'}}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Ionicons name="chevron-back" size={20} color="#0A0A23" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>
      </View>
      {/* Right Action */}
      {actionText ? (
        <TouchableOpacity style={{justifyContent:'flex-end'}} onPress={onActionPress}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 90 }} /> // placeholder to balance spacing
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  backButton: {
    width: 34,
    height: 34,
    marginRight: 12,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#0A0A23",
    alignItems: "center",
    justifyContent: "center",
    
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  actionText: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.primary,
  },
});

export default CommonHeader;
