import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../assets/church.jpg")}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 bg-black/40 justify-center items-center p-5">
          {/* En-tête */}
          <View className="w-11/12 items-center mb-5">
            <Text className="text-white text-3xl font-bold">Connexion</Text>
            <Text className="text-white text-lg mt-1">
              Connectez-vous pour continuer
            </Text>
          </View>

          {/* Formulaire de connexion */}
          <View className="w-11/12">
            <TextInput
              placeholder="Email"
              placeholderTextColor="gray"
              className="bg-white p-3 rounded-lg mb-3"
            />
            <TextInput
              placeholder="Mot de passe"
              placeholderTextColor="gray"
              secureTextEntry
              className="bg-white p-3 rounded-lg mb-3"
            />
            <TouchableOpacity>
              <Text className="text-right text-yellow-400 text-sm mb-3">
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bouton de connexion */}
          <View className="w-11/12">
            <TouchableOpacity
              className="bg-green-500 p-3 rounded-lg items-center mb-4"
              onPress={() => navigation.navigate("Home")}
            >
              <Text className="text-white text-lg font-bold">Se Connecter</Text>
            </TouchableOpacity>
          </View>

          {/* Option pour s'inscrire */}
          <View className="flex-row items-center">
            <Text className="text-white text-sm">Pas encore de compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="text-yellow-400 text-sm font-bold ml-2">
                Inscrivez-vous
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;
