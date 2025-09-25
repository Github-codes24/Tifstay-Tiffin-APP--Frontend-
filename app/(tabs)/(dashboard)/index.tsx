/* eslint-disable no-unused-expressions */
import CommonButton from "@/components/CommonButton";
import TiffinCard from "@/components/CommonServiceCard";
import HostelCard from "@/components/HostelCard";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { IS_IOS } from "@/constants/Platform";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceOfflineScreen() {
  const { hostelList, getHostelList, getUserProfile, user } = useAuthStore();
  const [isOnline, setIsOnline] = useState(false);
  const [type, setType] = useState<"hostel_owner" | "tiffin_provider">(
    "hostel_owner"
  );
  const isTiffinProvider = type === "tiffin_provider";

  useEffect(() => {
    AsyncStorage.getItem("userServiceType").then((type) => {
      if (type) {
        setType(type === "hostelOwner" ? "hostel_owner" : "tiffin_provider");
      }
    });
  }, []);

  useEffect(() => {
    getHostelList();
    getUserProfile(type);
  }, [type, getHostelList, getUserProfile]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={isTiffinProvider ? Images.user : { uri: user?.profileImage }}
          style={styles.logo}
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>
            {isTiffinProvider ? "Maharashtrian Ghar Ka Khana" : user?.fullName}
          </Text>
          <Text style={styles.subtitle}>
            {isTiffinProvider
              ? "Manage your tiffin services"
              : "Manage your hostel properties"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.onlineButton}
          onPress={() => {
            setIsOnline(!isOnline); // toggle online/offline
            // if you want navigation only when going online
            if (!isOnline && isTiffinProvider) {
              router.push("/(tabs)/(dashboard)/service");
            }
          }}
        >
          <Text style={styles.onlineButtonText}>
            {isOnline ? "Go Offline" : "Go Online"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      {!isOnline ? (
        <View style={styles.body}>
          <Text style={styles.infoText}>
            You have marked your service as offline
          </Text>
          <Image source={Images.storeclose} style={styles.shopImage} />
          <Text style={styles.footerText}>
            Your Service will be offline until you turn it on
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: IS_IOS ? 120 : 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.card}>
              <Image
                source={isTiffinProvider ? Images.order : Images.hostel}
                style={styles.icon24}
              />
              <Text style={[styles.cardNumber, { color: Colors.primary }]}>
                02
              </Text>
              <Text style={[styles.cardText, { color: Colors.primary }]}>
                {isTiffinProvider ? "New Orders" : "Total Hostels"}
              </Text>
            </View>
            <View style={styles.card}>
              <Image source={Images.req} style={styles.icon24} />
              <Text style={[styles.cardNumber, { color: Colors.orange }]}>
                0
              </Text>
              <Text style={[styles.cardText, { color: Colors.orange }]}>
                {isTiffinProvider ? "Order Request" : "Request"}
              </Text>
            </View>
          </View>

          <View style={[styles.statsRow, { marginBottom: 24 }]}>
            <View style={styles.card}>
              <Image
                source={isTiffinProvider ? Images.complete : Images.bad}
                style={styles.icon24}
              />
              <Text style={[styles.cardNumber, { color: Colors.green }]}>
                01
              </Text>
              <Text style={[styles.cardText, { color: Colors.green }]}>
                {isTiffinProvider ? "Completed Orders" : "Accepted"}
              </Text>
            </View>
            <View style={styles.card}>
              <Image source={Images.cancel} style={styles.icon24} />
              <Text style={[styles.cardNumber, { color: Colors.red }]}>01</Text>
              <Text style={[styles.cardText, { color: Colors.red }]}>
                {isTiffinProvider ? "Canceled Orders" : "Canceled"}
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image source={Images.watch} style={styles.icon16} />
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors.primary },
                ]}
                onPress={() => {
                  isTiffinProvider
                    ? router.push("/(service)/addNewService")
                    : router.push("/(hostelService)/addNewHostelService");
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.actionText}>Add Service</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors.orange },
                ]}
                onPress={() => {
                  router.push("/(tabs)/earnings");
                }}
              >
                <Ionicons
                  name="trending-up-outline"
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.actionText}>View Earnings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Earnings Overview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image source={Images.total} style={styles.icon16} />
              <Text style={styles.sectionTitle}>Earnings Overview</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsValue}>₹3250</Text>
              <Text style={styles.earningsChange}>+18%</Text>
            </View>
            <View style={[styles.earningsRow, { marginTop: 0 }]}>
              <Text style={styles.subText}>{"This week's total"}</Text>
              <Text style={styles.subText}>vs last week</Text>
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.reviewBox}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewTitle}>Reviews</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push("/review");
                }}
              >
                <Text style={styles.linkText}>See All Reviews</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reviewRow}>
              <Image source={Images.star} style={styles.icon20} />
              <Text style={styles.reviewScore}>4.9</Text>
              <Text style={styles.subText}>(25 reviews)</Text>
            </View>
          </View>

          {/* Services */}
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceTitle}>
              {" "}
              {isTiffinProvider ? "My Tiffin/Restaurant" : "My PG/Hostel"}
            </Text>
            <Text style={styles.serviceCount}>
              {hostelList?.length} service
            </Text>
          </View>
          {isTiffinProvider ? (
            <TiffinCard />
          ) : (
            <>
              {hostelList?.map((hostel: any) => (
                <HostelCard hostel={hostel} key={hostel._id} />
              ))}
            </>
          )}
          <CommonButton
            title="+ Add New Service"
            onPress={() => {
              isTiffinProvider
                ? router.push("/(service)/addNewService")
                : router.push("/(hostelService)/addNewHostelService");
            }}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  header: { flexDirection: "row", alignItems: "center", padding: 15 },
  logo: { width: 40, height: 40, borderRadius: 24, marginRight: 10 },
  headerText: { flex: 1 },
  title: { fontSize: 16, fontFamily: fonts.interMedium, color: Colors.title },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },

  onlineButton: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  onlineButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: fonts.interMedium,
  },

  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    fontFamily: fonts.interMedium,
    color: Colors.title,
    marginBottom: 20,
  },
  shopImage: { width: 208, height: 208, marginBottom: 20 },
  footerText: {
    fontSize: 16,
    fontFamily: fonts.interMedium,
    color: Colors.title,
    marginBottom: 20,
    textAlign: "center",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  card: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    alignItems: "center",
  },
  cardNumber: {
    fontSize: 36,
    fontFamily: fonts.interSemibold,
    marginTop: 6,
  },
  cardText: { fontSize: 13, fontFamily: fonts.interRegular, marginTop: 2 },

  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    padding: 16,
    marginBottom: 24,
    marginHorizontal: 6,
  },
  sectionHeader: { flexDirection: "row", gap: 5, alignItems: "center" },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    gap: 12,
  },
  actionText: {
    color: Colors.white,
    fontFamily: fonts.interSemibold,
    fontSize: 14,
  },

  earningsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  earningsValue: {
    fontSize: 30,
    fontFamily: fonts.interSemibold,
    color: Colors.orange,
  },
  earningsChange: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  subText: {
    fontSize: 13,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
    marginTop: 4,
  },

  reviewBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 26,
    paddingHorizontal: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewTitle: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.title,
  },
  linkText: {
    color: Colors.orange,
    fontFamily: fonts.interRegular,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  reviewRow: { flexDirection: "row", alignItems: "center" },
  reviewScore: {
    fontSize: 20,
    fontFamily: fonts.interSemibold,
    color: "#FCA613",
    marginLeft: 6,
    marginRight: 4,
  },

  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  serviceTitle: {
    fontFamily: fonts.interSemibold,
    fontSize: 16,
    color: Colors.title,
  },
  serviceCount: {
    fontFamily: fonts.interRegular,
    fontSize: 13,
    color: Colors.grey,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 12,
  },

  icon16: { height: 16, width: 16 },
  icon20: { height: 20, width: 20, marginBottom: 4 },
  icon24: { height: 24, width: 24 },
});
