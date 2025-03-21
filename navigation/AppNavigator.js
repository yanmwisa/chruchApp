import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import AuthNavigator from "./AuthNavigator";
import AddPostScreen from "../screens/AddPostScreen";
import { useEffect, useState } from "react";
import {
  initializeAuth,
  getAuth,
  onAuthStateChanged,
  getReactNativePersistence
} from "firebase/auth";
import { getApps, getApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage"; // FIX: Ensure correct import
import { ActivityIndicator, View } from "react-native";

const Stack = createStackNavigator();

// Ensure Firebase is initialized only once
let auth;
let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage) // FIX: Use AsyncStorage directly
  });
} else {
  firebaseApp = getApp();
  auth = getAuth(firebaseApp);
}

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen
              name="AddPost"
              component={AddPostScreen}
              screenOptions={{ headerShown: false }}
              options={{ presentation: "modal" }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
