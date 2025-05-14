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

      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }]
      });
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
    <SafeAreaView className="flex-1 bg-[#F5F6FA]">
      {/* User Info */}
      <View className="items-center border-b border-gray-100 px-6 pt-8 pb-6 bg-white">
        <Image
          source={{ uri: "https://source.unsplash.com/100x100/?portrait" }}
          className="w-20 h-20 rounded-full border-4 border-blue-100"
        />
        <Text className="mt-3 text-xl font-bold text-gray-900">
          {user?.name || "utilisateur"}
        </Text>
        <Text className="text-gray-400">
          {user?.email || "danilo@uscreen.tv"}
        </Text>
        <TouchableOpacity
          onPress={handleEditProfile}
          className="mt-3 rounded-full bg-blue-500 px-6 py-2"
        >
          <Text className="font-semibold text-white">Modifier le profil</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View className="mt-8">
        <Text className="px-6 mb-2 font-bold text-gray-500 uppercase text-xs tracking-widest">
          Contenu
        </Text>
        <TouchableOpacity className="flex-row items-center justify-between bg-white px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="heart" size={20} color="#A0AEC0" />
            <Text className="ml-3 text-base text-gray-800">Favoris</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-between bg-white px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="download" size={20} color="#A0AEC0" />
            <Text className="ml-3 text-base text-gray-800">
              Téléchargements
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View className="mt-8">
        <Text className="px-6 mb-2 font-bold text-gray-500 uppercase text-xs tracking-widest">
          Préférences
        </Text>
        <View className="flex-row items-center justify-between bg-white px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="language" size={20} color="#A0AEC0" />
            <Text className="ml-3 text-base text-gray-800">Langue</Text>
          </View>
          <Text className="text-gray-400">{language}</Text>
        </View>
        <View className="flex-row items-center justify-between bg-white px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="moon" size={20} color="#A0AEC0" />
            <Text className="ml-3 text-base text-gray-800">Mode sombre</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
        <View className="flex-row items-center justify-between bg-white px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="wifi" size={20} color="#A0AEC0" />
            <Text className="ml-3 text-base text-gray-800">
              Télécharger uniquement en Wi-Fi
            </Text>
          </View>
          <Switch
            value={downloadOnlyWifi}
            onValueChange={setDownloadOnlyWifi}
          />
        </View>
        <View className="flex-row items-center justify-between bg-white px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="musical-notes" size={20} color="#A0AEC0" />
            <Text className="ml-3 text-base text-gray-800">
              Lecture en arrière-plan
            </Text>
          </View>
          <Switch
            value={playInBackground}
            onValueChange={setPlayInBackground}
          />
        </View>
      </View>

      {/* Logout Button */}
      <View className="mt-10 px-6">
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-center rounded-xl border border-red-500 bg-white py-4"
        >
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <Text className="ml-2 font-semibold text-red-500">Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
