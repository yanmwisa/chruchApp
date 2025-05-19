import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { databases, storage, ID, account } from "../lib/appwrite";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
  APPWRITE_BUCKET_ID
} from "@env";
import Ionicons from "@expo/vector-icons/Ionicons";
import { isAdmin } from "../lib/auth";
import { useNotifications } from "../lib/NotificationContext";

export default function AddPostScreen({ navigation }) {
  const [postText, setPostText] = useState("");
  const [media, setMedia] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const { createNotification } = useNotifications();

  useEffect(() => {
    (async () => {
      // Vérifie si l'utilisateur est admin
      const adminStatus = await isAdmin();
      setUserIsAdmin(adminStatus);

      const mediaStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

      if (
        mediaStatus.status !== "granted" ||
        cameraStatus.status !== "granted"
      ) {
        alert("Sorry, we need media and camera permissions to make this work!");
      }
    })();
  }, []);

  const pickMedia = async () => {
    console.log("Button pressed");

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "All",
        allowsEditing: true,
        quality: 1
      });

      console.log("Picker result:", result);

      if (!result.canceled && result.assets?.length > 0) {
        const selectedAsset = result.assets[0];
        console.log("Selected asset:", selectedAsset);
        setMedia(selectedAsset);
      }
    } catch (error) {
      console.log("Error picking media:", error);
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting post...");

    // Vérifier que le texte du post n'est pas vide
    if (!postText.trim()) {
      Alert.alert(
        "Erreur",
        "Veuillez ajouter un texte pour votre publication."
      );
      return;
    }

    try {
      const currentUser = await account.get();

      // Création du post avec ou sans image
      const postData = {
        text: postText,
        created_at: new Date().toISOString(),
        created_by: currentUser.$id,
        name: currentUser.name || "Anonyme"
      };

      // Ajouter l'URL de l'image uniquement si une image est sélectionnée
      if (media && media.uri) {
        postData.imageUrl = media.uri;
      } else {
        // Si pas d'image, utiliser une URL d'image vide par défaut qui est valide
        postData.imageUrl = "https://placehold.co/400x300?text=Pas+d'image";
      }

      const newPost = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        ID.unique(),
        postData
      );

      console.log("Post créé avec succès");

      // Si l'utilisateur est un administrateur, créez une notification en temps réel
      if (userIsAdmin) {
        try {
          const notificationContent =
            postText.substring(0, 50) + (postText.length > 50 ? "..." : "");

          // Utiliser le contexte de notification pour créer une notification en temps réel
          await createNotification(
            "Nouvelle publication",
            `${
              currentUser.name || "L'administrateur"
            } a publié: ${notificationContent}`,
            newPost.$id
          );

          console.log("Notification créée avec succès via le contexte");
        } catch (notificationError) {
          console.log(
            "Impossible de créer la notification:",
            notificationError
          );
        }
      }

      setPostText("");
      setMedia(null);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            state: {
              routes: [
                {
                  name: "NewsFeed",
                  params: { refresh: Date.now() }
                }
              ]
            }
          }
        ]
      });
    } catch (error) {
      console.error("Error posting:", error.message, error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F6FA]">
      {/* En-tête moderne avec bouton de fermeture X */}
      <View className="px-6 pt-8 pb-4 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#A0AEC0" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">
          Nouvelle annonce
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons name="close-circle" size={28} color="#A0AEC0" />
        </TouchableOpacity>
      </View>
      {/* Carte d'édition */}
      <View className="mx-6 mt-8 bg-white rounded-2xl border border-gray-100 p-5">
        <TextInput
          value={postText}
          onChangeText={setPostText}
          placeholder="Qu'avez-vous à partager ?"
          placeholderTextColor="#A0AEC0"
          multiline
          className="h-32 text-base text-gray-800 mb-4"
          style={{ textAlignVertical: "top" }}
        />
        {media && (
          <Image
            source={{ uri: media.uri }}
            className="w-full h-40 rounded-xl mb-4"
            resizeMode="cover"
          />
        )}
        <TouchableOpacity
          onPress={pickMedia}
          className="bg-gray-100 rounded-xl p-4 items-center mb-4 border border-gray-200"
        >
          <Text className="text-gray-700 font-semibold">
            Télécharger une image ou vidéo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-purple-700 rounded-xl p-4 items-center"
        >
          <Text className="text-white font-bold text-base">Publier</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
