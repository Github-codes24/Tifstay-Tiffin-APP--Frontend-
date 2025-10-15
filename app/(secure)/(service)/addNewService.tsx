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
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
}) => (
  <TouchableOpacity
    style={styles.radioContainer}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.outerCircle, selected && styles.outerCircleSelected]}>
      {selected && <View style={styles.innerCircle} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

const ROLES = [
  { label: "With one meal", value: "With one meal" },
  { label: "With two meal", value: "With two meal" },
  { label: "One meal with breakfast", value: "One meal with breakfast" },
  {
    label: "With lunch & dinner & breakfast",
    value: "With lunch & dinner & breakfast",
  },
  { label: "With breakfast", value: "With breakfast" },
];

const FOOD_TYPES = [
  { label: "Veg", value: "Veg" },
  { label: "Non-Veg", value: "Non-Veg" },
  { label: "Both Veg & Non-Veg", value: "Both Veg & Non-Veg" },
];

const BasicInfoForm = () => {
  const { formData: formDataParam, isEdit, id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    tiffinName: "",
    description: "",
    mealTimings: [
      {
        mealType: "Breakfast",
        checked: false,
        startTime: "7:00 AM",
        endTime: "9:00 AM",
      },
      {
        mealType: "Lunch",
        checked: false,
        startTime: "12:00 PM",
        endTime: "2:00 PM",
      },
      {
        mealType: "Dinner",
        checked: false,
        startTime: "8:00 PM",
        endTime: "10:00 PM",
      },
    ],
    foodType: "Veg",
    includedDescription: "",
    orderTypes: { dining: false, delivery: false },
    pricing: [
      {
        planType: "",
        foodType: "",
        perMealDining: 120,
        perMealDelivery: 120,
        weeklyDining: 120,
        weeklyDelivery: 120,
        monthlyDining: 120,
        monthlyDelivery: 120,
        perBreakfastDining: 120,
        perBreakfastDelivery: 120,
      },
    ],
  });
  console.log(formDataParam);

  useEffect(() => {
    if (formDataParam) {
      try {
        const parsed = JSON.parse(formDataParam as string);
        console.log("=-=", parsed);
        // Convert backend format into your local format if needed
        const transformedData = {
          tiffinName: parsed.tiffinName || "",
          description: parsed.description || "",
          mealTimings:
            parsed.mealTimings?.map((m: any) => ({
              mealType: m.mealType,
              checked: true,
              startTime: m.startTime,
              endTime: m.endTime,
            })) || [],
          foodType: parsed.foodType || "Veg",
          includedDescription: parsed.whatsIncludes || "",
          orderTypes: {
            dining: parsed.orderTypes?.includes("Dining") || false,
            delivery: parsed.orderTypes?.includes("Delivery") || false,
          },
          pricing:
            parsed.pricing?.map((p: any) => ({
              planType: p.planType,
              foodType: p.foodType,
              perMealDining: p.perMealDining,
              perMealDelivery: p.perMealDelivery,
              weeklyDining: p.weeklyDining || 0,
              weeklyDelivery: p.weeklyDelivery || 0,
              monthlyDining: p.monthlyDining || 0,
              monthlyDelivery: p.monthlyDelivery || 0,
              perBreakfastDining: p.perBreakfastDining || 0,
              perBreakfastDelivery: p.perBreakfastDelivery || 0,
              offers: p.offers || "",
            })) || [],
        };

        setFormData(transformedData);
      } catch (error) {
        console.error("Error parsing formDataParam:", error);
      }
    }
  }, [formDataParam]);

  const updateField = (key: string, value: any) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const toggleMeal = (index: number) =>
    setFormData((prev) => {
      const newMeals = [...prev.mealTimings];
      newMeals[index].checked = !newMeals[index].checked;
      return { ...prev, mealTimings: newMeals };
    });

  const updateMealTime = (
    index: number,
    key: "startTime" | "endTime",
    value: string
  ) =>
    setFormData((prev) => {
      const newMeals = [...prev.mealTimings];
      newMeals[index][key] = value;
      return { ...prev, mealTimings: newMeals };
    });

  const updateOrderType = (type: "dining" | "delivery") =>
    setFormData((prev) => ({
      ...prev,
      orderTypes: { ...prev.orderTypes, [type]: !prev.orderTypes[type] },
    }));

  const updatePricingBlock = (
    index: number,
    key: "planType" | "foodType",
    value: string
  ) =>
    setFormData((prev) => {
      const newPricing = [...prev.pricing];
      newPricing[index][key] = value;
      return { ...prev, pricing: newPricing };
    });

  const updatePricingValue = (index: number, key: string, value: number) =>
    setFormData((prev) => {
      const newPricing: any = [...prev.pricing];
      newPricing[index][key] = value;
      return { ...prev, pricing: newPricing };
    });

  const addPricingBlock = () =>
    setFormData((prev) => ({
      ...prev,
      pricing: [
        ...prev.pricing,
        {
          planType: "",
          foodType: "",
          perMealDining: 120,
          perMealDelivery: 120,
          weeklyDining: 120,
          weeklyDelivery: 120,
          monthlyDining: 120,
          monthlyDelivery: 120,
          perBreakfastDelivery: 120,
          perBreakfastDining: 200,
        },
      ],
    }));

  const resetForm = () => {
    setFormData({
      tiffinName: "",
      description: "",
      mealTimings: [
        {
          mealType: "Breakfast",
          checked: false,
          startTime: "7:00 AM",
          endTime: "9:00 AM",
        },
        {
          mealType: "Lunch",
          checked: false,
          startTime: "12:00 PM",
          endTime: "2:00 PM",
        },
        {
          mealType: "Dinner",
          checked: false,
          startTime: "8:00 PM",
          endTime: "10:00 PM",
        },
      ],
      foodType: "Veg",
      includedDescription: "",
      orderTypes: { dining: false, delivery: false },
      pricing: [
        {
          planType: "",
          foodType: "",
          perMealDining: 120,
          perMealDelivery: 120,
          weeklyDining: 120,
          weeklyDelivery: 120,
          monthlyDining: 120,
          monthlyDelivery: 120,
          perBreakfastDelivery: 120,
          perBreakfastDining: 200,
        },
      ],
    });
  };

  const validateForm = () => {
    if (!formData.tiffinName.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter the Tiffin/Restaurant Name."
      );
      return false;
    }

    if (!formData.description.trim()) {
      Alert.alert("Validation Error", "Please enter a Description.");
      return false;
    }

    // At least one meal should be selected
    if (!formData.mealTimings.some((m) => m.checked)) {
      Alert.alert("Validation Error", "Please select at least one meal.");
      return false;
    }

    // All selected meals should have start and end times
    for (let meal of formData.mealTimings) {
      if (meal.checked && (!meal.startTime || !meal.endTime)) {
        Alert.alert(
          "Validation Error",
          `Please select timing for ${meal.mealType}.`
        );
        return false;
      }
    }

    if (!formData.foodType) {
      Alert.alert("Validation Error", "Please select a Food Type.");
      return false;
    }

    if (!formData.includedDescription.trim()) {
      Alert.alert("Validation Error", "Please enter what's included.");
      return false;
    }

    if (!formData.orderTypes.dining && !formData.orderTypes.delivery) {
      Alert.alert("Validation Error", "Please select at least one Order Type.");
      return false;
    }

    // Validate pricing blocks
    for (let i = 0; i < formData.pricing.length; i++) {
      const block = formData.pricing[i];
      if (!block.planType) {
        Alert.alert(
          "Validation Error",
          `Please select Plan Type for pricing block ${i + 1}.`
        );
        return false;
      }
      if (!block.foodType) {
        Alert.alert(
          "Validation Error",
          `Please select Food Type for pricing block ${i + 1}.`
        );
        return false;
      }
    }

    return true;
  };

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <CommonHeader
          title="Add New Tiffen Service"
          actionText="Reset"
          onActionPress={resetForm}
        />
      </SafeAreaView>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* Basic Info */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Image source={Images.menu} style={{ height: 16, width: 16 }} />
            <Text style={styles.heading}>Basic Information</Text>
          </View>

          <LabeledInput
            label="Tiffin/Restaurant Name *"
            placeholder="e.g., Maharashtrian Ghar Ka Khana"
            value={formData.tiffinName}
            onChangeText={(val) => updateField("tiffinName", val)}
            labelStyle={styles.label}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputBox}
          />

          <LabeledInput
            label="Description *"
            placeholder="Write about your service..."
            value={formData.description}
            onChangeText={(val) => updateField("description", val)}
            multiline
            textAlignVertical="auto"
            labelStyle={styles.label}
            inputContainerStyle={[styles.inputBox, styles.textArea]}
            containerStyle={styles.descContainer}
          />

          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>
            Meal Preference*
          </Text>
          {formData.mealTimings.map((meal, index) => (
            <View key={meal.mealType}>
              <MealCheckbox
                label={`${meal.mealType} (${meal.startTime} - ${meal.endTime})`}
                checked={meal.checked}
                onToggle={() => toggleMeal(index)}
              />
              <Text style={styles.subLabel}>Delivery Timing *</Text>
              <View style={styles.row}>
                <TimePicker
                  value={meal.startTime}
                  containerStyle={styles.flex}
                  onChange={(val) => updateMealTime(index, "startTime", val)}
                />
                <TimePicker
                  value={meal.endTime}
                  containerStyle={styles.flex}
                  onChange={(val) => updateMealTime(index, "endTime", val)}
                />
              </View>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Food Type*</Text>
          {FOOD_TYPES.map((type) => (
            <RadioButton
              key={type.value}
              label={type.label}
              selected={formData.foodType === type.value}
              onPress={() => updateField("foodType", type.value)}
            />
          ))}

          <LabeledInput
            label="What's included *"
            placeholder="Describe what's Included in your tiffin menus..."
            value={formData.includedDescription}
            onChangeText={(val) => updateField("includedDescription", val)}
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
            checked={formData.orderTypes.dining}
            onToggle={() => updateOrderType("dining")}
            containerStyle={styles.checkboxSpacing}
          />
          <MealCheckbox
            label="Delivery"
            checked={formData.orderTypes.delivery}
            onToggle={() => updateOrderType("delivery")}
            containerStyle={styles.checkboxSpacing}
          />
        </View>

        {/* Pricing */}
        <View style={[styles.card, { padding: 0 }]}>
          <Text style={[styles.heading, styles.cardHeading]}>
            ₹ Pricing Information
          </Text>
          {formData.pricing.map((block, index) => (
            <View key={index} style={styles.innerCard}>
              <CommonDropdown
                items={ROLES}
                label="Choose Plan Type"
                value={block.planType}
                setValue={(val: any) =>
                  updatePricingBlock(index, "planType", val)
                }
              />
              <CommonDropdown
                items={FOOD_TYPES}
                label="Food Type"
                value={block.foodType}
                setValue={(val: any) =>
                  updatePricingBlock(index, "foodType", val)
                }
              />
              <View style={styles.row}>
                <StepperInput
                  label="Per Breakfast for Dining (₹)"
                  value={block.perBreakfastDining}
                  onChange={(val) =>
                    updatePricingValue(index, "perBreakfastDining", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
                <StepperInput
                  label="Per meal for Breakfast for Delivery (₹)"
                  value={block.perBreakfastDelivery}
                  onChange={(val) =>
                    updatePricingValue(index, "perBreakfastDelivery", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
              </View>
              <View style={styles.row}>
                <StepperInput
                  label="Per Meal for Dining (₹)"
                  value={block.perMealDining}
                  onChange={(val) =>
                    updatePricingValue(index, "perMealDining", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
                <StepperInput
                  label="Per Meal for Delivery (₹)"
                  value={block.perMealDelivery}
                  onChange={(val) =>
                    updatePricingValue(index, "perMealDelivery", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
              </View>
              <View style={styles.row}>
                <StepperInput
                  label="Weekly for Dining (₹)"
                  value={block.weeklyDining}
                  onChange={(val) =>
                    updatePricingValue(index, "weeklyDining", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
                <StepperInput
                  label="Weekly for Delivery (₹)"
                  value={block.weeklyDelivery}
                  onChange={(val) =>
                    updatePricingValue(index, "weeklyDelivery", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
              </View>
              <View style={styles.row}>
                <StepperInput
                  label="Monthly for Dining (₹)"
                  value={block.monthlyDining}
                  onChange={(val) =>
                    updatePricingValue(index, "monthlyDining", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
                <StepperInput
                  label="Monthly for Delivery (₹)"
                  value={block.monthlyDelivery}
                  onChange={(val) =>
                    updatePricingValue(index, "monthlyDelivery", val)
                  }
                  step={1}
                  min={50}
                  max={500}
                />
              </View>
            </View>
          ))}
          <TouchableOpacity onPress={addPricingBlock}>
            <Text style={styles.addMore}>+ Add More Pricing</Text>
          </TouchableOpacity>
        </View>

        <CommonButton
          title="Next"
          onPress={() => {
            if (validateForm()) {
              router.push({
                pathname: "/(secure)/(service)/addNewService1",
                params: {
                  formData: JSON.stringify(formData),
                  extraData: formDataParam,
                  isEdit,
                  id,
                },
              });
            }
          }}
          buttonStyle={{ marginBottom: IS_ANDROID ? 50 : 10 }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default BasicInfoForm;

// Styles remain unchanged
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
