import { Platform } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

const quickAmounts = [10, 20, 50, 100];

export default function DonationScreen() {
  const [amount, setAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <SafeAreaView className="flex-1 bg-gray-50">
            {/* En-tête avec fond dégradé */}
            <Animated.View
              entering={FadeIn.duration(500)}
              className="p-5 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-3xl font-extrabold text-black">
                    Faire un Don
                  </Text>
                  <Text className="text-lg text-gray-200">
                    Soutenez la mission de l'église
                  </Text>
                </View>
                <Ionicons name="heart-outline" size={28} color="white" />
              </View>
            </Animated.View>

            {/* Solde Total */}
            <Animated.View
              entering={FadeInUp.duration(500)}
              className="m-4 p-5 bg-blue-500 rounded-lg shadow-lg"
            >
              <Text className="text-white text-lg">Total des Dons</Text>
              <Text className="text-white text-3xl font-bold mt-1">$1,250</Text>
            </Animated.View>

            {/* Montants rapides */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(500)}
              className="mt-6 px-5"
            >
              <Text className="text-lg text-gray-700 font-semibold mb-3">
                Sélectionner un montant
              </Text>
              <FlatList
                horizontal
                data={quickAmounts}
                keyExtractor={(item) => item.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setAmount(item.toString());
                      setSelectedAmount(item);
                    }}
                    className={`px-6 py-4 mx-2 rounded-lg ${
                      selectedAmount === item
                        ? "bg-blue-500"
                        : "bg-white border border-gray-300"
                    } shadow-md`}
                  >
                    <Text
                      className={`text-lg font-bold ${
                        selectedAmount === item ? "text-white" : "text-gray-800"
                      }`}
                    >
                      ${item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </Animated.View>

            {/* Montant personnalisé */}
            <Animated.View
              entering={FadeInUp.delay(200).duration(500)}
              className="mt-6 px-5"
            >
              <Text className="text-lg text-gray-700 font-semibold mb-2">
                Ou entrez un montant personnalisé
              </Text>
              <TextInput
                className="border border-gray-400 px-4 py-3 rounded-lg text-lg bg-white shadow-md"
                keyboardType="numeric"
                placeholder="$ Montant"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  setSelectedAmount(null);
                }}
              />
            </Animated.View>

            {/* Bouton de confirmation */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(500)}
              className="mt-8 px-5"
            >
              <TouchableOpacity
                className="bg-green-500 p-4 rounded-lg shadow-lg flex-row items-center justify-center"
                disabled={!amount}
              >
                <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                <Text className="text-white text-lg font-bold ml-2">
                  Confirmer le Don
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Bouton flottant pour historique des dons */}
            <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg">
              <Ionicons name="time-outline" size={30} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
