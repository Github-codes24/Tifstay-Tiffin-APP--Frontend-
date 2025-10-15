import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import hostelApiService from "@/services/hostelApiService";
import tiffinApiService from "@/services/tiffinApiServices";
import useAuthStore from "@/store/authStore";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SubscriptionType {
  name: string;
  price: number;
  depositAmount: number;
}

interface Customer {
  customerId: string;
  name: string;
  profileImage: string | null;
  subscriptionType: SubscriptionType[];
  startDate: string;
  endDate: string;
}

export default function MyCustomersScreen() {
  const { userServiceType } = useAuthStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [userServiceType]);

  const fetchCustomers = async (page = 1, isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      let response;

      // Call appropriate API based on service type
      if (userServiceType === "hostel_owner") {
        response = await hostelApiService.getAllCustomerList(page, 10);
      } else {
        response = await tiffinApiService.getAllCustomerList(page, 10);
      }

      if (response.success) {
        const result = response.data;
        setCustomers(result.data.customers);
        setHasNextPage(result.data.pagination.hasNextPage);
        setCurrentPage(result.data.pagination.currentPage);
      } else {
        setError(response.error || "Failed to fetch customers");
      }
    } catch (error: any) {
      console.error("Error fetching customers:", error);
      setError(error.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    fetchCustomers(1, true);
  }, [userServiceType]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !loading) {
      fetchCustomers(currentPage + 1);
    }
  }, [hasNextPage, loading, currentPage]);

  const handleCustomerPress = (customer: Customer) => {
    router.push({
      pathname: "/(secure)/(accountScreens)/customerInfo",
      params: { customerId: customer.customerId },
    });
  };

  const formatSubscriptionName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getServiceLabel = () => {
    return userServiceType === "hostel_owner" ? "Hostel" : "Tiffin";
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => {
    const subscriptionName =
      item.subscriptionType && item.subscriptionType.length > 0
        ? formatSubscriptionName(item.subscriptionType[0].name)
        : "N/A";

    return (
      <TouchableOpacity
        onPress={() => handleCustomerPress(item)}
        style={styles.customerRow}
        activeOpacity={0.7}
      >
        <Image
          source={item.profileImage ? { uri: item.profileImage } : Images.user}
          style={styles.profileImage}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.startDate}>
            {getServiceLabel()} Start {item.startDate}
          </Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.subscription}>{subscriptionName}</Text>
          <Text style={styles.endDate}>Until {item.endDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={Images.user} style={styles.emptyIcon} />
      <Text style={styles.emptyText}>
        No {getServiceLabel().toLowerCase()} customers found
      </Text>
      <Text style={styles.emptySubText}>
        Customers will appear here once they subscribe to your service
      </Text>
    </View>
  );

  const renderErrorComponent = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => fetchCustomers(1)}
      >
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && customers.length === 0 && !error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading customers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && customers.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderErrorComponent()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.customerId}
        renderItem={renderCustomerItem}
        contentContainerStyle={customers.length === 0 && styles.emptyContainer}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && customers.length > 0 ? (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={styles.footerLoader}
            />
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.interMedium,
    color: Colors.red,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: fonts.interSemibold,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
    backgroundColor: Colors.lightGrey,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
    marginBottom: 4,
  },
  startDate: {
    fontSize: 12,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  subscription: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.primary,
    marginBottom: 4,
  },
  endDate: {
    fontSize: 11,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.lightGrey,
    marginHorizontal: 16,
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
