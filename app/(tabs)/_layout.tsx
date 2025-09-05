import Tabs from "expo-router/tabs";
import React from "react";
import { Image, Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 

import { HapticTab } from "@/components/HapticTab";
import { Images } from "@/constants/Images";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";

function TabIcon({
  source,
  label,
  focused,
  hsource
}: {
  source: any;
  label: string;
  focused: boolean;
  size?: number;
  hsource:any
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: focused ? 0 : 26,
      }}
    >
      <View
        style={{
          backgroundColor: focused ? Colors.primary : "transparent",
          borderRadius: 25,
          padding: focused ? 10 : 0,
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          width: 50,
          marginTop : focused ? 20 : 0
        }}
      >
        <Image
          source={focused? hsource : source}
          style={{
            height: 24,
            width: 24,
            // tintColor: focused ? Colors.white : Colors.tabicon,
          }}
          resizeMode="contain"
        />
      </View>
      {focused && (
        <Text
          style={{
            fontSize: 12,
            color: Colors.primary,
            marginTop: 8,
            fontFamily: fonts.interRegular,
            minWidth: 100,
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.tabbg,
            }}
          />
        ),
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            height: 77 + insets.bottom,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: -3 },
            paddingBottom: insets.bottom,
          },
          android: {
            backgroundColor: "red",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            elevation: 5,
            height: 77 + insets.bottom,   // fix: add safe area
            paddingBottom: insets.bottom, // fix: add spacing
          },
        }),        
      }}
    >
      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: "(dashboard)",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={Images.dashboard}
              label="Dashboard"
              focused={focused}
              hsource={Images.hdashboard}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={Images.earnings}
              label="Earnings"
              focused={focused}
              hsource={Images.hpearn}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => (
            <TabIcon source={Images.orders} label="Orders" focused={focused}   hsource={Images.horder}            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={Images.notifications}
              label="Notification"
              focused={focused}
              hsource={Images.hnoti}

            />
          ),
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={Images.account}
              label="Account"
              focused={focused}
              hsource={Images.hprofile} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
