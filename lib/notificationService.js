import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { databases } from "./appwrite";
import { APPWRITE_DATABASE_ID } from "@env";
import Constants from "expo-constants";
import * as Device from "expo-device";

const NOTIFICATIONS_COLLECTION_ID = "682ac5ea002385d029ee";

// Configurer le comportement des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

// Demander les permissions de notification
export async function requestNotificationsPermissions() {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Si nous n'avons pas déjà la permission, demandons-la
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Si nous n'avons toujours pas la permission, retournons false
    if (finalStatus !== "granted") {
      console.log("Permission pour les notifications non accordée!");
      return false;
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#4F46E5"
      });
    }

    return true;
  } catch (error) {
    console.log("Erreur lors de la demande de permissions:", error);
    return false;
  }
}

// Enregistrer le token de notification push
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#4F46E5"
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log(
        "Échec de l'obtention du token push pour les notifications push!"
      );
      return null;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId
      })
    ).data;

    console.log("Token de notification:", token);
  } else {
    console.log(
      "Les notifications push ne fonctionnent pas sur un émulateur/simulateur"
    );
  }

  return token;
}

// Afficher une notification locale
export async function showLocalNotification(title, body, data = {}) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true
      },
      trigger: null // Afficher immédiatement
    });
  } catch (error) {
    console.log("Erreur lors de l'affichage de la notification:", error);
  }
}

// Vérifier les nouvelles notifications depuis un timestamp
export async function checkForNewNotifications(lastCheckTime) {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      [
        /* filtres pour récupérer les notifications plus récentes que lastCheckTime */
      ]
    );

    if (response && response.documents) {
      const newNotifications = response.documents.filter(
        (doc) => new Date(doc.created_at) > new Date(lastCheckTime)
      );

      return newNotifications;
    }
  } catch (error) {
    console.log(
      "Erreur lors de la vérification des nouvelles notifications:",
      error
    );
  }

  return [];
}

// Configurer un écouteur pour les notifications reçues
export function setupNotificationListener(onNotificationReceived) {
  const subscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    }
  );

  return subscription;
}

// Configurer un écouteur pour les notifications reçues lorsque l'app est en arrière-plan
export function setupBackgroundNotificationListener(onNotificationResponse) {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    }
  );

  return subscription;
}

// Envoyer des notifications push à tous les appareils
export async function sendPushNotificationsToAll(title, body, data = {}) {
  try {
    // Récupérer tous les tokens de notification enregistrés
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      "682ac6f9000c44f3dde8" // NOTIFICATION_TOKENS_COLLECTION_ID
    );

    if (!response || !response.documents || response.documents.length === 0) {
      console.log("Aucun token de notification trouvé");
      return;
    }

    const tokens = response.documents.map((doc) => doc.token);
    console.log(`Envoi de notifications à ${tokens.length} appareils`);

    // Utiliser l'API Expo pour envoyer des notifications push
    const messages = tokens.map((token) => ({
      to: token,
      sound: "default",
      title: title,
      body: body,
      data: data
    }));

    // Appel à l'API Expo Push
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messages)
    });

    console.log("Notifications push envoyées avec succès");
  } catch (error) {
    console.log("Erreur lors de l'envoi des notifications push:", error);
  }
}
