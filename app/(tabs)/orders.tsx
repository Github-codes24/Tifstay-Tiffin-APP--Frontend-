import BookingCard from "@/components/BookingCard";
import BookingCardHostel from "@/components/BookingCardHostel";
import CommonHeader from "@/components/CommonHeader";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const subscribers = [
  { id: "1", name: "Onli Karmokar", plan: "Weekly (Veg Lunch)" },
  { id: "2", name: "Annette Black", plan: "Monthly (Non-Veg Dinner)" },
];

// ------------------ Tab Screens ------------------

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

const RequestsAcceptRoute = () => (
  <ScrollView style={styles.scene} showsVerticalScrollIndicator={false}>
    <View style={styles.badgePrimary}>
      <Text style={styles.badgeTextPrimary}>Accepted</Text>
    </View>
    <BookingCardHostel
      status="Accepted"
      bookingId="#TF2024002"
      orderedDate="21/07/2025"
      tiffinService="Scholars Den Boys Hostel"
      customer="Onil Karmokar"
      startDate="Weekly"
      mealType="12"
      plan="10,11,12"
      orderType="01/08/25"
      onPressUpdate={() =>
        router.push({
          pathname: "/orderDetails",
          params: { isSubscriber: "false" },
        })
      }
    />
  </ScrollView>
);


const RequestsRouteHostel = () => (
  <ScrollView style={styles.scene} showsVerticalScrollIndicator={false}>
    <View style={styles.badgeOrange}>
      <Text style={styles.badgeTextOrange}>Requests</Text>
    </View>
    <BookingCardHostel
      status="Accepted"
      bookingId="#TF2024002"
      orderedDate="21/07/2025"
      tiffinService="Scholars Den Boys Hostel"
      customer="Onil Karmokar"
      startDate="Weekly"
      mealType="12"
      plan="10,11,12"
      orderType="01/08/25"
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
      onPressUpdate={() =>
        router.push({
          pathname: "/orderDetails",
          params: { isSubscriber: "false" },
        })
      }
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

const CompletedHostelRoute = () => (
  <ScrollView style={styles.scene} showsVerticalScrollIndicator={false}>
    <View style={styles.badgeGreen}>
      <Text style={styles.badgeTextGreen}>Completed</Text>
    </View>
    <BookingCardHostel
       status="Accepted"
      bookingId="#TF2024002"
      orderedDate="21/07/2025"
      tiffinService="Scholars Den Boys Hostel"
      customer="Onil Karmokar"
      startDate="Weekly"
      mealType="12"
      plan="10,11,12"
      orderType="01/08/25"
      statusText="Completed"
    />
  </ScrollView>
);


const SubscriberCard: React.FC<{
  name: string;
  plan: string;
  onPressDetails: () => void;
}> = ({ name, plan, onPressDetails }) => (
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
        onPressDetails={() =>
          router.push({
            pathname: "/orderDetails",
            params: { isSubscriber: "true" },
          })
        }
      />
    ))}
  </ScrollView>
);

// ------------------ Main Screen ------------------

export default function Order() {
  const [index, setIndex] = React.useState(0);
  const [provider, setProvider] = React.useState<string | null>(null);

  const getProvider = React.useCallback(async () => {
    const serviceType = await AsyncStorage.getItem("userServiceType");
    setProvider(serviceType);
  }, []);

  React.useEffect(() => {
    getProvider();
  }, [getProvider]);

  const routes =
    provider === "tiffinProvider"
      ? [
          { key: "requests", title: "Requests" },
          { key: "accepted", title: "Accepted" },
          { key: "completed", title: "Completed" },
          { key: "subscriber", title: "Subscriber" },
        ]
      : [
          { key: "requests", title: "Requests" },
          { key: "accepted", title: "Accepted" },
          { key: "completed", title: "Completed" },
        ];

  const renderScene = () => {
    switch (routes[index].key) {
      case "requests":
        return   provider === "tiffinProvider" ? <RequestsRoute /> : <RequestsRouteHostel/>;
      case "accepted":
        return provider === "tiffinProvider" ? <AcceptedRoute /> : <RequestsAcceptRoute/>;
      case "completed":
        return provider === "tiffinProvider" ? <CompletedRoute /> : <CompletedHostelRoute/>;
      case "subscriber":
        return <SubscriberRoute />;
      default:
        return null;
    }
  };

  const isTiffin = provider === "tiffinProvider";
  const screenWidth = Dimensions.get("window").width;

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <CommonHeader
          title="Orders"
          actionText="Add New Booking"
          onActionPress={() => router.push("/(service)/addNewService")}
        />
      </SafeAreaView>

      {/* Tab Bar */}
      <View style={styles.tabBarContainer}>
        {isTiffin ? (
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
        ) : (
          <View style={styles.tabRow}>
            {routes.map((route, i) => {
              const isActive = i === index;
              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={() => setIndex(i)}
                  style={[
                    styles.tabItem,
                    {
                      flex: 1,
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
          </View>
        )}
      </View>

      {/* Tab Content */}
      {renderScene()}
    </>
  );
}

// ------------------ Styles ------------------

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  tabBarContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 16,
  },
  tabBarScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily: fonts.interMedium,
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