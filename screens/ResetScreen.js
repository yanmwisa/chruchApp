import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import * as Linking from "expo-linking";
import { confirmPasswordRecovery } from "../lib/auth";

export default function ResetScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [secret, setSecret] = useState("");

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      console.log("Received URL:", url); // log full URL
      if (url) {
        const queryString = url.split("?")[1];
        const params = new URLSearchParams(queryString);
        const userId = params.get("userId");
        const secret = params.get("secret");

        console.log("Parsed userId:", userId);
        console.log("Parsed secret:", secret);

        if (
          typeof userId === "string" &&
          userId.length <= 36 &&
          /^[a-zA-Z0-9_]+$/.test(userId)
        ) {
          setUserId(userId);
        }

        if (typeof secret === "string") {
          setSecret(secret);
        }
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  const handleReset = async () => {
    try {
      await confirmPasswordRecovery(userId, secret, newPassword);
      Alert.alert("Success", "Password has been reset");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log("error", error);
    }
  };

  return (
    <View className="flex-1 p-5 justify-center bg-white">
      <Text className="text-lg font-semibold mb-4 text-center">Enter New Password</Text>
      <TextInput
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        className="border-b border-gray-300 mb-6 px-2 py-2 text-base"
      />
      <Button title="Reset Password" onPress={handleReset} />
    </View>
  );
}
