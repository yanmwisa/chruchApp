import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Share,
  Modal,
  Button,
  Alert
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { databases } from "../lib/appwrite";
import { Query } from "react-native-appwrite";
import { getCurrentUser } from "../lib/auth";
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "@env";

const posts = [];

export default function NewsFeedScreen({ navigation, route, isAdmin }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [commentModal, setCommentModal] = useState({
    visible: false,
    postId: null
  });
  const [comments, setComments] = useState({});
  const [shareCounts, setShareCounts] = useState({});
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setUserId(user?.$id);
    })();
  }, []);

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
        authorName: doc.name || "Auteur inconnu",
        likes: doc.likes || [],
        comments: doc.comments || [],
        shares: doc.shares || 0
      }));

      setPosts(formatted);
      setLikeCounts(
        Object.fromEntries(formatted.map((p) => [p.id, p.likes.length]))
      );
      setComments(Object.fromEntries(formatted.map((p) => [p.id, p.comments])));
      setShareCounts(
        Object.fromEntries(formatted.map((p) => [p.id, p.shares]))
      );
      setLikedPosts(
        formatted.filter((p) => p.likes.includes(userId)).map((p) => p.id)
      );
    } catch (err) {
      console.log("Erreur lors du chargement des posts :", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchPosts);
    return unsubscribe;
  }, [navigation, fetchPosts]);

  const toggleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || !userId) return;
    let newLikes;
    if (post.likes.includes(userId)) {
      newLikes = post.likes.filter((id) => id !== userId);
    } else {
      newLikes = [...post.likes, userId];
    }
    try {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        postId,
        { likes: newLikes }
      );
      fetchPosts();
    } catch (error) {
      Alert.alert("Erreur J'aime", error.message || JSON.stringify(error));
    }
  };

  const sharePost = async (item) => {
    try {
      await Share.share({
        message: `${item.title}\n${item.image || ""}`,
        url: item.image || undefined
      });
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        item.id,
        { shares: (item.shares || 0) + 1 }
      );
      fetchPosts();
    } catch (error) {
      Alert.alert("Erreur Partage", error.message || JSON.stringify(error));
    }
  };

  const openCommentModal = (postId) => {
    setCommentModal({ visible: true, postId });
    setNewComment("");
  };
  const closeCommentModal = () =>
    setCommentModal({ visible: false, postId: null });
  const addComment = async () => {
    if (!newComment.trim() || !userId) return;
    const post = posts.find((p) => p.id === commentModal.postId);
    if (!post) return;
    const newComments = [
      ...post.comments,
      { userId, text: newComment.trim(), date: new Date().toISOString() }
    ];
    try {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        post.id,
        { comments: newComments }
      );
      setNewComment("");
      fetchPosts();
    } catch (error) {
      Alert.alert("Erreur Commentaire", error.message || JSON.stringify(error));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F6FA]">
      {/* En-tête épuré */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="px-6 pt-8 pb-4 bg-white border-b border-gray-100"
        style={{ elevation: 0, shadowOpacity: 0 }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Fil d'Actualité
            </Text>
            <Text className="text-base text-gray-400 mt-1">
              Les dernières annonces et événements
            </Text>
          </View>
          <Ionicons name="notifications-outline" size={26} color="#A0AEC0" />
        </View>
      </Animated.View>

      {/* Barre de recherche minimaliste */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(500)}
        className="flex-row items-center bg-gray-100 px-4 py-3 mx-5 mt-5 rounded-xl"
        style={{ borderWidth: 1, borderColor: "#E5E7EB" }}
      >
        <Ionicons
          name="search"
          size={18}
          color="#A0AEC0"
          style={{ marginRight: 8 }}
        />
        <TextInput
          className="flex-1 text-gray-800 text-base"
          placeholder="Rechercher une annonce..."
          placeholderTextColor="#A0AEC0"
          value={search}
          onChangeText={setSearch}
          style={{ paddingVertical: 0 }}
        />
      </Animated.View>

      {/* Liste des annonces */}
      <FlatList
        data={posts.filter((post) =>
          post.title.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(index * 80)}
            className="bg-white mx-5 mt-5 p-0 rounded-2xl border border-gray-100"
            style={{ shadowOpacity: 0, elevation: 0 }}
          >
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                className="w-full h-44 rounded-t-2xl"
                style={{
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0
                }}
                resizeMode="cover"
              />
            ) : null}
            <View className="px-4 pt-4 pb-3">
              <Text
                className="text-lg font-semibold text-gray-900"
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                {item.date} • Posté par {item.authorName}
              </Text>
              {/* Boutons interactifs */}
              <View className="flex-row justify-between items-center mt-4">
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => toggleLike(item.id)}
                >
                  <Ionicons
                    name={
                      likedPosts.includes(item.id) ? "heart" : "heart-outline"
                    }
                    size={20}
                    color={likedPosts.includes(item.id) ? "#E53E3E" : "#A0AEC0"}
                  />
                  <Text
                    className={`ml-1 text-sm ${
                      likedPosts.includes(item.id)
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    J'aime
                  </Text>
                  <Text className="ml-1 text-xs text-gray-400">
                    {likeCounts[item.id] || 0}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => openCommentModal(item.id)}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    color="#A0AEC0"
                  />
                  <Text className="ml-1 text-gray-500 text-sm">Commenter</Text>
                  <Text className="ml-1 text-xs text-gray-400">
                    {(comments[item.id] || []).length}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => sharePost(item)}
                >
                  <Ionicons name="share-outline" size={20} color="#A0AEC0" />
                  <Text className="ml-1 text-gray-500 text-sm">Partager</Text>
                  <Text className="ml-1 text-xs text-gray-400">
                    {shareCounts[item.id] || 0}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      />

      {/* Modal Commentaires */}
      <Modal visible={commentModal.visible} animationType="slide" transparent>
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
              Commentaires
            </Text>
            {(comments[commentModal.postId] || []).map((c, i) => (
              <Text key={i} style={{ marginBottom: 4, color: "#444" }}>
                • {c.text}
              </Text>
            ))}
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Ajouter un commentaire..."
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 8,
                padding: 8,
                marginTop: 10,
                marginBottom: 10
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button title="Fermer" onPress={closeCommentModal} />
              <View style={{ width: 10 }} />
              <Button title="Envoyer" onPress={addComment} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
