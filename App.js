import React, { useEffect } from "react";
import AppNavigator from "./navigation/AppNavigator";
import { NotificationProvider } from "./lib/NotificationContext";
import { registerForPushNotificationsAsync } from "./lib/notificationService";
import { Alert, LogBox } from "react-native";

// Ignorer certains avertissements non importants
LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  useEffect(() => {
    // Vérifier l'état des notifications au démarrage
    const checkNotificationStatus = async () => {
      const token = await registerForPushNotificationsAsync();
      console.log("Token de notification au démarrage:", token);
      if (!token) {
        console.log("Aucun token de notification obtenu");
      }
    };

    checkNotificationStatus();
  }, []);

  return (
    <NotificationProvider>
      <AppNavigator />
    </NotificationProvider>
  );
}
