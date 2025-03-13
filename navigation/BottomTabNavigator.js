import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NewsFeedScreen from "../screens/NewsFeedScreen";
import DonationScreen from "../screens/DonationScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons } from "react-native-vector-icons";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="NewsFeed"
      component={NewsFeedScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="newspaper-outline" color={color} size={size} />
        )
      }}
    />
    <Tab.Screen
      name="Donation"
      component={DonationScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart-outline" color={color} size={size} />
        )
      }}
    />
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-circle-outline" color={color} size={size} />
        )
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings-outline" color={color} size={size} />
        )
      }}
    />
  </Tab.Navigator>
);

export default BottomTabNavigator;
