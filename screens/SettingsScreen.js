import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { logout, getCurrentUser } from "../lib/auth";
import { Alert } from "react-native";

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [downloadOnlyWifi, setDownloadOnlyWifi] = useState(true);
  const [playInBackground, setPlayInBackground] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleSignOut = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        Alert.alert("Info", "No user is currently logged in.");
        return;
      }

      await logout();

      navigation.navigate("Auth", { screen: "Login" });
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    }
  };
  // get the current user
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    fetchUser();
  }, []);

  const handleEditProfile = () => {
    // Implement navigation or actions for profile editing
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* User Info */}
      <View className="items-center border-b border-gray-200 p-4">
        <Image
          source={{ uri: "https://source.unsplash.com/100x100/?portrait" }}
          className="w-16 h-16 rounded-full"
        />
        <Text className="mt-2 text-lg font-semibold">
          {user?.name || "utilisateur"}
        </Text>
        <Text className="text-gray-500">
          {user?.email || "danilo@uscreen.tv"}
        </Text>
        <TouchableOpacity
          onPress={handleEditProfile}
          className="mt-2 rounded-full bg-blue-500 px-4 py-2"
        >
          <Text className="font-semibold text-white">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View className="mt-4">
        <Text className="px-4 mb-2 font-bold text-gray-600">CONTENT</Text>
        <TouchableOpacity className="flex-row items-center justify-between bg-white px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons name="heart" size={22} color="black" />
            <Text className="ml-3 text-base">Favorites</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-between bg-white px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons name="download" size={22} color="black" />
            <Text className="ml-3 text-base">Downloads</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View className="mt-4">
        <Text className="px-4 mb-2 font-bold text-gray-600">PREFERENCES</Text>
        <View className="flex-row items-center justify-between bg-white px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons name="language" size={22} color="black" />
            <Text className="ml-3 text-base">Language</Text>
          </View>
          <Text className="text-gray-500">{language}</Text>
        </View>

        <View className="flex-row items-center justify-between bg-white px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons name="moon" size={22} color="black" />
            <Text className="ml-3 text-base">Dark Mode</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <View className="flex-row items-center justify-between bg-white px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons name="wifi" size={22} color="black" />
            <Text className="ml-3 text-base">Only Download via Wi-Fi</Text>
          </View>
          <Switch
            value={downloadOnlyWifi}
            onValueChange={setDownloadOnlyWifi}
          />
        </View>

        <View className="flex-row items-center justify-between bg-white px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons name="musical-notes" size={22} color="black" />
            <Text className="ml-3 text-base">Play in Background</Text>
          </View>
          <Switch
            value={playInBackground}
            onValueChange={setPlayInBackground}
          />
        </View>
      </View>

      {/* Logout Button */}
      <View className="mt-6 px-4">
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-center rounded-lg border border-red-500 bg-white py-3"
        >
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <Text className="ml-2 font-semibold text-red-500">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
