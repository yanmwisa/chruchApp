import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import AuthNavigator from "./AuthNavigator";
import AddPostScreen from "../screens/AddPostScreen";
import { useEffect, useState } from "react";
import { getCurrentUser, isAdmin, logout } from "../lib/auth";
import ResetScreen from "../screens/ResetScreen";
import { View, ActivityIndicator } from "react-native";


const Stack = createStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [isAdminValue, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const result = await isAdmin();
      console.log("isAdmin for this user:", result);
      setIsAdmin(result);
    };

    if (user) {
      checkAdmin();
    }
  }, [user]);

  // get current user
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout(); // from auth.js
    setUser(null);
    setIsAdmin(false);
  };

  // if (loading) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <ActivityIndicator size="large" color="blue" />
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MainTabs">
          {() => <BottomTabNavigator isAdmin={isAdminValue} />}
        </Stack.Screen>
        <Stack.Screen name="Reset" component={ResetScreen} />
        <Stack.Screen
          name="AddPost"
          component={AddPostScreen}
          screenOptions={{ headerShown: false }}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default AppNavigator;
