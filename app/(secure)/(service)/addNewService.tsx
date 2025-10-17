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
import React, { useCallback, useEffect, useState } from "react";
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
  { label: "With lunch & dinner & breakfast", value: "With lunch & dinner & breakfast" },
  { label: "With breakfast", value: "With breakfast" },
];

const ROLES1 = [
  { label: "With one meal", value: "With one meal" },
  { label: "One meal with breakfast", value: "One meal with breakfast" },
];

const ROLES2 = [
  { label: "With two meal", value: "With two meal" },
  { label: "One meal with breakfast", value: "One meal with breakfast" },
];

const ROLES_BREAKFAST = [
  { label: "With breakfast", value: "With breakfast" },
];

const ROLES_LUNCH = [
  { label: "With one meal", value: "With one meal" },
];

const ROLES_DINNER = [
  { label: "With two meal", value: "With two meal" },
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
      { mealType: "Breakfast", checked: false, startTime: "7:00 AM", endTime: "9:00 AM" },
      { mealType: "Lunch", checked: false, startTime: "12:00 PM", endTime: "2:00 PM" },
      { mealType: "Dinner", checked: false, startTime: "8:00 PM", endTime: "10:00 PM" },
    ],
    foodType: "Veg",
    includedDescription: "",
    orderTypes: { dining: false, delivery: false },
    pricing: [
      { planType: "", foodType: "Veg", perMealDining: 120, perMealDelivery: 120, weeklyDining: 120, weeklyDelivery: 120, monthlyDining: 120, monthlyDelivery: 120 },
    ],
  });

  const getPlanOptions = (mealTimings = formData.mealTimings) => {
    const selectedMeals = mealTimings
      .filter((meal) => meal.checked)
      .map((meal) => meal.mealType);
  
    const len = selectedMeals.length;
  
    if (len === 1) {
      const meal = selectedMeals[0];
      if (meal === "Breakfast") return ROLES_BREAKFAST;
      if (meal === "Lunch") return ROLES_LUNCH;
      if (meal === "Dinner") return ROLES_DINNER;
    }
  
    if (len === 2) {
      if (selectedMeals.includes("Breakfast") && selectedMeals.includes("Lunch")) return ROLES2;
      if (selectedMeals.includes("Lunch") && selectedMeals.includes("Dinner")) return ROLES1;
      if (selectedMeals.includes("Breakfast") && selectedMeals.includes("Dinner")) return ROLES2;
    }
  
    if (len === 3) return ROLES;
  
    return ROLES; // fallback
  };
  
  // Edit mode: parse and prefill
  useEffect(() => {
    if (formDataParam) {
      try {
        const parsed = JSON.parse(formDataParam as string);

        const defaultMeals = [
          { mealType: "Breakfast", checked: false, startTime: "7:00 AM", endTime: "9:00 AM" },
          { mealType: "Lunch", checked: false, startTime: "12:00 PM", endTime: "2:00 PM" },
          { mealType: "Dinner", checked: false, startTime: "8:00 PM", endTime: "10:00 PM" },
        ];

        const updatedMeals = defaultMeals.map((defaultMeal) => {
          const match = parsed.mealTimings?.find((m: any) => m.mealType === defaultMeal.mealType);
          if (match) {
            return {
              ...defaultMeal,
              checked: true,
              startTime: match.startTime || defaultMeal.startTime,
              endTime: match.endTime || defaultMeal.endTime,
            };
          }
          return defaultMeal;
        });

        const transformedData = {
          tiffinName: parsed.tiffinName || "",
          description: parsed.description || "",
          mealTimings: updatedMeals,
          foodType: parsed.foodType || "Veg",
          includedDescription: parsed.whatsIncludes || "",
          orderTypes: {
            dining: parsed.orderTypes?.includes("Dining") || false,
            delivery: parsed.orderTypes?.includes("Delivery") || false,
          },
          pricing: parsed.pricing?.map((p: any) => ({
            planType: p.planType,
            foodType: p.foodType,
            perMealDining: p.perMealDining,
            perMealDelivery: p.perMealDelivery,
            weeklyDining: p.weeklyDining || 0,
            weeklyDelivery: p.weeklyDelivery || 0,
            monthlyDining: p.monthlyDining || 0,
            monthlyDelivery: p.monthlyDelivery || 0,
            offers: p.offers || "",
          })) || [],
        };

        setFormData(transformedData);
      } catch (error) {
        console.error("Error parsing formDataParam:", error);
      }
    }
  }, [formDataParam]);

  // Update pricing foodType if main foodType changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      pricing: prev.pricing.map((p) => ({
        ...p,
        foodType: formData.foodType === "Both Veg & Non-Veg" ? p.foodType : formData.foodType,
      })),
    }));
  }, [formData.foodType]);

  const updateField = (key: string, value: any) => setFormData((prev) => ({ ...prev, [key]: value }));

  const toggleMeal = (index: number) =>
    setFormData((prev) => {
      const newMeals = [...prev.mealTimings];
      newMeals[index].checked = !newMeals[index].checked;
  
      // Compute plan options based on updated meals
      const planOptions = getPlanOptions(newMeals);
  
      const newPricing = prev.pricing.map((p) => ({
        ...p,
        planType: planOptions[0]?.value || "", // default to first option
      }));
  
      return { ...prev, mealTimings: newMeals, pricing: newPricing };
    });
  

  const updateMealTime = (index: number, key: "startTime" | "endTime", value: string) =>
    setFormData((prev) => {
      const newMeals = [...prev.mealTimings];
      newMeals[index][key] = value;
      return { ...prev, mealTimings: newMeals };
    });

  const updateOrderType = (type: "dining" | "delivery") =>
    setFormData((prev) => ({ ...prev, orderTypes: { ...prev.orderTypes, [type]: !prev.orderTypes[type] } }));

  const updatePricingBlock = (index: number, key: "planType" | "foodType", value: string) =>
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
          foodType: formData.foodType,
          perMealDining: 120,
          perMealDelivery: 120,
          weeklyDining: 120,
          weeklyDelivery: 120,
          monthlyDining: 120,
          monthlyDelivery: 120,
        },
      ],
    }));

  const resetForm = () => {
    setFormData({
      tiffinName: "",
      description: "",
      mealTimings: [
        { mealType: "Breakfast", checked: false, startTime: "7:00 AM", endTime: "9:00 AM" },
        { mealType: "Lunch", checked: false, startTime: "12:00 PM", endTime: "2:00 PM" },
        { mealType: "Dinner", checked: false, startTime: "8:00 PM", endTime: "10:00 PM" },
      ],
      foodType: "Veg",
      includedDescription: "",
      orderTypes: { dining: false, delivery: false },
      pricing: [
        { planType: "", foodType: "Veg", perMealDining: 120, perMealDelivery: 120, weeklyDining: 120, weeklyDelivery: 120, monthlyDining: 120, monthlyDelivery: 120 },
      ],
    });
  };

  const validateForm = () => {
    if (!formData.tiffinName.trim()) return Alert.alert("Validation Error", "Please enter the Tiffin/Restaurant Name.");
    if (!formData.description.trim()) return Alert.alert("Validation Error", "Please enter a Description.");
    if (!formData.mealTimings.some((m) => m.checked)) return Alert.alert("Validation Error", "Please select at least one meal.");
    for (let meal of formData.mealTimings) {
      if (meal.checked && (!meal.startTime || !meal.endTime)) {
        return Alert.alert("Validation Error", `Please select timing for ${meal.mealType}.`);
      }
    }
    if (!formData.foodType) return Alert.alert("Validation Error", "Please select a Food Type.");
    if (!formData.includedDescription.trim()) return Alert.alert("Validation Error", "Please enter what's included.");
    if (!formData.orderTypes.dining && !formData.orderTypes.delivery) return Alert.alert("Validation Error", "Please select at least one Order Type.");

    for (let i = 0; i < formData.pricing.length; i++) {
      const block = formData.pricing[i];
      if (!block.planType) return Alert.alert("Validation Error", `Please select Plan Type for pricing block ${i + 1}.`);
      if (!block.foodType) return Alert.alert("Validation Error", `Please select Food Type for pricing block ${i + 1}.`);
    }
    return true;
  };

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <CommonHeader title={isEdit ? "Edit Tiffen Service" : "Add New Tiffen Service"} actionText="Reset" onActionPress={resetForm} />
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

          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Meal Preference*</Text>
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
          <Text style={[styles.heading, styles.cardHeading]}>₹ Pricing Information</Text>
          {formData.pricing.map((block, index) => (
            <View key={index} style={styles.innerCard}>
              <CommonDropdown
                items={getPlanOptions()}
                label="Choose Plan Type"
                value={block.planType}
                setValue={(val: any) => updatePricingBlock(index, "planType", val)}
              />
              <CommonDropdown
                items={FOOD_TYPES}
                label="Food Type"
                value={block.foodType}
                setValue={(val: any) => updatePricingBlock(index, "foodType", val)}
              />

              {(formData.orderTypes.dining || formData.orderTypes.delivery) && (
                <>
                  <View style={styles.row}>
                    {formData.orderTypes.dining && (
                      <StepperInput
                        label="Per Meal for Dining (₹)"
                        value={block.perMealDining}
                        onChange={(val) => updatePricingValue(index, "perMealDining", val)}
                        step={1}
                        min={50}
                        max={500}
                      />
                    )}
                    {formData.orderTypes.delivery && (
                      <StepperInput
                        label="Per Meal for Delivery (₹)"
                        value={block.perMealDelivery}
                        onChange={(val) => updatePricingValue(index, "perMealDelivery", val)}
                        step={1}
                        min={50}
                        max={500}
                      />
                    )}
                  </View>

                  <View style={styles.row}>
                    {formData.orderTypes.dining && (
                      <StepperInput
                        label="Weekly for Dining (₹)"
                        value={block.weeklyDining}
                        onChange={(val) => updatePricingValue(index, "weeklyDining", val)}
                        step={1}
                        min={50}
                        max={500}
                      />
                    )}
                    {formData.orderTypes.delivery && (
                      <StepperInput
                        label="Weekly for Delivery (₹)"
                        value={block.weeklyDelivery}
                        onChange={(val) => updatePricingValue(index, "weeklyDelivery", val)}
                        step={1}
                        min={50}
                        max={500}
                      />
                    )}
                  </View>

                  <View style={styles.row}>
                    {formData.orderTypes.dining && (
                      <StepperInput
                        label="Monthly for Dining (₹)"
                        value={block.monthlyDining}
                        onChange={(val) => updatePricingValue(index, "monthlyDining", val)}
                        step={1}
                        min={50}
                        max={500}
                      />
                    )}
                    {formData.orderTypes.delivery && (
                      <StepperInput
                        label="Monthly for Delivery (₹)"
                        value={block.monthlyDelivery}
                        onChange={(val) => updatePricingValue(index, "monthlyDelivery", val)}
                        step={1}
                        min={50}
                        max={500}
                      />
                    )}
                  </View>
                </>
              )}
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

// ✅ No UI Changes Below
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
  row: { flexDirection: "row", justifyContent: "space-between", gap: 20, flexWrap: "wrap" },
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
  innerCircle: { width: 9, height: 9, borderRadius: 6, backgroundColor: "#1E40AF" },
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
