import { View, Text, FlatList, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

const posts = [
  {
    id: '1',
    title: 'Culte de dimanche',
    description: 'Rejoignez-nous ce dimanche pour un moment puissant de louange et d’adoration !',
    image: 'https://source.unsplash.com/600x400/?church',
    date: 'Dimanche, 10 Mars',
  },
  {
    id: '2',
    title: 'Soirée de prière',
    description: 'Unissons nos voix dans la prière ce mercredi soir à 19h.',
    image: 'https://source.unsplash.com/600x400/?prayer',
    date: 'Mercredi, 13 Mars',
  },
  {
    id: '3',
    title: 'Événement jeunesse',
    description: 'Les jeunes se réunissent pour un temps de partage et de joie !',
    image: 'https://source.unsplash.com/600x400/?youth',
    date: 'Samedi, 16 Mars',
  },
];

export default function NewsFeedScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* En-tête avec fond dégradé */}
      <Animated.View entering={FadeIn.duration(500)} className="p-5 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-extrabold text-white">Fil d'Actualité</Text>
            <Text className="text-lg text-gray-200">Les dernières annonces et événements</Text>
          </View>
          <Ionicons name="notifications-outline" size={28} color="white" />
        </View>
      </Animated.View>

      {/* Barre de recherche */}
      <Animated.View entering={FadeInUp.delay(100).duration(500)} className="flex-row items-center bg-white p-4 mx-4 mt-3 rounded-lg shadow-md">
        <Ionicons name="search" size={20} color="gray" className="mr-2" />
        <TextInput
          className="flex-1 text-gray-800 text-lg"
          placeholder="Rechercher une annonce..."
          value={search}
          onChangeText={setSearch}
        />
      </Animated.View>

      {/* Liste des annonces */}
      <FlatList
        data={posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 100)} className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-lg">
            <Image source={{ uri: item.image }} className="w-full h-48 rounded-lg" />
            <Text className="text-xl font-bold text-gray-900 mt-3">{item.title}</Text>
            <Text className="text-gray-500 mt-1">{item.date}</Text>
            <Text className="text-gray-700 mt-2">{item.description}</Text>

            {/* Boutons interactifs */}
            <View className="flex-row justify-between items-center mt-4">
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="heart-outline" size={22} color="gray" />
                <Text className="ml-2 text-gray-600">J'aime</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={22} color="gray" />
                <Text className="ml-2 text-gray-600">Commenter</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="share-outline" size={22} color="gray" />
                <Text className="ml-2 text-gray-600">Partager</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />

      {/* Bouton flottant pour ajouter un post */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg">
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}