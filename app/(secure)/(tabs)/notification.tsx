// app/(tabs)/notification.tsx

import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Images } from "@/constants/Images";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonHeader from "@/components/CommonHeader";
import { fonts } from "@/constants/typography";

const notifications = [
  {
    id: 1,
    date: "Today",
    title: "New Order Received",
    message:
      "You've got a new tiffin order! Tap to view details and start preparing.",
    icon: Images.newOrder, // ✅ centralized
    backgroundColor: "#F4F6FF",
  },
  {
    id: 2,
    date: "Today",
    title: "Order Accepted Confirmation",
    message: "You've accepted the order. Keep it ready by the scheduled time!",
    icon: Images.oederAccepted,
    backgroundColor: Colors.primary,
    textColor: Colors.white,
  },
  {
    id: 3,
    date: "Sunday, July 9, 2025",
    title: "Earnings Summary (Weekly)",
    message: "You earned ₹22000 this week. Keep it up!",
    icon: Images.earningSummary,
    backgroundColor: "#F4F6FF",
  },
  {
    id: 4,
    date: "Monday, June 16, 2025",
    title: "Tiffin Service Approved",
    message: "Your new tiffin service has been approved and is now live!",
    icon: Images.tiffinService,
    backgroundColor: "#F4F6FF",
  },
];

export default function NotificationScreen() {
  const grouped = groupByDate(notifications);

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <View style={{ backgroundColor: Colors.white }}>
          <CommonHeader title="Notifications" />
        </View>
      </SafeAreaView>
      <ScrollView
        style={styles.container}
      >
        {Object.entries(grouped).map(([date, items]) => (
          <View key={date}>
            <Text style={styles.dateLabel}>{date}</Text>
            {items.map((item) => (
              <View
                key={item.id}
                style={[styles.card, { backgroundColor: item.backgroundColor }]}
              >
                <View style={styles.iconWrapper}>
                  <Image source={item.icon} style={styles.icon} />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.title,
                      item.textColor ? { color: item.textColor } : {color : Colors.title},
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.message,
                      item.textColor ? { color: item.textColor } : {color : Colors.grey},
                    ]}
                  >
                    {item.message}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

function groupByDate(data: typeof notifications) {
  const grouped: Record<string, typeof notifications> = {};
  for (const item of data) {
    if (!grouped[item.date]) {
      grouped[item.date] = [];
    }
    grouped[item.date].push(item);
  }
  return grouped;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
  },
  dateLabel: {
    fontSize: 16,
    color: Colors.tabicon,
    fontFamily:fonts.interMedium,
    marginBottom: 16,
    marginTop: 16,
  },
  card: {
    height: 100,
    flexDirection: "row",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    elevation: 2,
  },
  icon: {
    width: 52,
    height: 52,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily:fonts.interBold,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    fontFamily:fonts.interRegular,
    paddingRight:30
},
});
