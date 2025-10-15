import BookingCard from "@/components/BookingCard";
import BookingCardHostel from "@/components/BookingCardHostel";
import CommonHeader from "@/components/CommonHeader";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";
import { router } from "expo-router";
import * as React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BASE_URL = "https://tifstay-project-be.onrender.com/api";

interface Booking {
  _id: string;
  bookingId: string;
  orderDate: string;
  tiffinService: string;
  customer: string;
  customerPhone: string;
  startDate: string;
  mealType: string;
  plan: string;
  orderType: string;
  status: string;
}

const subscribers = [
  { id: "1", name: "Onli Karmokar", plan: "Weekly (Veg Lunch)" },
  { id: "2", name: "Annette Black", plan: "Monthly (Non-Veg Dinner)" },
];

// ------------------ Tab Screens ------------------

const RequestsRoute = ({ bookings, loading, onRefresh, refreshing, onAccept, onReject }: any) => (
  <ScrollView
    style={styles.scene}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{paddingBottom:100}}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    ) : bookings.length > 0 ? (
      <>
        <View style={styles.badgeOrange}>
          <Text style={styles.badgeTextOrange}>Requests</Text>
        </View>
        {bookings.map((booking: Booking) => (
          <BookingCard
            key={booking._id}
            status={booking.status}
            bookingId={`#${booking.bookingId}`}
            orderedDate={booking.orderDate}
            tiffinService={booking.tiffinService}
            customer={booking.customer}
            startDate={booking.startDate}
            mealType={booking.mealType}
            plan={booking.plan}
            orderType={booking.orderType}
            onPressUpdate={() => alert("Update Order Summary clicked!")}
            isReq
            onAccept={() => onReject(booking._id)}
            onReject={() => onAccept(booking._id)}
          />
        ))}
      </>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No requests found</Text>
      </View>
    )}
  </ScrollView>
);

const RequestsAcceptRoute = ({ bookings, loading, onRefresh, refreshing }: any) => (
  <ScrollView
    style={styles.scene}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{paddingBottom:100}}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    ) : bookings.length > 0 ? (
      <>
        <View style={styles.badgePrimary}>
          <Text style={styles.badgeTextPrimary}>Confirmed</Text>
        </View>
        {bookings.map((booking: Booking) => (
          <BookingCardHostel
            key={booking._id}
            status={booking.status}
            bookingId={`#${booking.bookingId}`}
            orderedDate={booking.orderDate}
            tiffinService={booking.tiffinService}
            customer={booking.customer}
            startDate={booking.plan}
            mealType="12"
            plan="10,11,12"
            orderType={booking.startDate}
            onPressUpdate={() =>
              router.push({
                pathname: "/orderDetails",
                params: { isSubscriber: "false" },
              })
            }
          />
        ))}
      </>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No confirmed bookings found</Text>
      </View>
    )}
  </ScrollView>
);

const RequestsRouteHostel = ({ bookings, loading, onRefresh, refreshing, onAccept, onReject }: any) => (
  <ScrollView
    style={styles.scene}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    ) : bookings.length > 0 ? (
      <>
        <View style={styles.badgeOrange}>
          <Text style={styles.badgeTextOrange}>Requests</Text>
        </View>
        {bookings.map((booking: Booking) => (
          <BookingCardHostel
            key={booking._id}
            status={booking.status}
            bookingId={`#${booking.bookingId}`}
            orderedDate={booking.orderDate}
            tiffinService={booking.tiffinService}
            customer={booking.customer}
            startDate={booking.plan}
            mealType="12"
            plan="10,11,12"
            orderType={booking.startDate}
            onPressUpdate={() => alert("Update Order Summary clicked!")}
            isReq
            onAccept={() => onReject(booking._id)}
            onReject={() => onAccept(booking._id)}
          />
        ))}
      </>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No requests found</Text>
      </View>
    )}
  </ScrollView>
);

const AcceptedRoute = ({ bookings, loading, onRefresh, refreshing }: any) => (
  <ScrollView
    style={styles.scene}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{paddingBottom:100}}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    ) : bookings.length > 0 ? (
      <>
        <View style={styles.badgePrimary}>
          <Text style={styles.badgeTextPrimary}>Confirmed</Text>
        </View>
        {bookings.map((booking: Booking) => (
          <BookingCard
            key={booking._id}
            status={booking.status}
            bookingId={`#${booking.bookingId}`}
            orderedDate={booking.orderDate}
            tiffinService={booking.tiffinService}
            customer={booking.customer}
            startDate={booking.startDate}
            mealType={booking.mealType}
            plan={booking.plan}
            orderType={booking.orderType}
            onPressUpdate={() =>
              router.push({
                pathname: "/(secure)/(service)/addNewBooking",
                params: { booking : JSON.stringify(booking) },
              })
            } 
          />
        ))}
      </>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No confirmed bookings found</Text>
      </View>
    )}
  </ScrollView>
);

