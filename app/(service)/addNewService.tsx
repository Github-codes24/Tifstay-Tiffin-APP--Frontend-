// screens/BasicInfoForm.tsx
import MealCheckbox from "@/components/CheckBox";
import CommonButton from "@/components/CommonButton";
import CommonDropdown from "@/components/CommonDropDown";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import StepperInput from "@/components/SteperInput";
import TimePicker from "@/components/TimePicker";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { IS_ANDROID } from "@/constants/Platform";
import { fonts } from "@/constants/typography";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.radioContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.outerCircle, selected && styles.outerCircleSelected]}
      >
        {selected && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const BasicInfoForm = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const [breakfastStart, setBreakfastStart] = useState("7:00 AM");
  const [breakfastEnd, setBreakfastEnd] = useState("9:00 AM");

  const [lunchStart, setLunchStart] = useState("12:00 PM");
  const [lunchEnd, setLunchEnd] = useState("2:00 PM");

  const [dinnerStart, setDinnerStart] = useState("8:00 PM");
  const [dinnerEnd, setDinnerEnd] = useState("10:00 PM");

  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [selected, setSelected] = useState("Veg");

  const ROLES = [
    { label: "With one meal", value: "With one meal" },
    { label: "With two meal", value: "With two meal" },
    { label: "One meal with breakfast", value: "One meal with breakfast" },
    {
      label: "With Lunch & dinner & breakfast",
      value: "With Lunch & dinner & breakfast",
    },
    { label: "With breakfast", value: "With breakfast" },
  ];

  // 🔥 Pricing blocks state
  const [pricingBlocks, setPricingBlocks] = useState([
    {
      planType: null,
      foodType: null,
      pricing: {
        dailyDining: 120,
        dailyDelivery: 120,
        weeklyDining: 120,
        weeklyDelivery: 120,
        monthlyDining: 120,
        monthlyDelivery: 120,
      },
    },
  ]);

  const handleAddMorePricing = () => {
    setPricingBlocks((prev) => [
      ...prev,
      {
        planType: null,
        foodType: null,
        pricing: {
          dailyDining: 120,
          dailyDelivery: 120,
          weeklyDining: 120,
          weeklyDelivery: 120,
          monthlyDining: 120,
          monthlyDelivery: 120,
        },
      },
    ]);
  };

  const updateBlock = (index: number, field: string, value: any) => {
    console.log('-=-=-=',index , field,value)
    setPricingBlocks((prev) =>
      prev.map((block, i) =>
        i === index ? { ...block, [field]: value } : block
      )
    );
  };

  const updatePricing = (
    index: number,
    priceKey: keyof (typeof pricingBlocks)[0]["pricing"],
    value: number
  ) => {
    setPricingBlocks((prev) =>
      prev.map((block, i) =>
        i === index
          ? { ...block, pricing: { ...block.pricing, [priceKey]: value } }
          : block
      )
    );
  };

  const resetForm = () => {
    setName("");
    setDesc("");

    setBreakfastStart("7:00 AM");
    setBreakfastEnd("9:00 AM");

    setLunchStart("12:00 PM");
    setLunchEnd("2:00 PM");

    setDinnerStart("8:00 PM");
    setDinnerEnd("10:00 PM");

    setBreakfast(false);
    setLunch(false);
    setDinner(false);
    setSelected("Veg");

    setPricingBlocks([
      {
        planType: "",
        foodType: "",
        pricing: {
          dailyDining: 120,
          dailyDelivery: 120,
          weeklyDining: 120,
          weeklyDelivery: 120,
          monthlyDining: 120,
          monthlyDelivery: 120,
        },
      },
    ]);
  };

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <View style={{ backgroundColor: Colors.white }}>
          <CommonHeader
            title="Add New Tiffen Service"
            actionText="Reset"
            onActionPress={resetForm}
          />
        </View>
      </SafeAreaView>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* Section 1 - Basic Info */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Image source={Images.menu} style={{ height: 16, width: 16 }} />
            <Text style={styles.heading}>Basic Information</Text>
          </View>

          <LabeledInput
            label="Tiffin/Restaurant Name *"
            placeholder="e.g., Maharashtrian Ghar Ka Khana"
            value={name}
            onChangeText={setName}
            labelStyle={styles.label}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputBox}
            inputStyle={{ marginTop: 0 }}
          />

          <LabeledInput
            label="Description *"
            placeholder="Write about your service..."
            value={desc}
            onChangeText={setDesc}
            multiline
            textAlignVertical="auto"
            labelStyle={styles.label}
            inputContainerStyle={[styles.inputBox, styles.textArea]}
            containerStyle={styles.descContainer}
            inputStyle={styles.textAreaInput}
          />

          {/* Meals */}
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>
            Meal Preference*
          </Text>
          <MealCheckbox
            label="Breakfast (7:00 AM - 9:00 AM)"
            checked={breakfast}
            onToggle={() => setBreakfast(!breakfast)}
          />

          <Text style={styles.subLabel}>Delivery Timing *</Text>
          <View style={styles.row}>
            <TimePicker
              value={breakfastStart}
              containerStyle={styles.flex}
              onChange={setBreakfastStart}
            />
            <TimePicker
              value={breakfastEnd}
              containerStyle={styles.flex}
              onChange={setBreakfastEnd}
            />
          </View>

          <MealCheckbox
            label="Lunch (12:00 PM - 2:00 PM)"
            checked={lunch}
            onToggle={() => setLunch(!lunch)}
            containerStyle={styles.checkboxSpacing}
          />

          <Text style={styles.subLabel}>Delivery Timing *</Text>
          <View style={styles.row}>
            <TimePicker
              value={lunchStart}
              containerStyle={styles.flex}
              onChange={setLunchStart}
            />
            <TimePicker
              value={lunchEnd}
              containerStyle={styles.flex}
              onChange={setLunchEnd}
            />
          </View>

          <MealCheckbox
            label="Dinner (8:00 PM - 10:00 PM)"
            checked={dinner}
            onToggle={() => setDinner(!dinner)}
            containerStyle={styles.checkboxSpacing}
          />

          <Text style={styles.subLabel}>Delivery Timing *</Text>
          <View style={styles.row}>
            <TimePicker
              value={dinnerStart}
              containerStyle={styles.flex}
              onChange={setDinnerStart}
            />
            <TimePicker
              value={dinnerEnd}
              containerStyle={styles.flex}
              onChange={setDinnerEnd}
            />
          </View>

          {/* Food Type */}
          <Text style={styles.sectionTitle}>Food Type*</Text>
          {["Veg", "Non-Veg", "Both Veg & Non-Veg"].map((type) => (
            <RadioButton
              key={type}
              label={type}
              selected={selected === type}
              onPress={() => setSelected(type)}
            />
          ))}

          <LabeledInput
            label="What's included *"
            placeholder="Describe what's Included in your tiffin menus..."
            value={desc}
            onChangeText={setDesc}
            multiline
            textAlignVertical="auto"
            labelStyle={styles.label}
            inputContainerStyle={[styles.inputBox, styles.includeBox]}
            containerStyle={styles.includeContainer}
            inputStyle={styles.includeInput}
          />

          <Text style={styles.sectionTitle}>Order Type*</Text>
          <MealCheckbox
            label="Dining"
            checked={dinner}
            onToggle={() => setDinner(!dinner)}
            containerStyle={styles.checkboxSpacing}
          />
          <MealCheckbox
            label="Delivery"
            checked={dinner}
            onToggle={() => setDinner(!dinner)}
            containerStyle={styles.checkboxSpacing}
          />
        </View>

        {/* Section 2 - Pricing */}
        <View style={[styles.card, { padding: 0 }]}>
          <Text style={[styles.heading, styles.cardHeading]}>
            ₹ Pricing Information
          </Text>

          {pricingBlocks.map((block, blockIndex) => (
            <View key={blockIndex} style={styles.innerCard}>
              {/* Dropdowns */}
              <View style={{ zIndex: 2 }}>
                <CommonDropdown
                  items={ROLES}
                  label="Choose Plan Type"
                  value={block.planType}
                  setValue={(val) => updateBlock(blockIndex, "planType", val)}
                />
              </View>

              <View style={{ zIndex: 1 }}>
                <CommonDropdown
                  items={[
                    { label: "Veg", value: "Veg" },
                    { label: "Non-Veg", value: "Non-Veg" },
                    { label: "Both", value: "Both" },
                  ]}
                  label="Food Type"
                  value={block.foodType}
                  setValue={(val) => updateBlock(blockIndex, "foodType", val)}
                />
              </View>

              {/* Stepper Inputs */}
              <View style={styles.row}>
                <StepperInput
                  label="Daily for Dining (₹)"
                  value={block.pricing.dailyDining}
                  onChange={(val) =>
                    updatePricing(blockIndex, "dailyDining", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
                <StepperInput
                  label="Daily for Delivery (₹)"
                  value={block.pricing.dailyDelivery}
                  onChange={(val) =>
                    updatePricing(blockIndex, "dailyDelivery", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
              </View>

              <View style={styles.row}>
                <StepperInput
                  label="Weekly for Dining (₹)"
                  value={block.pricing.weeklyDining}
                  onChange={(val) =>
                    updatePricing(blockIndex, "weeklyDining", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
                <StepperInput
                  label="Weekly for Delivery (₹)"
                  value={block.pricing.weeklyDelivery}
                  onChange={(val) =>
                    updatePricing(blockIndex, "weeklyDelivery", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
              </View>

              <View style={styles.row}>
                <StepperInput
                  label="Monthly for Dining (₹)"
                  value={block.pricing.monthlyDining}
                  onChange={(val) =>
                    updatePricing(blockIndex, "monthlyDining", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
                <StepperInput
                  label="Monthly for Delivery (₹)"
                  value={block.pricing.monthlyDelivery}
                  onChange={(val) =>
                    updatePricing(blockIndex, "monthlyDelivery", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
              </View>
            </View>
          ))}

          {/* Add More Button */}
          <TouchableOpacity onPress={handleAddMorePricing}>
            <Text style={styles.addMore}>+ Add More Pricing</Text>
          </TouchableOpacity>
        </View>

        <CommonButton
          title="Next"
          onPress={() => {
            router.push("/(service)/addNewService1");
          }}
          buttonStyle={{ marginBottom: IS_ANDROID ? 50 : 10 }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default BasicInfoForm;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16, marginBottom: 100, backgroundColor: Colors.white },
  card: {
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  heading: { fontSize: 16, fontFamily: fonts.interSemibold },
  cardHeading: { paddingHorizontal: 15, marginTop: 10 },
  label: { color: Colors.title, fontSize: 14, fontFamily: fonts.interRegular },
  inputContainer: { marginTop: 20, paddingHorizontal: 0 },
  inputBox: { backgroundColor: Colors.white, borderColor: Colors.lightGrey },
  textArea: { minHeight: 100 },
  descContainer: { marginBottom: 50, marginTop: 20, paddingHorizontal: 0 },
  textAreaInput: { minHeight: 80 },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 0,
    fontFamily: fonts.interRegular,
    color: Colors.title,
    marginTop: 14,
  },
  subLabel: {
    marginTop: 14,
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.title,
    marginBottom: 5,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 20 },
  checkboxSpacing: { marginTop: 14 },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  outerCircle: {
    width: 15,
    height: 15,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#1E40AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  outerCircleSelected: { borderColor: "#1E40AF" },
  innerCircle: {
    width: 9,
    height: 9,
    borderRadius: 6,
    backgroundColor: "#1E40AF",
  },
  radioLabel: { fontSize: 16, color: "#222" },
  includeBox: { minHeight: 64 },
  includeContainer: { marginBottom: 20, paddingHorizontal: 0, marginTop: 20 },
  includeInput: { minHeight: 50 },
  innerCard: {
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    margin: 8,
    padding: 8,
    borderRadius: 12,
  },
  addMore: {
    textAlign: "center",
    color: Colors.orange,
    fontFamily: fonts.interBold,
    fontSize: 14,
    paddingVertical: 10,
  },
});
