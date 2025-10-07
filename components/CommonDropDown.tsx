import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet, View, Text, Image, ViewStyle, TextStyle } from "react-native";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import { Images } from "@/constants/Images";

type Props = {
  label?: string;
  items: { label: string; value: string }[];
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  placeholder?: string;
  containerStyle?: object;
  dropdownStyle?: ViewStyle;
  placeholderStyle?: TextStyle;
  dropdownStyleContainer?:ViewStyle;
  labelStyle?: TextStyle;
};

const CommonDropdown: React.FC<Props> = ({
  label,
  items,
  value,
  setValue,
  placeholder = "Select an option",
  containerStyle,
  dropdownStyle,
  placeholderStyle,
  dropdownStyleContainer,
  labelStyle
}) => {
  const [open, setOpen] = useState(false);
  const [listItems, setListItems] = useState(items);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={[styles.label , labelStyle]}>{label}</Text>}
      <DropDownPicker
        open={open}
        value={value}
        items={listItems}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setListItems}
        placeholder={placeholder}
        listMode="SCROLLVIEW"
        scrollViewProps={{ nestedScrollEnabled: true }}
        style={[styles.dropdown , dropdownStyle]}
        dropDownContainerStyle={[styles.dropdownContainer , dropdownStyleContainer]}
        textStyle={styles.text}
        placeholderStyle={placeholderStyle}
        ArrowDownIconComponent={() => (
          <Image
            source={Images.back}
            style={{ height: 12, width: 12, resizeMode: "contain" ,   transform: [{ rotate: "90deg" }],}}
          />
        )}
        ArrowUpIconComponent={() => (
          <Image
            source={Images.back}
            style={{
              height: 12,
              width: 12,
              resizeMode: "contain",
              transform: [{ rotate: "270deg" }],
            }}
          />
        )}
      />
    </View>
  );
};

export default CommonDropdown;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    zIndex: 999,
  },
  label: {
    fontSize: 12,
    color: Colors.title,
    marginBottom: 8,
    fontFamily: fonts.interRegular,
  },
  dropdown: {
    borderColor: Colors.lightGrey,
    borderRadius: 8,
    backgroundColor: Colors.white,
    minHeight: 48,
  },
  dropdownContainer: {
    borderColor: Colors.title,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: "#111",
  },
});
