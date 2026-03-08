import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import Colors from "@/constants/colors";

export default function TabLayout() {
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.navyBar,
          borderTopWidth: 0,
          elevation: 0,
          height: isWeb ? 84 : 85,
          paddingBottom: isWeb ? 34 : Platform.OS === "ios" ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
          marginTop: 2,
        },
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.navyBar }]} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calculate",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tip-guide"
        options={{
          title: "Tip Guide",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="information"
        options={{
          title: "Information",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
