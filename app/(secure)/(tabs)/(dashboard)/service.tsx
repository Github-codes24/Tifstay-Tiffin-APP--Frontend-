import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import LabeledInput from "@/components/labeledInput";
import { Images } from "@/constants/Images";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import CustomSwitch from "@/components/CommonSwitch";

export default function ServiceStatus() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Maharashtrian Ghar ka Khana",
      location: "Dharampeth Nagpur",
      delivery: true,
      rush: true,
      slot: "9.30am - 10.30pm",
      slotType: "Current",
    },
    {
      id: 2,
      name: "Ghar ka Khana",
      location: "CRPF Nagpur",
      delivery: false,
      rush: true,
      slot: "01 Sept, 9.30am - 10.30pm",
      slotType: "Next scheduled",
    },
  ]);
  return (
    <View style={styles.container}>
      <LabeledInput
        placeholder="Search your service"
        leftIconSource={Images.search}
        containerStyle={{ paddingHorizontal: 0, marginBottom: 20 }}
        inputContainerStyle={{ backgroundColor: Colors.searchColor }}
        inputStyle={{fontSize:14}}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {services.map((service) => (
          <View key={service.id} style={styles.card}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceLocation}>{service.location}</Text>

            {/* Delivery Status */}
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.label}>Delivery status</Text>
                <Text style={styles.subLabel}>
                  {service.delivery ? "Receiving order" : "Not receiving order"}
                </Text>
              </View>
              <CustomSwitch />
            </View>

            {/* Rush Mode */}
            <View style={styles.rushRow}>
              <Text style={styles.label}>Rush Mode</Text>
              <CustomSwitch />
            </View>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: Colors.lightGrey,
                borderStyle: "dashed",
              }}
            ></View>
            {/* Slot */}
            <View style={styles.rowBetween}>
              <Text style={styles.slotText}>
                {service.slotType} delivery slot{"\n"}
                <Text style={styles.slotBold}>{service.slot}</Text>
              </Text>
              <Pressable>
                <Text style={styles.linkText}>See Details</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop:48
  },
  card: {
    backgroundColor: Colors.searchColor,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  serviceLocation: {
    fontSize: 12,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  rushRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    marginBottom: 8,
    marginTop: 14,
  },

  label: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  subLabel: {
    fontSize: 12,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
  },
  slotText: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: Colors.title,
  },
  slotBold: {
    fontSize: 12,
    color: Colors.grey,
    fontFamily: fonts.interRegular,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily:fonts.interMedium,
    textDecorationLine: "underline",    
  },
});
