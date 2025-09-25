import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import CommonHeader from "@/components/CommonHeader";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";

const EarningsScreen = () => {
  const payoutHistory = [
    { id: "1", amount: 15200, date: "2025-07-10", status: "Processing" },
    { id: "2", amount: 5200, date: "2024-01-20", status: "Completed" },
  ];

  const renderPayoutItem = ({ item }: any) => (
    <View style={styles.payoutRow}>
      <View>
        <Text style={styles.amount}>₹{item.amount}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          item.status === "Completed" ? styles.completed : styles.processing,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            item.status === "Completed"
              ? styles.completedText
              : styles.processingText,
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <View style={{ backgroundColor: Colors.white }}>
          <CommonHeader title="Earnings" />
        </View>
      </SafeAreaView>
      <View style={styles.container}>
        {/* Earnings Overview */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Image source={Images.total} style={{ height: 16, width: 16 }} />
            <Text style={styles.header}>Earnings Overview</Text>
          </View>
          <View style={styles.overviewRow}>
            <View style={[styles.overviewBox]}>
              <Text style={[styles.overviewValue, { color: Colors.primary }]}>
                ₹15420
              </Text>
              <Text style={[styles.overviewLabel, { color: Colors.primary }]}>
                Total Balance
              </Text>
            </View>
            <View style={[styles.overviewBox]}>
              <Text style={[styles.overviewValue, { color: Colors.orange }]}>
                ₹3250
              </Text>
              <Text style={[styles.overviewLabel, { color: Colors.orange }]}>
                This Week
              </Text>
            </View>
          </View>
          <View
            style={[styles.overviewBox, { alignSelf: "center", marginTop: 12 }]}
          >
            <Text style={[styles.overviewValue, { color: Colors.green }]}>
              ₹12450
            </Text>
            <Text style={[styles.overviewLabel, { color: Colors.green }]}>
              This Month
            </Text>
          </View>
        </View>

        {/* Payout History */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Image source={Images.calender} style={{ height: 16, width: 16 }} />
            <Text style={styles.header}>Payout History</Text>
          </View>
          <FlatList
            data={payoutHistory}
            keyExtractor={(item) => item.id}
            renderItem={renderPayoutItem}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    padding: 16,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  header: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginLeft: 6,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
  },
  overviewBox: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "48%",
    borderColor: Colors.lightGrey,
  },
  overviewValue: {
    fontSize: 24,
    fontFamily: fonts.interSemibold,
  },
  overviewLabel: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: fonts.interRegular,
  },
  payoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  amount: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  date: {
    fontSize: 11,
    fontFamily: fonts.interRegular,
    color: Colors.tabicon,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  completed: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.green,
  },
  processing: {
    backgroundColor: Colors.tabbg,
    borderColor: Colors.primary,
  },
  completedText: {
    color: Colors.green,
    fontSize: 11,
    fontFamily: fonts.interRegular,
  },
  processingText: {
    color: Colors.primary,
    fontSize: 11,
    fontFamily: fonts.interRegular,
  },
  statusText: {
    fontSize: 13,
  },
});

export default EarningsScreen;
