import CommonButton from "@/components/CommonButton";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useAddressStore from "@/store/addressStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const AddEditAddress = () => {
  const params = useLocalSearchParams();
  const mode = params.mode as "add" | "edit";
  const addressId = params.addressId as string;

  const { addAddress, editAddress, getAddressById } = useAddressStore();

  const [isHome, setIsHome] = useState(false);
  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [postCode, setPostCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (mode === "edit" && addressId) {
      loadAddressData();
    }
  }, [mode, addressId]);

  const loadAddressData = async () => {
    setIsLoadingData(true);
    try {
      const result = await getAddressById(addressId);
      if (result.success && result.data) {
        setAddress(result.data.address);
        setStreet(result.data.street);
        setPostCode(result.data.postCode);
        setIsHome(result.data.label === "Home");
      } else {
        Alert.alert("Error", "Failed to load address data");
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load address data");
      router.back();
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!address.trim()) {
      Alert.alert("Error", "Please enter address");
      return;
    }
    if (!street.trim()) {
      Alert.alert("Error", "Please enter street");
      return;
    }
    if (!postCode.trim()) {
      Alert.alert("Error", "Please enter post code");
      return;
    }
    if (postCode.trim().length !== 6) {
      Alert.alert("Error", "Post code must be 6 digits");
      return;
    }

    setIsLoading(true);

    const addressData = {
      address: address.trim(),
      street: street.trim(),
      postCode: postCode.trim(),
      label: (isHome ? "Home" : "Work") as "Home" | "Work",
    };

    try {
      let result;
      if (mode === "edit" && addressId) {
        result = await editAddress(addressId, addressData);
      } else {
        result = await addAddress(addressData);
      }

      if (result.success) {
        Alert.alert(
          "Success",
          mode === "edit"
            ? "Address updated successfully"
            : "Address added successfully",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert("Error", result.error || "Failed to save address");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ backgroundColor: Colors.white }}
            >
              <View style={{ backgroundColor: Colors.white }}>
                <CommonHeader
                  title={mode === "edit" ? "Edit Address" : "Add New Address"}
                />
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={Images.map} style={styles.mapImage} />

        <LabeledInput
          label="Address"
          containerStyle={styles.inputMargin}
          inputContainerStyle={styles.inputTall}
          value={address}
          onChangeText={setAddress}
          multiline
          labelStyle={styles.label}
          placeholder="Enter complete address"
          editable={!isLoading}
        />

        <View style={styles.row}>
          <LabeledInput
            label="Street"
            containerStyle={{ ...styles.flexInput, marginRight: 8 }}
            inputContainerStyle={styles.input}
            value={street}
            onChangeText={setStreet}
            labelStyle={styles.label}
            placeholder="Enter street"
            editable={!isLoading}
          />
          <LabeledInput
            label="Post Code"
            containerStyle={{ ...styles.flexInput, marginLeft: 8 }}
            inputContainerStyle={styles.input}
            value={postCode}
            onChangeText={setPostCode}
            labelStyle={styles.label}
            placeholder="Enter post code"
            keyboardType="numeric"
            maxLength={6}
            editable={!isLoading}
          />
        </View>

        <View style={styles.labelSection}>
          <Text style={styles.labelTitle}>Label as</Text>
          <View style={styles.labelRow}>
            <TouchableOpacity
              onPress={() => setIsHome(true)}
              style={[
                styles.iconWrapper,
                isHome ? styles.inactiveBg : styles.activeBg,
              ]}
              disabled={isLoading}
            >
              <Image
                source={Images.home1}
                style={[
                  styles.icon,
                  { tintColor: isHome ? Colors.primary : Colors.white },
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsHome(false)}
              style={[
                styles.iconWrapper,
                isHome ? styles.activeBg : styles.inactiveBg,
              ]}
              disabled={isLoading}
            >
              <Image
                source={Images.degree}
                style={[
                  styles.icon,
                  { tintColor: isHome ? Colors.white : Colors.primary },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <CommonButton
          title={isLoading ? "Saving..." : "Save"}
          buttonStyle={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AddEditAddress;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  mapImage: {
    width: "100%",
    height: 226,
    resizeMode: "cover",
    marginTop: 28,
    borderRadius: 12,
  },
  inputMargin: {
    marginTop: 20,
  },
  inputTall: {
    minHeight: 75,
  },
  input: {
    minHeight: 56,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  row: {
    flexDirection: "row",
    marginTop: 48,
  },
  flexInput: {
    flex: 1,
  },
  labelSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  labelTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  labelRow: {
    flexDirection: "row",
    gap: 12,
  },
  iconWrapper: {
    height: 52,
    width: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBg: {
    backgroundColor: Colors.primary,
  },
  inactiveBg: {
    backgroundColor: Colors.inputColor,
  },
  icon: {
    height: 24,
    width: 24,
  },
  saveButton: {
    marginTop: 40,
  },
});
