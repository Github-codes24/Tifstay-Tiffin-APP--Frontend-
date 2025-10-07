import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import useAddressStore from "@/store/addressStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AddressScreen = () => {
  const { addresses, getAllAddresses, deleteAddress, isLoading } =
    useAddressStore();
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    await getAllAddresses();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAddresses();
    setRefreshing(false);
  };

  const handleAddNewAddress = () => {
    router.push({
      pathname: "/(secure)/(accountScreens)/addEditAddress",
      params: { mode: "add" },
    });
  };

  const handleEditAddress = (addressId: string) => {
    router.push({
      pathname: "/(secure)/(accountScreens)/addEditAddress",
      params: { mode: "edit", addressId },
    });
  };

  const handleDeleteAddress = async (addressId: string, label: string) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete ${label} address?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(addressId);
            try {
              const result = await deleteAddress(addressId);
              if (result.success) {
                Alert.alert("Success", "Address deleted successfully");
              } else {
                Alert.alert(
                  "Error",
                  result.error || "Failed to delete address"
                );
              }
            } catch (error) {
              Alert.alert("Error", "An unexpected error occurred");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const renderAddress = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image
        source={item.label === "Home" ? Images.home : Images.work}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.label}</Text>
        <Text style={styles.address}>
          {item.street}, {item.address},{"\n"}
          {item.postCode}
        </Text>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          onPress={() => handleEditAddress(item._id)}
          disabled={deletingId === item._id}
          style={styles.actionButton}
        >
          <Image
            source={Images.editicon}
            style={styles.actionIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteAddress(item._id, item.label)}
          disabled={deletingId === item._id}
          style={styles.actionButton}
        >
          {deletingId === item._id ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Image
              source={Images.delete}
              style={styles.actionIcon}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading && addresses.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subHeader}>
        <Text style={styles.locationLabel}>Location</Text>
      </View>
      <View>
        <FlatList
          data={addresses}
          renderItem={renderAddress}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No addresses added yet</Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={handleAddNewAddress}
              >
                <Text style={styles.emptyAddButtonText}>
                  Add Your First Address
                </Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={
            <View>
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.grey,
                  marginVertical: 16,
                }}
              >
                OR
              </Text>
              <TouchableOpacity onPress={handleAddNewAddress}>
                <View style={styles.card}>
                  <Image
                    source={Images.add}
                    style={styles.image}
                    resizeMode="contain"
                  />

                  <View style={styles.textContainer}>
                    <Text style={styles.addTitle}>Add New Address</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  subHeader: {
    marginHorizontal: 16,
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationLabel: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.title,
  },
  addAddressLabel: {
    fontSize: 14,
    fontFamily: fonts.interSemibold,
    color: Colors.primary,
    textAlign: "center",
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#F7F5FF",
    borderRadius: 12,
    minHeight: 101,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 52,
    width: 52,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: "700",
    color: "#0A051F",
    fontSize: 14,
    fontFamily: fonts.interSemibold,
  },
  address: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
    fontFamily: fonts.interRegular,
    lineHeight: 18,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    position: "absolute",
    right: 19,
    top: 19,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    height: 20,
    width: 20,
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginBottom: 20,
  },
  emptyAddButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: fonts.interSemibold,
  },
  addTitle: {
    fontWeight: "800",
    color: Colors.lightGrey,
    fontSize: 16,
    fontFamily: fonts.interRegular,
  },
});
