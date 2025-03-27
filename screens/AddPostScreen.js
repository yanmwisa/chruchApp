import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";


export default function AddPostScreen({ navigation }) {
  const [postText, setPostText] = useState("");
  const [media, setMedia] = useState(null);

  useEffect(() => {
    (async () => {
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

      if (mediaStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
        alert('Sorry, we need media and camera permissions to make this work!');
      }
    })();
  }, []);

  const pickMedia = async () => {
    console.log("Button pressed");
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "All",
        allowsEditing: true,
        quality: 1,
      });
  
      console.log("Picker result:", result);
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setMedia(result.assets[0]);
      }
    } catch (error) {
      console.log("Error picking media:", error);
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting post...");

    if (!media) {
      console.log("Missing media");
      return;
    }

    try {
      let uploadUri = media.uri;
      console.log("Original URI:", uploadUri);

      if (media.type === 'image') {
        console.log("Manipulating image...");
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          media.uri,
          [],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: false }
        );
        console.log("Image manipulated:", manipulatedImage.uri);
        uploadUri = manipulatedImage.uri;
      }

      console.log("Reading file as base64...");
      const base64 = await FileSystem.readAsStringAsync(uploadUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const filename = `${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
      const storageRef = ref(storage, `posts/${filename}`);
      console.log("Uploading base64 to Firebase Storage...");
      const response = await fetch(uploadUri);
      const blob = await response.blob();
      const metadata = { contentType: 'image/jpeg' };
      const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
      uploadTask.on('state_changed',
        snapshot => console.log('Upload progress:', (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        error => console.error('Upload failed:', error),
        async () => {
          console.log('Upload successful');
        }
      );
      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL retrieved:", downloadURL);

      console.log("Saving post to Firestore...");
      await addDoc(collection(db, "posts"), {
        text: postText,
        imageUrl: downloadURL,
        createdAt: Timestamp.now()
      });
      console.log("Post saved to Firestore");

      setPostText("");
      setMedia(null);
      navigation.navigate("NewsFeed");
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
