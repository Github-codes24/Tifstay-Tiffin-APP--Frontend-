import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import ApiService from "@/services/hostelApiService";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    customers: Customer[];
    totalCount: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
  };
}

export default function MyCustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (page = 1) => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await ApiService.getAllCustomerList(page);
      const result: ApiResponse = await response.data;

      if (result.success) {
        setCustomers(result.data.customers);
        setHasNextPage(result.data.pagination.hasNextPage);
        setCurrentPage(result.data.pagination.currentPage);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerPress = (customer: Customer) => {
    router.push({
      pathname: "/(secure)/(accountScreens)/customerInfo",
      params: { customerId: customer.customerId },
    });
  };

  const formatSubscriptionName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
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
      >
        <Image
          source={item.profileImage ? { uri: item.profileImage } : Images.user}
          style={styles.profileImage}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.startDate}>Tiffin Start {item.startDate}</Text>
        </View>
        <Text style={styles.subscription}>{subscriptionName}</Text>
      </TouchableOpacity>
    );
  };

  if (loading && customers.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No customers found</Text>
          </View>
        }
        onEndReached={() => {
          if (hasNextPage && !loading) {
            fetchCustomers(currentPage + 1);
          }
        }}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 14,
    backgroundColor: Colors.lightGrey,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
  },
  startDate: {
    fontSize: 12,
    color: Colors.lightGrey,
    fontFamily: fonts.interRegular,
    marginTop: 2,
  },
  subscription: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.grey,
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
