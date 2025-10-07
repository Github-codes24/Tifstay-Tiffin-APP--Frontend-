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

const TermsAndConditionsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ContentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  const fetchTermsAndConditions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getTermAndCondition();

      if (response.success && response.data?.data) {
        const termsData = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;

        setData(termsData || null);
      } else {
        setError(response.error || "No terms and conditions available");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load terms and conditions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading Terms & Conditions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using this application, you accept and agree to be
            bound by the terms and provision of this agreement.
          </Text>

          <Text style={styles.sectionTitle}>2. Use License</Text>
          <Text style={styles.paragraph}>
            Permission is granted to temporarily use this application for
            personal, non-commercial transitory viewing only.
          </Text>

          <Text style={styles.sectionTitle}>3. Service Description</Text>
          <Text style={styles.paragraph}>
            We provide a platform for booking tiffin services and hostel
            accommodations. We act as an intermediary between users and service
            providers.
          </Text>

          <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
          <Text style={styles.bullet}>
            • Provide accurate information during registration and booking.
          </Text>
          <Text style={styles.bullet}>
            • Maintain the confidentiality of your account credentials.
          </Text>
          <Text style={styles.bullet}>
            • Comply with all applicable laws and regulations.
          </Text>

          <Text style={styles.sectionTitle}>5. Payment Terms</Text>
          <Text style={styles.paragraph}>
            All payments are processed through secure third-party payment
            gateways. Refund policies are subject to individual service provider
            terms.
          </Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        {data.title && <Text style={styles.mainTitle}>{data.title}</Text>}

        {data.sections && data.sections.length > 0
          ? data.sections.map((section, index) => (
              <View key={index} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{section.heading}</Text>
                <Text style={styles.paragraph}>{section.text}</Text>
              </View>
            ))
          : data.content && (
              <Text style={styles.paragraph}>{data.content}</Text>
            )}

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
