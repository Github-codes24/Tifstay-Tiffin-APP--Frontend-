import { Colors } from "@/constants/Colors";
import { IS_IOS } from "@/constants/Platform";
import { fonts } from "@/constants/typography";
import * as React from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type LabeledInputProps = TextInputProps & {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  leftAdornment?: React.ReactNode;
  leftIconSource?: ImageSourcePropType;
  leftIconStyle?: StyleProp<ImageStyle>;
  rightAdornment?: React.ReactNode;
  rightIconSource?: ImageSourcePropType;
  rightIconStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
};

export default function LabeledInput({
  label,
  containerStyle,
  labelStyle,
  inputStyle,
  inputContainerStyle,
  leftAdornment,
  leftIconSource,
  leftIconStyle,
  rightAdornment,
  rightIconSource,
  rightIconStyle,
  onPress,
  ...inputProps
}: LabeledInputProps) {
  const isMultiline = inputProps.multiline;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isMultiline && styles.inputWrapperMultiline,
          inputContainerStyle,
        ]}
      >
        {leftAdornment ? (
          <View style={[styles.adornment, isMultiline && styles.adornmentTop]}>
            {leftAdornment}
          </View>
        ) : leftIconSource ? (
          <View style={[styles.adornment, isMultiline && styles.adornmentTop]}>
            <Image
              source={leftIconSource}
              style={[styles.icon, leftIconStyle]}
            />
          </View>
        ) : null}

        <TextInput
          style={[
            styles.input,
            isMultiline && styles.inputMultiline,
            inputStyle,
          ]}
          placeholderTextColor={Colors.grey}
          {...inputProps}
        />

        {rightAdornment ? (
          <View
            style={[styles.adornmentRight, isMultiline && styles.adornmentTop]}
          >
            {rightAdornment}
          </View>
        ) : rightIconSource ? (
          <TouchableOpacity
            style={[styles.adornmentRight, isMultiline && styles.adornmentTop]}
            onPress={onPress}
          >
            <Image
              source={rightIconSource}
              style={[styles.icon, rightIconStyle]}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 8,
    fontFamily: fonts.interRegular,
  },
  inputWrapper: {
    backgroundColor: Colors.inputColor,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapperMultiline: {
    height: undefined,
    minHeight: 48,
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.interRegular,
    paddingVertical: 0,
    marginTop: IS_IOS ? 0 : 4,
    color: Colors.grey,
  },
  inputMultiline: {
    textAlignVertical: "top",
    paddingTop: 0,
    marginTop: 0,
    minHeight: 80,
  },
  adornment: {
    marginRight: 20,
  },
  adornmentRight: {
    marginLeft: 8,
  },
  adornmentTop: {
    alignSelf: "flex-start",
    marginTop: IS_IOS ? 2 : 6,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