const CompletedRoute = ({ bookings, loading, onRefresh, refreshing }: any) => (
  <ScrollView
    style={styles.scene}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    ) : bookings.length > 0 ? (
      <>
        <View style={[styles.badgeGreen , {backgroundColor:'#FF7F7F' , borderColor:'red'}]}>
          <Text style={[styles.badgeTextGreen,{color : 'red'}]}>Rejected</Text>
        </View>
        {bookings.map((booking: Booking) => (
          <BookingCard
            key={booking._id}
            status={booking.status}
            bookingId={`#${booking.bookingId}`}
            orderedDate={booking.orderDate}
            tiffinService={booking.tiffinService}
            customer={booking.customer}
            startDate={booking.startDate}
            mealType={booking.mealType}
            plan={booking.plan}
            orderType={booking.orderType}
            statusText="Rejected"
          />
        ))}
      </>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No rejected bookings found</Text>
      </View>
    )}
  </ScrollView>
);

const CompletedHostelRoute = ({ bookings, loading, onRefresh, refreshing }: any) => (
  <ScrollView
    style={styles.scene}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    ) : bookings.length > 0 ? (
      <>
        <View style={styles.badgeGreen}>
          <Text style={styles.badgeTextGreen}>Rejected</Text>
        </View>
        {bookings.map((booking: Booking) => (
          <BookingCardHostel
            key={booking._id}
            status={booking.status}
            bookingId={`#${booking.bookingId}`}
            orderedDate={booking.orderDate}
            tiffinService={booking.tiffinService}
            customer={booking.customer}
            startDate={booking.plan}
            mealType="12"
            plan="10,11,12"
            orderType={booking.startDate}
            statusText="Rejected"
          />
        ))}
      </>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No rejected bookings found</Text>
      </View>
    )}
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
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { userServiceType } = useAuthStore();
  const isTiffinProvider = userServiceType === "tiffin_provider";

  const routes = isTiffinProvider
    ? [
      { key: "requests", title: "Requests", status: "Pending" },
      { key: "accepted", title: "Accepted", status: "Confirmed" },
      { key: "completed", title: "Rejected", status: "Rejected" },
      // { key: "subscriber", title: "Subscriber", status: null },
    ]
    : [
      { key: "requests", title: "Requests", status: "Requested" },
      { key: "accepted", title: "Accepted", status: "Confirmed" },
      { key: "completed", title: "Rejected", status: "Rejected" },
    ];

  const fetchBookings = async (status: string | null, isRefresh = false) => {
    if (!status) return; // Skip API call for subscriber tab

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const token = useAuthStore.getState().token;

      const response = await fetch(
        `${BASE_URL}/tiffinOwner/bookings/getBookingsByStatus?status=${status}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log(result);

      if (result.success && result.data?.bookings) {
        setBookings(result.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: "Confirmed" | "Rejected") => {
    try {
      const token = useAuthStore.getState().token;

      const response = await fetch(
        `${BASE_URL}/tiffinOwner/bookings/updateBookingStatus/${bookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          "Success",
          `Booking ${status.toLowerCase()} successfully!`,
          [
            {
              text: "OK",
              onPress: () => {
                // Refresh the current tab's bookings
                const currentStatus = routes[index].status;
                fetchBookings(currentStatus);
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", result.message || "Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      Alert.alert("Error", "Failed to update booking status. Please try again.");
    }
  };

  const handleAccept = (bookingId: string) => {
    Alert.alert(
      "Confirm Accept",
      "Are you sure you want to accept this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: () => updateBookingStatus(bookingId, "Confirmed"),
        },
      ]
    );
  };

  const handleReject = (bookingId: string) => {
    Alert.alert(
      "Confirm Reject",
      "Are you sure you want to reject this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => updateBookingStatus(bookingId, "Rejected"),
        },
      ]
    );
  };

  React.useEffect(() => {
    const currentStatus = routes[index].status;
    fetchBookings(currentStatus);
  }, [index]);

  const handleRefresh = () => {
    const currentStatus = routes[index].status;
    fetchBookings(currentStatus, true);
  };

  const renderScene = () => {
    const commonProps = {
      bookings,
      loading,
      onRefresh: handleRefresh,
      refreshing,
    };

    switch (routes[index].key) {
      case "requests":
        return isTiffinProvider ? (
          <RequestsRoute {...commonProps} onAccept={handleAccept} onReject={handleReject} />
        ) : (
          <RequestsRouteHostel {...commonProps} onAccept={handleAccept} onReject={handleReject} />
        );
      case "accepted":
        return isTiffinProvider ? (
          <AcceptedRoute {...commonProps} />
        ) : (
          <RequestsAcceptRoute {...commonProps} />
        );
      case "completed":
        return isTiffinProvider ? (
          <CompletedRoute {...commonProps} />
        ) : (
          <CompletedHostelRoute {...commonProps} />
        );
      case "subscriber":
        return <SubscriberRoute />;
      default:
        return null;
    }
  };

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <CommonHeader
          title="Orders"
          actionText="Add New Booking"
          onActionPress={() => router.push("/(secure)/(service)/addNewBooking")}
        />
      </SafeAreaView>

      {/* Tab Bar */}
      <View style={styles.tabBarContainer}>
  <View style={styles.tabRow}>
    {routes.map((route, i) => {
      const isActive = i === index;
      return (
        <TouchableOpacity
          key={route.key}
          onPress={() => setIndex(i)}
          style={[
            styles.tabItemEqual,
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
  </View>
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
    justifyContent:'space-between',
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.lightGrey,
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
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabItemEqual: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  
});