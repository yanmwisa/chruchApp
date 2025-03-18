import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

const RegisterScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../assets/church.jpg")}
      className="flex-1"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1"
      >
        <SafeAreaView className="flex-1 bg-black/50 justify-center items-center px-6">
          {/* En-tête */}
          <Animated.View entering={FadeIn.duration(500)} className="w-full items-center mb-6">
            <Text className="text-white text-4xl font-extrabold">Créer un compte</Text>
            <Text className="text-white text-lg mt-2">Rejoignez-nous dès aujourd'hui</Text>
          </Animated.View>

          {/* Formulaire */}
          <View className="w-full">
            <TextInput className="bg-white p-4 rounded-lg shadow-md mb-4" placeholder="Nom complet" />
            <TextInput className="bg-white p-4 rounded-lg shadow-md mb-4" placeholder="Email" keyboardType="email-address" />
            <TextInput className="bg-white p-4 rounded-lg shadow-md mb-4" placeholder="Mot de passe" secureTextEntry />
          </View>

          {/* Bouton S'inscrire */}
          <TouchableOpacity className="bg-green-500 p-4 rounded-full shadow-lg flex-row items-center justify-center w-full">
            <Ionicons name="person-add-outline" size={24} color="white" />
            <Text className="text-white text-lg font-bold ml-2">S'inscrire</Text>
          </TouchableOpacity>

          {/* Redirection vers la connexion */}
          <TouchableOpacity className="mt-4" onPress={() => navigation.navigate("Login")}>
            <Text className="text-white text-lg">
              Déjà un compte ?{" "}
              <Text className="text-yellow-400 font-bold">Connectez-vous</Text>
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default RegisterScreen;
