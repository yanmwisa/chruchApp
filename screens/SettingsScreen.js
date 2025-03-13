import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Image
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* En-tête avec fond dégradé */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="p-5 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md"
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-3xl font-extrabold text-white">Paramètres</Text>
          <Ionicons name="settings-outline" size={28} color="white" />
        </View>
      </Animated.View>

      {/* Section Profil */}
      <Animated.View
        entering={FadeInUp.duration(500)}
        className="m-4 p-5 bg-white rounded-lg shadow-lg items-center"
      >
        <Image
          source={{ uri: "https://source.unsplash.com/100x100/?portrait" }}
          className="w-24 h-24 rounded-full"
        />
        <Text className="text-xl font-bold text-gray-900 mt-3">
          Yannick Kibale
        </Text>
        <Text className="text-gray-500">yannick@example.com</Text>
      </Animated.View>

      {/* Options de Paramètres */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(500)}
        className="mx-4"
      >
        <TouchableOpacity className="bg-white p-4 rounded-lg shadow-md flex-row items-center justify-between mt-3">
          <View className="flex-row items-center">
            <Ionicons name="person-outline" size={24} color="gray" />
            <Text className="ml-3 text-lg text-gray-800">
              Modifier le profil
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg shadow-md flex-row items-center justify-between mt-3">
          <View className="flex-row items-center">
            <Ionicons name="lock-closed-outline" size={24} color="gray" />
            <Text className="ml-3 text-lg text-gray-800">
              Changer le mot de passe
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="gray" />
        </TouchableOpacity>

        <View className="bg-white p-4 rounded-lg shadow-md flex-row items-center justify-between mt-3">
          <View className="flex-row items-center">
            <Ionicons name="notifications-outline" size={24} color="gray" />
            <Text className="ml-3 text-lg text-gray-800">Notifications</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <TouchableOpacity className="bg-white p-4 rounded-lg shadow-md flex-row items-center justify-between mt-3">
          <View className="flex-row items-center">
            <Ionicons name="help-circle-outline" size={24} color="gray" />
            <Text className="ml-3 text-lg text-gray-800">Support & Aide</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="gray" />
        </TouchableOpacity>
      </Animated.View>

      {/* Bouton Déconnexion */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(500)}
        className="mx-4 mt-6"
      >
        <TouchableOpacity className="bg-red-500 p-4 rounded-lg shadow-lg flex-row items-center justify-center">
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="text-white text-lg font-bold ml-2">Déconnexion</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
