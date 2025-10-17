import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { fonts } from "@/constants/typography";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ContactUs = () => {
  const handleCall = () => Linking.openURL("tel:5146014598");
  const handleEmail = () => Linking.openURL("mailto:contact@tifstay.com");
  const handleChat = () => {
    router.push("/chatScreen"); // Make sure this route exists
  };

  return (
    <View style={styles.container}>
      {/* Sub text */}
      <Text style={styles.subText}>
        {" Don't "}hesitate to contact us whether you have a suggestion on our
        improvement, a complain to discuss or an issue to solve.
      </Text>

      {/* Cards */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.card, { flex: 1 }]}
          onPress={handleCall}
        >
          <View style={styles.iconBox}>
            <Image
              source={Images.call}
              style={{ width: 20, height: 20, tintColor: Colors.white }}
            />
          </View>
          <Text style={styles.cardText}>514-601-4598</Text>
          <Text style={styles.cardTitle}>Call us</Text>
          <Text style={styles.cardFooter}>
            Our team is on the line{"\n"}Mon-Fri • 9-17
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { flex: 1 }]}
          onPress={handleEmail}
        >
          <View style={styles.iconBox}>
            <Image
              source={Images.mail2}
              style={{ width: 20, height: 20, tintColor: Colors.white }}
            />
          </View>
          <Text style={styles.cardText}>contact@tifstay.com</Text>
          <Text style={styles.cardTitle}>Email us</Text>
          <Text style={styles.cardFooter}>
            Our team is online{"\n"}Mon-Fri • 9-17
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.card, { alignSelf: "center" }]}
        onPress={handleChat}
      >
        <View style={styles.iconBox}>
          <Image
            source={Images.chat1}
            style={{ width: 20, height: 20, tintColor: Colors.white }}
          />
        </View>
        <Text style={styles.cardText}>Chat Support</Text>
        <Text style={styles.cardTitle}>Chat With Admin</Text>
        <Text style={styles.cardFooter}>
          Our team is on the line{"\n"}Mon-Fri • 9-17
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
  },
  subText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f7f5ff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 5,
  },
  iconBox: {
    backgroundColor: "#1E40AF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 13,
    color: Colors.grey,
    textAlign: "center",
    marginBottom: 4,
    fontFamily: fonts.interRegular,
    marginTop: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.interMedium,
    color: Colors.primary,
    marginBottom: 6,
    marginTop: 14,
  },
  cardFooter: {
    fontSize: 13,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
    textAlign: "center",
    lineHeight: 16,
  },
});
