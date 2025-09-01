import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";

interface ServiceButtonProps {
  icon: any; 
  title: string;
  highlightText?: string;
  subtitle: string;
  onPress?: () => void;
  rightIcon?:any;
  containerStyle?: ViewStyle;
  subTitleStyle?: TextStyle;
  titleStyle?: TextStyle;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightIcon,
  containerStyle,
  titleStyle,
  subTitleStyle
}) => {
  return (
    <TouchableOpacity style={[styles.buttonContainer , containerStyle]} onPress={onPress}>
      {/* Left Icon */}
      <Image source={icon} style={styles.icon} resizeMode="contain" />

      {/* Text Content */}
      <View style={{ flex: 1 , flexDirection:'column' , gap:8 }}>
        <Text style={[styles.title  , titleStyle]}>
          {title}
        </Text>
        <Text style={[styles.subtitle , subTitleStyle]}>{subtitle}</Text>
      </View>

      {/* Right Arrow */}
      <Image source={rightIcon} style={styles.arrow} resizeMode="contain" />
    </TouchableOpacity>
  );
};

export default ServiceButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 12,
    marginTop:4,
    alignSelf:'flex-start'
  },
  arrow:{
    width: 12,
    height: 12,
  },
  title: {
    fontSize: 14,
    color: "#fff",
    fontFamily: fonts.interBold,
  },
  boldText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: fonts.interBold,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 1)",
    opacity: 0.9,
    fontFamily: fonts.interRegular,
  },
});
