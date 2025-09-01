import Tabs from 'expo-router/tabs';  // Correct import for Tabs
import React from 'react';
import { Image, Platform, Text, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Images } from '@/constants/images';

function TabIcon({ source, label, focused, size = 20 }: { source: any; label: string; focused: boolean; size?: number }) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: focused ? -16 : 0, // lift icon when focused
      }}
    >
      <View
        style={{
          backgroundColor: focused ? '#0052CC' : 'transparent',
          borderRadius: 25,
          padding: focused ? 10 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: focused ? '#0052CC' : 'transparent',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: focused ? 5 : 0,
        }}
      >
        <Image
          source={source}
          style={{
            height: focused ? 24 + 4 : 24,
            width: focused ? 24 + 4 : 24,
            tintColor: focused ? '#fff' : '#999',
          }}
          resizeMode="contain"
        />
      </View>
      {focused && (
        <Text
          // numberOfLines={1}  // Ensures single line only
          // ellipsizeMode="tail" // Truncates if too long
          style={{
            fontSize: 12,
            color: '#0052CC',
            marginTop: 6,
            // maxWidth: 80,
            minWidth: 100,
            textAlign: 'center',
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 70,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: -3 },
          },
          default: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            elevation: 5,
            height: 70,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={Images.dashboard} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={Images.earnings} label="Earnings" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={Images.orders} label="Orders" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notification',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={Images.notifications} label="Notification" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={Images.account} label="Account" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
