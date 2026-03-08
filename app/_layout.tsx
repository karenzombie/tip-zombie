import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { View, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

SplashScreen.preventAutoHideAsync();

function CustomSplash({ onFinish }: { onFinish: () => void }) {
  const opacity = useSharedValue(1);
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 800 });
    logoOpacity.value = withTiming(1, { duration: 800 });

    opacity.value = withDelay(
      3000,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      })
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, containerStyle, { zIndex: 100 }]}>
      <LinearGradient
        colors={["#1a472a", "#0d2818", "#050f08", "#000000"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={splashStyles.content}>
        <Animated.View style={logoStyle}>
          <Image
            source={require("@/assets/images/tip-zombie-logo.png")}
            style={splashStyles.logo}
            contentFit="contain"
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const splashStyles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 180,
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="privacy-policy"
        options={{
          title: "Privacy Policy",
          headerStyle: { backgroundColor: "#1a1f2e" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: "Terms & Conditions",
          headerStyle: { backgroundColor: "#1a1f2e" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <StatusBar style="light" />
            <RootLayoutNav />
            {showSplash && <CustomSplash onFinish={handleSplashFinish} />}
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
