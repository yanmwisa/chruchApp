import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { databases, storage, ID, account } from "../lib/appwrite";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
  APPWRITE_BUCKET_ID
} from "@env";

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

    console.log("media:", media);
    console.log("media.uri:", media?.uri);

    try {
      const currentUser = await account.get();
      const imageUrl = media.uri;

      // Save post data in Appwrite Database
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          text: postText,
          imageUrl: imageUrl,
          created_at: new Date().toISOString(),
          created_by: currentUser.$id,
          name: currentUser.name
        }
      );

      console.log("Post saved to Appwrite DB");

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
    <View className="flex-1 p-4 bg-white">
      <TextInput
        value={postText}
        onChangeText={setPostText}
        placeholder="What's on your mind?"
        placeholderTextColor="#9CA3AF"
        multiline
        className="h-40 border border-gray-300 rounded-lg p-3 text-base mb-5"
      />
      <TouchableOpacity
        onPress={pickMedia}
        className="bg-gray-200 rounded-lg p-4 items-center mb-5"
      >
        <Text className="text-gray-700 font-bold">Upload Image/Video</Text>
      </TouchableOpacity>
      {media && (
        <Image
          source={{ uri: media.uri }}
          className="w-full h-40 rounded-lg mb-5"
          resizeMode="cover"
        />
      )}
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-purple-700 rounded-lg p-4 items-center"
      >
        <Text className="text-white font-bold">Post</Text>
      </TouchableOpacity>
    </View>
  );
}
