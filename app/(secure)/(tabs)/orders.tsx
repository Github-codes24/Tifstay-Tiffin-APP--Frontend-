import BookingCard from "@/components/BookingCard";
import BookingCardHostel from "@/components/BookingCardHostel";
import CommonHeader from "@/components/CommonHeader";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import hostelApiService from "@/services/hostelApiService";
import tiffinApiService from "@/services/tiffinApiServices";
import useAuthStore from "@/store/authStore";
import { HostelBooking } from "@/types/hostel";
import { router } from "expo-router";
import * as React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

// ✅ Helper function to format plan name
const formatPlanName = (plans: any[]): string => {
  if (!plans || plans.length === 0) return "N/A";
  return plans[0].name.charAt(0).toUpperCase() + plans[0].name.slice(1);
};

// ✅ Helper function to format bed numbers
const formatBedNumbers = (rooms: any[]): string => {
  if (!rooms || rooms.length === 0) return "N/A";
  const allBeds = rooms.flatMap((room) => room.bedNumbers);
  return allBeds.join(", ");
};

// ✅ Helper function to format room numbers
const formatRoomNumbers = (rooms: any[]): string => {
  if (!rooms || rooms.length === 0) return "N/A";
  return rooms.map((room) => room.roomNumber).join(", ");
};

// ------------------ TIFFIN Tab Screens (Refactored) ------------------

const RequestsRoute = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [processingBookingId, setProcessingBookingId] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await tiffinApiService.getBookingsByStatus("Pending");
      if (response.success && response.data?.bookings) {
        setBookings(response.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAccept = async (bookingId: string, bookingNumber: string) => {
    Alert.alert(
      "Accept Booking",
      `Are you sure you want to accept booking ${bookingNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: async () => {
            setProcessingBookingId(bookingId);
            try {
              const response = await tiffinApiService.updateBookingStatus(
                bookingId,
                "Confirmed"
              );

              if (response.success) {
                Alert.alert("Success", "Booking accepted successfully", [
                  {
                    text: "OK",
                    onPress: () => loadBookings(),
                  },
                ]);
              } else {
                Alert.alert(
                  "Error",
                  response.error || "Failed to accept booking"
                );
              }
            } catch (error) {
              Alert.alert("Error", "Failed to accept booking");
            } finally {
              setProcessingBookingId(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = async (bookingId: string, bookingNumber: string) => {
    Alert.alert(
      "Reject Booking",
      `Are you sure you want to reject booking ${bookingNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setProcessingBookingId(bookingId);
            try {
              const response = await tiffinApiService.updateBookingStatus(
                bookingId,
                "Rejected"
              );

              if (response.success) {
                Alert.alert("Success", "Booking rejected successfully", [
                  {
                    text: "OK",
                    onPress: () => loadBookings(),
                  },
                ]);
              } else {
                Alert.alert(
                  "Error",
                  response.error || "Failed to reject booking"
                );
              }
            } catch (error) {
              Alert.alert("Error", "Failed to reject booking");
            } finally {
              setProcessingBookingId(null);
            }
          },
        },
      ]
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scene}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.badgeOrange}>
        <Text style={styles.badgeTextOrange}>Requests</Text>
      </View>
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No requests found</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            status={booking.status}
            bookingId={booking.bookingId}
            orderedDate={booking.orderDate}
            tiffinService={booking.tiffinService}
            customer={booking.customer}
            startDate={booking.startDate}
            mealType={booking.mealType}
            plan={booking.plan}
            orderType={booking.orderType}
            isReq
            isProcessing={processingBookingId === booking._id}
            onReject={() => handleAccept(booking._id, booking.bookingId)}
            onAccept={() => handleReject(booking._id, booking.bookingId)}
          />
        ))
      )}
    </ScrollView>
  );
};

const AcceptedRoute = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await tiffinApiService.getBookingsByStatus("Confirmed");
      if (response.success && response.data?.bookings) {
        setBookings(response.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scene}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.badgePrimary}>
        <Text style={styles.badgeTextPrimary}>Confirmed</Text>
      </View>
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No confirmed bookings found</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            status={booking.status}
            bookingId={booking.bookingId}
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
                params: { booking: JSON.stringify(booking) },
              })
            }
          />
        ))
      )}
    </ScrollView>
  );
};

const CompletedRoute = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await tiffinApiService.getBookingsByStatus("Rejected");
      if (response.success && response.data?.bookings) {
        setBookings(response.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scene}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={[
          styles.badgeGreen,
          { backgroundColor: "#FF7F7F", borderColor: "red" },
        ]}
      >
        <Text style={[styles.badgeTextGreen, { color: "red" }]}>Rejected</Text>
      </View>
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No rejected bookings found</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            status={booking.status}
            bookingId={booking.bookingId}
            orderedDate={booking.orderDate}
            tiffinService={booking.tiffinService}
            customer={booking.customer}
            startDate={booking.startDate}
            mealType={booking.mealType}
            plan={booking.plan}
            orderType={booking.orderType}
            statusText="Rejected"
          />
        ))
      )}
    </ScrollView>
  );
};

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

// ------------------ HOSTEL Tab Screens ------------------

