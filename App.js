import { View, Text, TouchableOpacity } from "react-native";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AppNavigator from "./navigation/AppNavigator";
import { app } from "./firebaseConfig";
console.log("Firebase initialisé :", app.name);
export default function App() {
  return (
    <>
      <AppNavigator />
    </>
  );
}
