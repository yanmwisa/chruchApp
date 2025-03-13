import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  ImageBackground
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";

const verses = [
  '"Louez le Seigneur, car il est bon, car sa miséricorde dure à jamais." - Psaume 136:1',
  '"Je puis tout par celui qui me fortifie." - Philippiens 4:13',
  '"Ne crains rien, car je suis avec toi." - Ésaïe 41:10'
];

const HomeScreen = ({ navigation }) => {
  const [currentVerse, setCurrentVerse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % verses.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/church.jpg")}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-black/40">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20
          }}
        >
          {/* En-tête amélioré */}
          <Animated.View
            entering={FadeInUp.duration(500)}
            className="w-full p-5 flex-row items-center justify-between bg-white/10 rounded-lg shadow-lg"
          >
            <Text className="text-white text-2xl font-extrabold text-center">
              Bienvenue à l'Église Mahombi Mbele
            </Text>
          </Animated.View>

          {/* Carousel de Versets */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(500)}
            className="mt-6 p-5 bg-white/20 rounded-xl shadow-lg w-4/5"
          >
            <Text className="text-white italic text-center text-lg">
              {verses[currentVerse]}
            </Text>
          </Animated.View>

          {/* Section contenant les boutons */}
          <View className="flex-1 justify-center items-center w-full">
            <Animated.View
              entering={FadeInUp.delay(400).duration(500)}
              className="w-full items-center"
            >
              <TouchableOpacity className="w-4/5 bg-white p-4 rounded-full shadow-lg items-center">
                <Text className="text-blue-500 text-lg font-bold">
                  Faire un Don
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-4/5 bg-green-500 p-4 rounded-full shadow-lg items-center mt-4"
                onPress={() => navigation.navigate("MainTabs")}
              >
                <Text className="text-white text-lg font-bold">
                  Voir les Événements
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;
