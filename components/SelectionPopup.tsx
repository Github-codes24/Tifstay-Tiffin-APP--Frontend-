import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SelectionOption {
  value: string;
  label: string;
  icon?: string;
}

interface SelectionPopupProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  options: SelectionOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  showContinue?: boolean;
  continueText?: string;
}

const SelectionPopup: React.FC<SelectionPopupProps> = ({
  visible,
  title,
  subtitle,
  options,
  selectedValue,
  onSelect,
  onBack,
  onContinue,
  showContinue = true,
  continueText = "Continue",
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onBack}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.popupContainer}>
          {/* Header */}
          <View style={styles.popupHeader}>
            <Text style={styles.popupTitle}>{title}</Text>
            <TouchableOpacity
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={Colors.title} />
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          {subtitle && <Text style={styles.popupSubtitle}>{subtitle}</Text>}

          {/* Options List */}
          <ScrollView
            style={styles.optionsScrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    selectedValue === option.value && styles.optionItemSelected,
                  ]}
                  onPress={() => onSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionLeft}>
                    {option.icon && (
                      <View
                        style={[
                          styles.iconCircle,
                          selectedValue === option.value &&
                            styles.iconCircleSelected,
                        ]}
                      >
                        <Ionicons
                          name={option.icon as any}
                          size={20}
                          color={
                            selectedValue === option.value
                              ? Colors.white
                              : Colors.primary
                          }
                        />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        selectedValue === option.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radioButton,
                      selectedValue === option.value &&
                        styles.radioButtonSelected,
                    ]}
                  >
                    {selectedValue === option.value && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.popupFooter}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            {showContinue && (
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !selectedValue && styles.continueButtonDisabled,
                ]}
                onPress={onContinue}
                disabled={!selectedValue}
                activeOpacity={0.7}
              >
                <Text style={styles.continueButtonText}>{continueText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  popupContainer: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  popupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  popupTitle: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    flex: 1,
  },
  popupSubtitle: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  optionsScrollView: {
    maxHeight: 400,
  },
  optionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.white,
  },
  optionItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F7FF",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleSelected: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 15,
    fontFamily: fonts.interMedium,
    color: Colors.title,
    flex: 1,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontFamily: fonts.interSemibold,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  popupFooter: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.primary,
  },
  continueButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonDisabled: {
    backgroundColor: Colors.grey,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.white,
  },
});

export default SelectionPopup;
