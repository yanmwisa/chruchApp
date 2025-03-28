import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { databases } from "../lib/appwrite";
import { Query } from "react-native-appwrite";
import {getCurrentUser} from "../lib/auth";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID
} from "@env";

const posts = [];

export default function NewsFeedScreen({ navigation, route, isAdmin }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const res = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        [Query.orderDesc("created_at")]
      );

      const formatted = res.documents.map((doc) => ({
        id: doc.$id,
        title: doc.text || "Sans titre",
        image: doc.imageUrl,
        date: new Date(doc.created_at).toLocaleDateString(),
        description: doc.created_by,
        authorName: doc.name || "Auteur inconnu"
      }));

      setPosts(formatted);
    } catch (err) {
      console.log("Erreur lors du chargement des posts :", err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchPosts);
    return unsubscribe;
  }, [navigation, fetchPosts]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* En-tête avec fond dégradé */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="p-5 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-extrabold text-black">
              Fil d'Actualité
            </Text>
            <Text className="text-lg text-gray-200">
              Les dernières annonces et événements
            </Text>
          </View>
          <Ionicons name="notifications-outline" size={28} color="white" />
        </View>
      </Animated.View>

      {/* Barre de recherche */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(500)}
        className="flex-row items-center bg-white p-4 mx-4 mt-3 rounded-lg shadow-md"
      >
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
        data={posts.filter((post) =>
          post.title.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(index * 100)}
            className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-lg"
          >
            <Image
              source={{ uri: item.image }}
              className="w-full h-48 rounded-lg"
            />
            <Text className="text-xl font-bold text-gray-900 mt-3">
              {item.title}
            </Text>
            <Text className="text-gray-500 mt-1">{item.date}</Text>
            <Text className="text-gray-700 mt-2">Posté par {item.authorName}</Text>

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
      {isAdmin && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg"
          onPress={() => navigation.navigate("AddPost")}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
