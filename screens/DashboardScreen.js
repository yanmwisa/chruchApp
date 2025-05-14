import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Button
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { databases } from "../lib/appwrite";
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "@env";
import { getCurrentUser, isAdmin } from "../lib/auth";
import AddPostScreen from "./AddPostScreen";

const donations = [
  { id: "1", amount: 50, date: "10 Mars 2024" },
  { id: "2", amount: 20, date: "5 Mars 2024" },
  { id: "3", amount: 100, date: "1 Mars 2024" }
];

export default function DashboardScreen({ navigation }) {
  const [admin, setAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    (async () => {
      setAdmin(await isAdmin());
    })();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        []
      );
      setPosts(res.documents);
    } catch (e) {
      Alert.alert("Erreur", e.message || JSON.stringify(e));
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  const handleDelete = async (postId) => {
    try {
      await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        postId
      );
      setRefresh((r) => !r);
    } catch (e) {
      Alert.alert("Erreur suppression", e.message || JSON.stringify(e));
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setEditText(post.text || "");
  };
  const handleEditSave = async () => {
    try {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        editPost.$id,
        { text: editText }
      );
      setEditPost(null);
      setEditText("");
      setRefresh((r) => !r);
    } catch (e) {
      Alert.alert("Erreur modification", e.message || JSON.stringify(e));
    }
  };

  if (!admin) {
    return (
      <View className="flex-1 bg-[#F5F6FA]">
        {/* En-tête moderne */}
        <Animated.View
          entering={FadeIn.duration(500)}
          className="px-6 pt-8 pb-4 bg-white border-b border-gray-100"
          style={{ elevation: 0, shadowOpacity: 0 }}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Tableau de Bord
              </Text>
              <Text className="text-base text-gray-400 mt-1">
                Suivi de vos dons et contributions
              </Text>
            </View>
            <Ionicons name="stats-chart-outline" size={26} color="#A0AEC0" />
          </View>
        </Animated.View>

        {/* Solde Total */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="mx-6 mt-6 p-5 bg-blue-500 rounded-2xl"
          style={{ shadowOpacity: 0, elevation: 0 }}
        >
          <Text className="text-white text-base">Total des Dons</Text>
          <Text className="text-white text-3xl font-bold mt-1">$170</Text>
        </Animated.View>

        {/* Historique des transactions */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          className="mx-6 mt-8 flex-1"
        >
          <Text className="text-base font-semibold text-gray-700 mb-3">
            Historique des Dons
          </Text>
          <FlatList
            data={donations}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInUp.delay(index * 80).duration(500)}
                className="bg-white p-4 rounded-xl border border-gray-100 mt-3 flex-row justify-between items-center"
                style={{ shadowOpacity: 0, elevation: 0 }}
              >
                <View>
                  <Text className="text-lg font-bold text-gray-900">
                    ${item.amount}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    Donné le {item.date}
                  </Text>
                </View>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="green"
                />
              </Animated.View>
            )}
          />
        </Animated.View>

        {/* Section Partenaire */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          className="mx-6 my-6 p-5 bg-green-500 rounded-2xl"
          style={{ shadowOpacity: 0, elevation: 0 }}
        >
          <Text className="text-white text-base font-semibold text-center">
            🎉 En tant que Partenaire, vous avez accès à des contenus exclusifs
            !
          </Text>
        </Animated.View>

        {/* Bouton flottant */}
        <TouchableOpacity
          className="absolute bottom-7 right-7 bg-blue-500 p-4 rounded-full shadow-lg"
          style={{ elevation: 4 }}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  // ADMIN VIEW
  return (
    <SafeAreaView className="flex-1 bg-[#F5F6FA]">
      <ScrollView>
        <View className="px-6 pt-8 pb-4 bg-white border-b border-gray-100 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">
            Administration des posts
          </Text>
          <TouchableOpacity
            onPress={() => setShowAdd(true)}
            className="bg-blue-500 p-2 rounded-full"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {posts.map((post) => (
          <View
            key={post.$id}
            className="bg-white mx-6 mt-6 p-4 rounded-xl border border-gray-100"
          >
            {post.imageUrl ? (
              <Image
                source={{ uri: post.imageUrl }}
                className="w-full h-32 rounded-lg"
                resizeMode="cover"
              />
            ) : null}
            <Text className="text-lg font-bold mt-2">
              {post.text || "Sans titre"}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              Posté par {post.name || "?"}
            </Text>
            <View className="flex-row mt-3">
              <TouchableOpacity
                onPress={() => handleEdit(post)}
                className="mr-4 flex-row items-center"
              >
                <Ionicons name="create-outline" size={20} color="#4F46E5" />
                <Text className="ml-1 text-indigo-600">Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(post.$id)}
                className="flex-row items-center"
              >
                <Ionicons name="trash-outline" size={20} color="#E53E3E" />
                <Text className="ml-1 text-red-500">Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Modal ajout de post */}
      <Modal visible={showAdd} animationType="slide">
        <AddPostScreen
          navigation={{
            ...navigation,
            goBack: () => setShowAdd(false),
            reset: () => {
              setShowAdd(false);
              setRefresh((r) => !r);
            }
          }}
        />
      </Modal>
      {/* Modal édition */}
      <Modal visible={!!editPost} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              width: "85%"
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}
            >
              Modifier le post
            </Text>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              placeholder="Contenu du post"
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 8,
                padding: 8,
                marginBottom: 10
              }}
              multiline
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button title="Annuler" onPress={() => setEditPost(null)} />
              <View style={{ width: 10 }} />
              <Button title="Enregistrer" onPress={handleEditSave} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
