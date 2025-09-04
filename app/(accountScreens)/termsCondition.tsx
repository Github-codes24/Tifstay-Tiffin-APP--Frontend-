import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const TermsAndConditionsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>1. Acceptance</Text>
        <Text style={styles.paragraph}>
          By using this app, you agree to these terms. If not, please stop using
          it.
        </Text>

        <Text style={styles.sectionTitle}>2. Our Role</Text>
        <Text style={styles.paragraph}>
          We connect you with verified Tiffin Providers & Hostel Owners. We do
          not own or operate these services.
        </Text>

        <Text style={styles.sectionTitle}>3. Your Responsibilities</Text>
        <Text style={styles.bullet}>• Provide accurate booking details.</Text>
        <Text style={styles.bullet}>
          • Follow provider’s cancellation/refund rules.
        </Text>
        <Text style={styles.bullet}>
          • Use the app legally and respectfully.
        </Text>

        <Text style={styles.sectionTitle}>4. Payments & Refunds</Text>
        <Text style={styles.bullet}>• Payments are processed securely.</Text>
        <Text style={styles.bullet}>
          • Refunds follow provider’s policy & payment method timelines.
        </Text>

        <Text style={styles.sectionTitle}>5. Cancellations</Text>
        <Text style={styles.paragraph}>
          Cancel via My Bookings. Refunds depend on provider’s rules.
        </Text>

        <Text style={styles.sectionTitle}>6. Liability</Text>
        <Text style={styles.paragraph}>
          We’re not responsible for service quality, losses, delays, or events
          beyond our control.
        </Text>

        <Text style={styles.sectionTitle}>7. Changes</Text>
        <Text style={styles.paragraph}>
          We may update these terms anytime. Continued use means you accept
          them.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact</Text>
        <Text style={styles.paragraph}>
          Email support@[yourdomain].com or use Contact Us in the app.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily:fonts.interRegular,
    marginTop: 5,
    color:Colors.title
  },
  paragraph: {
    fontSize: 16,
    fontFamily:fonts.interRegular,
    color:Colors.title,
    marginTop: 8,
  },
  bullet: {
    fontSize: 16,
    fontFamily:fonts.interRegular,
    marginTop: 6,
    color:Colors.title,
    marginLeft: 16,
  },
});