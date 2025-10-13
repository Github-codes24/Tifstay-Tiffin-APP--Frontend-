import CommonHeader from "@/components/CommonHeader";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import hostelApiService from "@/services/hostelApiService";
import tiffinApiServices from "@/services/tiffinApiServices";
import useAuthStore from "@/store/authStore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PayoutItem {
  id: string;
  amount: number;
  date: string;
  status: string;
  statusColor?: string;
  method?: string;
  accountNumber?: string;
  upiId?: string;
  transactionId?: string;
  failureReason?: string;
}

interface EarningsData {
  thisMonth?: number;
  thisWeek?: number;
  totalBalance?: number;
}

const EarningsScreen = () => {
  const { userServiceType } = useAuthStore();
  const [earningsData, setEarningsData] = useState<EarningsData>({});
  const [payoutHistory, setPayoutHistory] = useState<PayoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  const isTiffinProvider = useMemo(
    () => userServiceType === "tiffin_provider",
    [userServiceType]
  );

  useEffect(() => {
    loadEarningsData();
    loadPayoutHistory();
  }, [isTiffinProvider]);

  const loadEarningsData = async () => {
    setLoading(true);
    try {
      let response;
      if (isTiffinProvider) {
        response = await tiffinApiServices.getEarningsOverview();
      } else {
        response = await hostelApiService.getEarningsOverview();
      }

      if (response.success) {
        setEarningsData(response.data.data || response.data);
      }
    } catch (error) {
      console.error("Error loading earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPayoutHistory = async () => {
    setHistoryLoading(true);
    try {
      let response;
      if (isTiffinProvider) {
        response = await tiffinApiServices.getEarningsHistory();
      } else {
        response = await hostelApiService.getEarningsHistory();
      }

      if (response.success && response.data) {
        setPayoutHistory(response.data);
      }
    } catch (error) {
      console.error("Error loading payout history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          badge: styles.completed,
          text: styles.completedText,
        };
      case "processing":
        return {
          badge: styles.processing,
          text: styles.processingText,
        };
      case "failed":
        return {
          badge: styles.failed,
          text: styles.failedText,
        };
      default:
        return {
          badge: styles.processing,
          text: styles.processingText,
        };
    }
  };

  const renderPayoutItem = (item: PayoutItem, index: number) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View
        key={item.id}
        style={[
          styles.payoutRow,
          index === payoutHistory.length - 1 && styles.payoutRowLast,
        ]}
      >
        <View style={styles.payoutLeft}>
          <Text style={styles.amount}>
            ₹{item.amount.toLocaleString("en-IN")}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
          {item.method && <Text style={styles.method}>{item.method}</Text>}
          {item.transactionId && (
            <Text style={styles.transactionId}>TXN: {item.transactionId}</Text>
          )}
          {item.failureReason && (
            <Text style={styles.failureReason}>{item.failureReason}</Text>
          )}
        </View>
        <View style={[styles.statusBadge, statusStyle.badge]}>
          <Text style={[styles.statusText, statusStyle.text]}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyHistory = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No payout history available</Text>
    </View>
  );

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.white }}>
        <View style={{ backgroundColor: Colors.white }}>
          <CommonHeader title="Earnings" />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Earnings Overview */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Image source={Images.total} style={{ height: 16, width: 16 }} />
            <Text style={styles.header}>Earnings Overview</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : (
            <>
              <View style={styles.overviewRow}>
                <View style={[styles.overviewBox]}>
                  <Text
                    style={[styles.overviewValue, { color: Colors.primary }]}
                  >
                    ₹{earningsData?.totalBalance?.toLocaleString("en-IN") || 0}
                  </Text>
                  <Text
                    style={[styles.overviewLabel, { color: Colors.primary }]}
                  >
                    Total Balance
                  </Text>
                </View>
                <View style={[styles.overviewBox]}>
                  <Text
                    style={[styles.overviewValue, { color: Colors.orange }]}
                  >
                    ₹{earningsData?.thisWeek?.toLocaleString("en-IN") || 0}
                  </Text>
                  <Text
                    style={[styles.overviewLabel, { color: Colors.orange }]}
                  >
                    This Week
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.overviewBox,
                  { alignSelf: "center", marginTop: 12 },
                ]}
              >
                <Text style={[styles.overviewValue, { color: Colors.green }]}>
                  ₹{earningsData?.thisMonth?.toLocaleString("en-IN") || 0}
                </Text>
                <Text style={[styles.overviewLabel, { color: Colors.green }]}>
                  This Month
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Payout History - Only show if data is available */}
        {!historyLoading && payoutHistory.length > 0 && (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Image
                source={Images.calender}
                style={{ height: 16, width: 16 }}
              />
              <Text style={styles.header}>Payout History</Text>
            </View>

            {payoutHistory.map((item, index) => renderPayoutItem(item, index))}
          </View>
        )}

        {/* Loading state for payout history */}
        {historyLoading && (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Image
                source={Images.calender}
                style={{ height: 16, width: 16 }}
              />
              <Text style={styles.header}>Payout History</Text>
            </View>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          </View>
        )}

        {/* Empty state - if not loading and no data */}
        {!historyLoading && payoutHistory.length === 0 && (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Image
                source={Images.calender}
                style={{ height: 16, width: 16 }}
              />
              <Text style={styles.header}>Payout History</Text>
            </View>
            {renderEmptyHistory()}
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Add extra padding at the bottom
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
  loadingContainer: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  payoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightGrey,
  },
  payoutRowLast: {
    borderBottomWidth: 0, // Remove border for last item
  },
  payoutLeft: {
    flex: 1,
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
    marginTop: 2,
  },
  method: {
    fontSize: 10,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginTop: 2,
  },
  transactionId: {
    fontSize: 9,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
    marginTop: 2,
  },
  failureReason: {
    fontSize: 10,
    fontFamily: fonts.interRegular,
    color: Colors.red,
    marginTop: 2,
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
  failed: {
    backgroundColor: "#FFE5E5",
    borderColor: Colors.red,
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
  failedText: {
    color: Colors.red,
    fontSize: 11,
    fontFamily: fonts.interRegular,
  },
  statusText: {
    fontSize: 11,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
    color: Colors.grey,
  },
});

export default EarningsScreen;
