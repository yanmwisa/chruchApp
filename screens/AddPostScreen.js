import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function AddPostScreen({ navigation }) {
  const [postText, setPostText] = useState("");
  const [media, setMedia] = useState(null);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    });
    if (!result.cancelled) {
      setMedia(result.uri);
    }
  };

  const handleSubmit = () => {
    // Submit postText and media URI here
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
          source={{ uri: media }}
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
