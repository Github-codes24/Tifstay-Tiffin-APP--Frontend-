import BookingCard from "@/components/BookingCard";
import CommonHeader from "@/components/CommonHeader";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { router } from "expo-router";
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const subscribers = [
  { id: "1", name: "Onli Karmokar", plan: "Weekly (Veg Lunch)" },
  { id: "2", name: "Annette Black", plan: "Monthly (Non-Veg Dinner)" },
];

const RequestsRoute = () => (
  <ScrollView style={styles.scene} showsVerticalScrollIndicator={false}>
    <View style={styles.badgeOrange}>
      <Text style={styles.badgeTextOrange}>Requests</Text>
    </View>
    <BookingCard
      status="Accepted"
      bookingId="#TF2024002"
      orderedDate="21/07/2025"
      tiffinService="Maharashtrian Ghar Ka Khana"
      customer="Onil Karmokar"
      startDate="21/07/25"
      mealType="Breakfast, Lunch, Dinner"
      plan="Daily"
      orderType="Delivery"
      onPressUpdate={() => alert("Update Order Summary clicked!")}
      isReq
      onAccept={() => {}}
      onReject={() => {}}
    />
  </ScrollView>
);

const AcceptedRoute = () => (
  <ScrollView style={styles.scene} showsVerticalScrollIndicator={false}>
    <View style={styles.badgePrimary}>
      <Text style={styles.badgeTextPrimary}>Accepted</Text>
    </View>
    <BookingCard
      status="Accepted"
      bookingId="#TF2024002"
      orderedDate="21/07/2025"
      tiffinService="Maharashtrian Ghar Ka Khana"
      customer="Onil Karmokar"
      startDate="21/07/25"
      mealType="Breakfast, Lunch, Dinner"
      plan="Daily"
      orderType="Delivery"
      // For accepted orders (non-subscriber)
      onPressUpdate={() => {
        router.push({
          pathname: "/orderDetails",
          params: { isSubscriber: "false" },
        });
      }}
    />
  </ScrollView>
);

const CompletedRoute = () => (
  <ScrollView style={styles.scene} showsVerticalScrollIndicator={false}>
    <View style={styles.badgeGreen}>
      <Text style={styles.badgeTextGreen}>Completed</Text>
    </View>
    <BookingCard
      status="Accepted"
      bookingId="#TF2024002"
      orderedDate="21/07/2025"
      tiffinService="Maharashtrian Ghar Ka Khana"
      customer="Onil Karmokar"
      startDate="21/07/25"
      mealType="Breakfast, Lunch, Dinner"
      plan="Daily"
      orderType="Delivery"
      statusText="Completed"
    />
  </ScrollView>
);

interface SubscriberCardProps {
  name: string;
  plan: string;
  onPressDetails: () => void;
}

const SubscriberCard: React.FC<SubscriberCardProps> = ({
  name,
  plan,
  onPressDetails,
}) => (
  <View style={styles.subscriberCard}>
    <Image source={Images.user} style={styles.avatar} />
    <View style={styles.textContainer}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.plan}>{plan}</Text>
    </View>
    <TouchableOpacity onPress={onPressDetails}>
      <Text style={styles.details}>See Details</Text>
    </TouchableOpacity>
  </View>
);

const SubscriberRoute = () => (
  <ScrollView style={styles.scene} showsVerticalScrollIndicator={false}>
    <View style={styles.badgePrimary}>
      <Text style={styles.badgeTextPrimary}>Weekly & Monthly Subscriber</Text>
    </View>
    {subscribers.map((sub) => (
      <SubscriberCard
        key={sub.id}
        name={sub.name}
        plan={sub.plan}
        onPressDetails={() => {
          router.push({
            pathname: "/orderDetails",
            params: { isSubscriber: "true" },
          });
        }}
      />
    ))}
  </ScrollView>
);

export default function Order() {
  const [index, setIndex] = React.useState(0);

  const routes = [
    { key: "requests", title: "Requests" },
    { key: "accepted", title: "Accepted" },
    { key: "completed", title: "Completed" },
    { key: "subscriber", title: "Subscriber" },
  ];

  const renderScene = () => {
    switch (routes[index].key) {
      case "requests":
        return <RequestsRoute />;
      case "accepted":
        return <AcceptedRoute />;
      case "completed":
        return <CompletedRoute />;
      case "subscriber":
        return <SubscriberRoute />;
      default:
        return null;
    }
  };

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <View style={{ backgroundColor: Colors.white }}>
          <CommonHeader title="Reviews" actionText="Add New Booking" onActionPress={()=>{router.push('/(service)/addNewService')}} />
        </View>
      </SafeAreaView>
    
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          {routes.map((route, i) => {
            const isActive = i === index;
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => setIndex(i)}
                style={[
                  styles.tabItem,
                  {
                    borderBottomWidth: isActive ? 2 : 0,
                    borderColor: isActive ? Colors.title : "transparent",
                  },
                ]}
              >
                <Text
                  style={[styles.tabTitle, isActive && styles.activeTabTitle]}
                >
                  {route.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {renderScene()}
    </>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  tabBarContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  tabItem: {
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  tabTitle: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  activeTabTitle: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.title,
  },
  subscriberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
  },
  plan: {
    fontSize: 12,
    color: Colors.lightGrey,
    fontFamily: fonts.interRegular,
    marginTop: 2,
  },
  details: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: fonts.interMedium,
  },
  // Badge styles
  badgeOrange: {
    borderWidth: 1,
    marginVertical: 12,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#FFFDF0",
    borderColor: Colors.orange,
    borderRadius: 20,
  },
  badgeTextOrange: {
    fontFamily: fonts.interRegular,
    fontSize: 11,
    color: Colors.orange,
  },
  badgePrimary: {
    borderWidth: 1,
    marginVertical: 12,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#F5F5F5",
    borderColor: Colors.primary,
    borderRadius: 20,
  },
  badgeTextPrimary: {
    fontFamily: fonts.interRegular,
    fontSize: 11,
    color: Colors.primary,
  },
  badgeGreen: {
    borderWidth: 1,
    marginVertical: 12,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.green,
    borderRadius: 20,
  },
  badgeTextGreen: {
    fontFamily: fonts.interRegular,
    fontSize: 11,
    color: Colors.green,
  },
});
