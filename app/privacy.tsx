import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.bullet}>
          • Personal Info: Name, phone, email, address when you register or
          book.
        </Text>
        <Text style={styles.bullet}>
          • Usage Data: Device type, location (if allowed), app activity.
        </Text>
        <Text style={styles.bullet}>
          • Booking & Payment Data: Tiffin/Hostel bookings, payment details
          (processed securely by third parties).
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.bullet}>
          • To process your bookings and payments.
        </Text>
        <Text style={styles.bullet}>
          • To personalize recommendations based on your city/location.
        </Text>
        <Text style={styles.bullet}>
          • To send booking updates, offers, and support messages.
        </Text>

        <Text style={styles.sectionTitle}>3. Data Sharing</Text>
        <Text style={styles.paragraph}>
          We never sell your personal data. We may share necessary details with:
        </Text>
        <Text style={styles.bullet}>
          • Service providers (for booking fulfillment).
        </Text>
        <Text style={styles.bullet}>
          • Payment gateways (for secure transactions).
        </Text>
        <Text style={styles.bullet}>
          • Analytics tools (anonymized data only).
        </Text>

        <Text style={styles.sectionTitle}>4. Your Choices</Text>
        <Text style={styles.bullet}>
          • Edit/delete your account anytime in Settings.
        </Text>
        <Text style={styles.bullet}>
          • Opt-out of promotional messages in Notifications settings.
        </Text>
        <Text style={styles.bullet}>
          • Request data deletion via support@yourdomain.com.
        </Text>

        <Text style={styles.sectionTitle}>5. Security</Text>
        <Text style={styles.paragraph}>
          We use encryption, secure servers, and access control to protect your
          data.
        </Text>

        <Text style={styles.sectionTitle}>6. Children’s Privacy</Text>
        <Text style={styles.paragraph}>
          This app is for users 18+. We do not knowingly collect information
          from children under 13.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 20,
  },
  bullet: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
    marginLeft: 16,
    marginTop: 6,
  },
  paragraph: {
    fontSize: 14,
    color: "#444",
    marginTop: 8,
  },
});
