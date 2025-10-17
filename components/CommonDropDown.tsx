import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type Props = {
  label?: string;
  items: { label: string; value: string }[];
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  placeholder?: string;
  containerStyle?: object;
  dropdownStyle?: ViewStyle;
  placeholderStyle?: TextStyle;
  dropdownStyleContainer?: ViewStyle;
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
  labelStyle,
}) => {
  const [open, setOpen] = useState(false);
  const [listItems, setListItems] = useState(items);
  useEffect(()=>{setListItems(items),[items]})
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <DropDownPicker
        open={open}
        value={value}
        items={listItems}
        setOpen={setOpen}
        setValue={(callbackOrValue) => {
          // DropDownPicker can pass either a function or a value
          if (typeof callbackOrValue === "function") {
            const newValue = callbackOrValue(value);
            setValue(newValue); // Call the passed setter with the new value
          } else {
            setValue(callbackOrValue); // Direct value
          }
        }}
        setItems={setListItems}
        placeholder={placeholder}
        listMode="SCROLLVIEW"
        scrollViewProps={{ nestedScrollEnabled: true }}
        style={[styles.dropdown, dropdownStyle]}
        dropDownContainerStyle={[
          styles.dropdownContainer,
          dropdownStyleContainer,
        ]}
        textStyle={styles.text}
        placeholderStyle={placeholderStyle}
        ArrowDownIconComponent={() => (
          <Image
            source={Images.back}
            style={{
              height: 12,
              width: 12,
              resizeMode: "contain",
              transform: [{ rotate: "90deg" }],
            }}
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
    zIndex: 9999,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: "#111",
  },
});