const RequestsRouteHostel = () => {
  const [bookings, setBookings] = React.useState<HostelBooking[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [processingBookingId, setProcessingBookingId] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await hostelApiService.getBookingsByStatus("Requested");
      if (response.success && response.data?.data?.bookings) {
        setBookings(response.data.data.bookings);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAccept = async (bookingId: string, bookingNumber: string) => {
    Alert.alert(
      "Accept Booking",
      `Are you sure you want to accept booking ${bookingNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: async () => {
            setProcessingBookingId(bookingId);
            try {
              const response = await hostelApiService.updateBookingStatus(
                bookingId,
                "Confirmed"
              );

              if (response.success) {
                Alert.alert("Success", "Booking accepted successfully", [
                  {
                    text: "OK",
                    onPress: () => loadBookings(),
                  },
                ]);
              } else {
                Alert.alert(
                  "Error",
                  response.error || "Failed to accept booking"
                );
              }
            } catch (error) {
              Alert.alert("Error", "Failed to accept booking");
            } finally {
              setProcessingBookingId(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = async (bookingId: string, bookingNumber: string) => {
    Alert.alert(
      "Reject Booking",
      `Are you sure you want to reject booking ${bookingNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setProcessingBookingId(bookingId);
            try {
              const response = await hostelApiService.updateBookingStatus(
                bookingId,
                "Rejected"
              );

              if (response.success) {
                Alert.alert("Success", "Booking rejected successfully", [
                  {
                    text: "OK",
                    onPress: () => loadBookings(),
                  },
                ]);
              } else {
                Alert.alert(
                  "Error",
                  response.error || "Failed to reject booking"
                );
              }
            } catch (error) {
              Alert.alert("Error", "Failed to reject booking");
            } finally {
              setProcessingBookingId(null);
            }
          },
        },
      ]
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scene}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.badgeOrange}>
        <Text style={styles.badgeTextOrange}>Requests</Text>
      </View>
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pending requests</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <BookingCardHostel
            key={booking._id}
            status="Pending"
            bookingId={booking.bookingNumber}
            orderedDate={booking.bookedDate}
            tiffinService={booking.hostelName}
            customer={booking.customerName}
            startDate={formatPlanName(booking.selectPlan)}
            mealType={formatRoomNumbers(booking.rooms)}
            plan={formatBedNumbers(booking.rooms)}
            orderType={booking.checkInDate}
            checkOutDate={booking.checkOutDate}
            rooms={booking.rooms}
            isReq
            isProcessing={processingBookingId === booking._id}
            onAccept={() => handleAccept(booking._id, booking.bookingNumber)}
            onReject={() => handleReject(booking._id, booking.bookingNumber)}
          />
        ))
      )}
    </ScrollView>
  );
};

const RequestsAcceptRoute = () => {
  const [bookings, setBookings] = React.useState<HostelBooking[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await hostelApiService.getBookingsByStatus("Confirmed");
      if (response.success && response.data?.data?.bookings) {
        setBookings(response.data.data.bookings);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scene}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.badgePrimary}>
        <Text style={styles.badgeTextPrimary}>Accepted</Text>
      </View>
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No accepted bookings</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <BookingCardHostel
            key={booking._id}
            status="Accepted"
            bookingId={booking.bookingNumber}
            orderedDate={booking.bookedDate}
            tiffinService={booking.hostelName}
            customer={booking.customerName}
            startDate={formatPlanName(booking.selectPlan)}
            mealType={formatRoomNumbers(booking.rooms)}
            plan={formatBedNumbers(booking.rooms)}
            orderType={booking.checkInDate}
            checkOutDate={booking.checkOutDate}
            rooms={booking.rooms}
            onPressUpdate={() =>
              router.push({
                pathname: "/orderDetails",
                params: { isSubscriber: "false", bookingId: booking._id },
              })
            }
          />
        ))
      )}
    </ScrollView>
  );
};

const CompletedHostelRoute = () => {
  const [bookings, setBookings] = React.useState<HostelBooking[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await hostelApiService.getBookingsByStatus("Rejected");
      if (response.success && response.data?.data?.bookings) {
        setBookings(response.data.data.bookings);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scene}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.badgeRed}>
        <Text style={styles.badgeTextRed}>Rejected</Text>
      </View>
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No rejected bookings</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <BookingCardHostel
            key={booking._id}
            status="Rejected"
            bookingId={booking.bookingNumber}
            orderedDate={booking.bookedDate}
            tiffinService={booking.hostelName}
            customer={booking.customerName}
            startDate={formatPlanName(booking.selectPlan)}
            mealType={formatRoomNumbers(booking.rooms)}
            plan={formatBedNumbers(booking.rooms)}
            orderType={booking.checkInDate}
            checkOutDate={booking.checkOutDate}
            rooms={booking.rooms}
          />
        ))
      )}
    </ScrollView>
  );
};

// ------------------ Main Screen ------------------

export default function Order() {
  const [index, setIndex] = React.useState(0);
  const { userServiceType } = useAuthStore();
  const isTiffinProvider = userServiceType === "tiffin_provider";

  const routes = isTiffinProvider
    ? [
        { key: "requests", title: "Requests" },
        { key: "accepted", title: "Accepted" },
        { key: "completed", title: "Rejected" },
      ]
    : [
        { key: "requests", title: "Requests" },
        { key: "accepted", title: "Accepted" },
        { key: "rejected", title: "Rejected" },
      ];

  const renderScene = () => {
    switch (routes[index].key) {
      case "requests":
        return isTiffinProvider ? <RequestsRoute /> : <RequestsRouteHostel />;
      case "accepted":
        return isTiffinProvider ? <AcceptedRoute /> : <RequestsAcceptRoute />;
      case "completed":
        return <CompletedRoute />;
      case "rejected":
        return <CompletedHostelRoute />;
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

// ------------------ Styles (unchanged) ------------------

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
    justifyContent: "space-between",
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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
  },
  badgeRed: {
    borderWidth: 1,
    marginVertical: 12,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#FFF0F0",
    borderColor: Colors.red,
    borderRadius: 20,
  },
  badgeTextRed: {
    fontFamily: fonts.interRegular,
    fontSize: 11,
    color: Colors.red,
  },
});
