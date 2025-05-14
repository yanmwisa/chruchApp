import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView
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

export default function AddPostScreen({ navigation }) {
  const [postText, setPostText] = useState("");
  const [media, setMedia] = useState(null);

  useEffect(() => {
    (async () => {
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

    if (!media || !media.uri) {
      console.log("Media or media.uri is missing or invalid:", media);
      return;
    }

    try {
      const currentUser = await account.get();

      // Solution temporaire : utiliser directement l'URI de l'image locale
      // Note: Cela fonctionnera uniquement sur l'appareil qui a créé le post
      // Pour une solution permanente, l'app devra être éjectée ou utiliser un serveur intermédiaire
      const imageUrl = media.uri;

      // Création du post avec l'URL de l'image
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          text: postText,
          imageUrl: imageUrl,
          created_at: new Date().toISOString(),
          created_by: currentUser.$id,
          name: currentUser.name,
          likes: [],
          comments: [],
          shares: 0
        }
      );

      console.log(
        "Post créé avec succès avec l'URL locale de l'image:",
        imageUrl
      );

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
      {/* En-tête moderne */}
      <View className="px-6 pt-8 pb-4 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">
          Nouvelle annonce
        </Text>
        <Ionicons name="add-circle-outline" size={28} color="#A0AEC0" />
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
