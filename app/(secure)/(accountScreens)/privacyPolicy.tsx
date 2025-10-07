import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import apiService from "@/services/hostelApiService";
import { ContentData } from "@/types/hostel";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PrivacyPolicyScreen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ContentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getPrivacyPolicy();

      if (response.success && response.data?.data) {
        // Handle both array and object responses
        const policyData = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;

        setData(policyData || null);
      } else {
        setError(response.error || "No privacy policy available");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load privacy policy");
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading Privacy Policy...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Empty State
  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          {/* Default Privacy Policy Content */}
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

          <Text style={styles.sectionTitle}>
            2. How We Use Your Information
          </Text>
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
            We never sell your personal data. We may share necessary details
            with:
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
            We use encryption, secure servers, and access control to protect
            your data.
          </Text>

          <Text style={styles.sectionTitle}>{"6. Children's Privacy"}</Text>
          <Text style={styles.paragraph}>
            This app is for users 18+. We do not knowingly collect information
            from children under 13.
          </Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Display API Data
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        {data.title && <Text style={styles.mainTitle}>{data.title}</Text>}

        {/* If data has sections array */}
        {data.sections && data.sections.length > 0
          ? data.sections.map((section, index) => (
              <View key={index} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{section.heading}</Text>
                <Text style={styles.paragraph}>{section.text}</Text>
              </View>
            ))
          : /* If data has plain content */
            data.content && (
              <Text style={styles.paragraph}>{data.content}</Text>
            )}

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
  scrollContent: {
    paddingHorizontal: 19,
    paddingTop: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.interRegular,
    color: Colors.red,
    textAlign: "center",
  },
  mainTitle: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    marginTop: 5,
    color: Colors.title,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.title,
    marginLeft: 16,
    marginTop: 6,
    lineHeight: 22,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
    marginTop: 8,
    lineHeight: 22,
  },
});
