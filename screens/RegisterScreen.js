import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

const RegisterScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* En-tête avec fond dégradé */}
      <Animated.View entering={FadeIn.duration(500)} className="p-5 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
        <Text className="text-3xl font-extrabold text-white">Créer un compte</Text>
        <Text className="text-lg text-gray-200">Rejoignez-nous dès aujourd'hui</Text>
      </Animated.View>

      {/* Formulaire */}
      <View className="px-6 mt-6">
        <Text className="text-lg text-gray-700 mb-2">Nom complet</Text>
        <TextInput className="border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-md" placeholder="Entrez votre nom" />

        <Text className="text-lg text-gray-700 mt-4 mb-2">Email</Text>
        <TextInput className="border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-md" placeholder="Entrez votre email" keyboardType="email-address" />

        <Text className="text-lg text-gray-700 mt-4 mb-2">Mot de passe</Text>
        <TextInput className="border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-md" placeholder="Entrez votre mot de passe" secureTextEntry />

        <TouchableOpacity className="mt-6 bg-green-500 p-4 rounded-lg shadow-lg flex-row items-center justify-center">
          <Ionicons name="person-add-outline" size={24} color="white" />
          <Text className="text-white text-lg font-bold ml-2">S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4">
          <Text className="text-center text-blue-500 text-lg">Déjà un compte ? Connectez-vous</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default RegisterScreen;