import { SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import React from "react";

const LoginScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center p-5">
      <View className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        <Text className="text-2xl font-bold text-center text-gray-800 mb-4">
          Connexion
        </Text>

        <TextInput
          className="w-full border border-gray-300 p-3 rounded-lg mb-3"
          placeholder="Email"
          keyboardType="email-address"
        />

        <TextInput
          className="w-full border border-gray-300 p-3 rounded-lg mb-5"
          placeholder="Mot de passe"
          secureTextEntry
        />

        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg items-center">
          <Text className="text-white text-lg font-bold">Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4">
          <Text className="text-blue-500 text-center">
            Mot de passe oublié ?
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
