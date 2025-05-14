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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <SafeAreaView className="flex-1 bg-[#F5F6FA]">
            {/* En-tête moderne */}
            <Animated.View
              entering={FadeIn.duration(500)}
              className="px-6 pt-8 pb-4 bg-white border-b border-gray-100"
              style={{ elevation: 0, shadowOpacity: 0 }}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-2xl font-bold text-gray-900">
                    Faire un Don
                  </Text>
                  <Text className="text-base text-gray-400 mt-1">
                    Soutenez la mission de l'église
                  </Text>
                </View>
                <Ionicons name="heart-outline" size={26} color="#A0AEC0" />
              </View>
            </Animated.View>

            {/* Solde Total */}
            <Animated.View
              entering={FadeInUp.duration(500)}
              className="mx-6 mt-6 p-5 bg-blue-500 rounded-2xl"
              style={{ shadowOpacity: 0, elevation: 0 }}
            >
              <Text className="text-white text-base">Total des Dons</Text>
              <Text className="text-white text-3xl font-bold mt-1">$1,250</Text>
            </Animated.View>

            {/* Montants rapides */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(500)}
              className="mt-8 px-6"
            >
              <Text className="text-base text-gray-700 font-semibold mb-3">
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
                    className={`px-6 py-4 mr-3 rounded-xl border ${
                      selectedAmount === item
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-200"
                    }`}
                    style={{ minWidth: 80, alignItems: "center" }}
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
              className="mt-8 px-6"
            >
              <Text className="text-base text-gray-700 font-semibold mb-2">
                Ou entrez un montant personnalisé
              </Text>
              <TextInput
                className="border border-gray-200 px-4 py-3 rounded-xl text-lg bg-white"
                keyboardType="numeric"
                placeholder="$ Montant"
                placeholderTextColor="#A0AEC0"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  setSelectedAmount(null);
                }}
                style={{ marginBottom: 4 }}
              />
            </Animated.View>

            {/* Bouton de confirmation */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(500)}
              className="mt-10 px-6"
            >
              <TouchableOpacity
                className={`p-4 rounded-xl flex-row items-center justify-center ${
                  amount ? "bg-green-500" : "bg-gray-200"
                }`}
                disabled={!amount}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color={amount ? "white" : "#A0AEC0"}
                />
                <Text
                  className={`ml-2 text-lg font-bold ${
                    amount ? "text-white" : "text-gray-400"
                  }`}
                >
                  Confirmer le Don
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Bouton flottant pour historique des dons */}
            <TouchableOpacity
              className="absolute bottom-7 right-7 bg-blue-500 p-4 rounded-full shadow-lg"
              style={{ elevation: 4 }}
            >
              <Ionicons name="time-outline" size={28} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
