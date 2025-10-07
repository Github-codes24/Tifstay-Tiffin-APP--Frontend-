import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CommonButton from "@/components/CommonButton";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { IS_ANDROID, IS_IOS } from "@/constants/Platform";
import { fonts } from "@/constants/typography";
import useAuthStore from "@/store/authStore";

const { width } = Dimensions.get("window");

type SlideType = "splash" | "onboarding";

interface Slide {
  id: string;
  title: string;
  description: string;
  type: SlideType;
  image: any;
}

const slides: Slide[] = [
  {
    id: "1",
    title: "Tifstay",
    description: "Eat. Stay. Simplified.",
    type: "splash",
    image: Images.splashlogo,
  },
  {
    id: "2",
    title: "Tifstay",
    description: "Find home-style meals & hostels in one app.",
    type: "onboarding",
    image: Images.food,
  },
];

export default function Splash() {
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { hasSeenSplash, setSplashSeen, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (hasSeenSplash) {
      // If splash has been seen before, navigate directly to appropriate screen
      if (isAuthenticated) {
        router.replace("/(secure)/(tabs)/(dashboard)");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [hasSeenSplash, isAuthenticated]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const renderItem: ListRenderItem<Slide> = ({ item }) => {
    if (item.type === "splash") {
      return (
        <View style={styles.slide}>
          <ImageBackground
            source={Images.splash}
            style={styles.splashBg}
            resizeMode="cover"
          >
            <Image
              source={item.image}
              style={styles.logo}
              resizeMode="contain"
            />
          </ImageBackground>
        </View>
      );
    }

    if (item.type === "onboarding") {
      return (
        <View style={styles.slide}>
          <Image
            source={Images.logo}
            style={styles.appLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Image
            source={item.image}
            style={styles.foodImage}
            resizeMode="cover"
          />
          <CommonButton
            title="Get Started"
            buttonStyle={styles.commonButton}
            onPress={async () => {
              await setSplashSeen();
              router.push("/loginoption");
            }}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
      />
      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
  },
  splashBg: {
    width: "100%",
    height: IS_IOS ? "95%" : "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 260,
    height: 202,
    marginBottom: 20,
  },
  appLogo: {
    width: 87,
    height: 87,
    marginBottom: 7,
  },
  foodImage: {
    width: IS_ANDROID ? "85%" : "100%",
    height: 187,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.interSemibold,
    marginBottom: 12,
    textAlign: "center",
    color: Colors.title,
  },
  description: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: "center",
    fontFamily: fonts.interRegular,
    marginBottom: 20,
    paddingHorizontal: 60,
  },
  commonButton: {
    width: "85%",
  },
  dotsContainer: {
    position: "absolute",
    bottom: IS_ANDROID ? 80 : 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.orange,
    width: 32,
    borderRadius: 21,
  },
});
