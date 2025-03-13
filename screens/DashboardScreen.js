import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

const donations = [
  { id: "1", amount: 50, date: "10 Mars 2024" },
  { id: "2", amount: 20, date: "5 Mars 2024" },
  { id: "3", amount: 100, date: "1 Mars 2024" }
];

export default function DashboardScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* En-tête avec fond dégradé */}
        <Animated.View
          entering={FadeIn.duration(500)}
          className="p-5 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md"
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-extrabold text-white">
                Tableau de Bord
              </Text>
              <Text className="text-lg text-gray-200">
                Suivi de vos dons et contributions
              </Text>
            </View>
            <Ionicons name="stats-chart-outline" size={28} color="white" />
          </View>
        </Animated.View>

        {/* Solde Total */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="m-4 p-5 bg-blue-500 rounded-lg shadow-lg"
        >
          <Text className="text-white text-lg">Total des Dons</Text>
          <Text className="text-white text-3xl font-bold mt-1">$170</Text>
        </Animated.View>

        {/* Historique des transactions */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          className="mx-4 mt-2 flex-1"
        >
          <Text className="text-lg font-semibold text-gray-700 mb-3">
            Historique des Dons
          </Text>
          <FlatList
            data={donations}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInUp.delay(index * 100).duration(500)}
                className="bg-white p-4 rounded-lg shadow-md mt-3 flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-lg font-bold text-gray-900">
                    ${item.amount}
                  </Text>
                  <Text className="text-gray-600">Donné le {item.date}</Text>
                </View>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="green"
                />
              </Animated.View>
            )}
          />
        </Animated.View>

        {/* Section Partenaire */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          className="m-4 p-5 bg-green-500 rounded-lg shadow-lg"
        >
          <Text className="text-white text-lg font-semibold text-center">
            🎉 En tant que Partenaire, vous avez accès à des contenus exclusifs
            !
          </Text>
        </Animated.View>

        {/* Bouton flottant */}
        <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg">
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
