import React, { createContext, useContext, useState, useEffect } from "react";
import { databases, ID } from "./appwrite";
import { APPWRITE_DATABASE_ID } from "@env";
import { getCurrentUser } from "./auth";
import {
  requestNotificationsPermissions,
  showLocalNotification,
  registerForPushNotificationsAsync,
  setupNotificationListener,
  setupBackgroundNotificationListener,
  sendPushNotificationsToAll
} from "./notificationService";
import { AppState } from "react-native";

// ID de collection pour les notifications
const NOTIFICATIONS_COLLECTION_ID = "682ac5ea002385d029ee";
// ID de collection pour les tokens de notification
const NOTIFICATION_TOKENS_COLLECTION_ID = "682ac6f9000c44f3dde8";

// Création du contexte
const NotificationContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useNotifications = () => useContext(NotificationContext);

// Provider qui enveloppera l'application
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastCheckTimestamp, setLastCheckTimestamp] = useState(Date.now());
  const [appState, setAppState] = useState(AppState.currentState);
  const [expoPushToken, setExpoPushToken] = useState(null);

  // Initialisation des permissions et enregistrement du token
  useEffect(() => {
    const setupNotifications = async () => {
      await requestNotificationsPermissions();
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        saveTokenToDatabase(token);
      }

      // Configurer les écouteurs de notifications
      const foregroundSubscription = setupNotificationListener(
        (notification) => {
          console.log("Notification reçue au premier plan:", notification);
          fetchNotifications();
        }
      );

      const backgroundSubscription = setupBackgroundNotificationListener(
        (response) => {
          console.log("Réponse de notification en arrière-plan:", response);
          fetchNotifications();
        }
      );

      return () => {
        foregroundSubscription.remove();
        backgroundSubscription.remove();
      };
    };

    setupNotifications();
  }, []);

  // Enregistrer le token dans la base de données
  const saveTokenToDatabase = async (token) => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      // Vérifier si ce token existe déjà
      try {
        const response = await databases.listDocuments(
          APPWRITE_DATABASE_ID,
          NOTIFICATION_TOKENS_COLLECTION_ID,
          [
            // Rechercher le token pour cet utilisateur
          ]
        );

        // Si le token existe déjà, ne pas le créer à nouveau
        const existingTokens = response.documents.filter(
          (doc) => doc.token === token && doc.user_id === user.$id
        );

        if (existingTokens.length > 0) {
          console.log("Token déjà enregistré pour cet utilisateur");
          return;
        }
      } catch (error) {
        console.log("Erreur lors de la vérification du token:", error);
      }

      // Créer un nouveau document de token
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        NOTIFICATION_TOKENS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          token: token,
          created_at: new Date().toISOString()
        }
      );
      console.log("Token enregistré avec succès:", token);
    } catch (error) {
      console.log("Erreur lors de l'enregistrement du token:", error);
    }
  };

  // Surveiller l'état de l'application
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // Quand l'app revient au premier plan, vérifier les nouvelles notifications
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        fetchNotifications();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  // Fonction pour récupérer les notifications
  const fetchNotifications = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const currentTimestamp = Date.now();

      try {
        // Tentative de récupération des notifications depuis Appwrite
        const response = await databases.listDocuments(
          APPWRITE_DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          []
        );

        if (response && response.documents) {
          const notifs = response.documents;

          // Vérifier les nouvelles notifications depuis la dernière vérification
          const newNotifications = notifs.filter(
            (doc) =>
              new Date(doc.created_at).getTime() > lastCheckTimestamp &&
              !doc.read
          );

          // Afficher des notifications pour les nouvelles entrées
          newNotifications.forEach((notification) => {
            showLocalNotification(notification.title, notification.message, {
              notificationId: notification.$id
            });
          });

          // Mettre à jour le timestamp de dernière vérification
          setLastCheckTimestamp(currentTimestamp);

          // Mettre à jour l'état
          setNotifications(notifs);

          // Calculer combien de notifications sont non lues
          const unread = notifs.filter((doc) => !doc.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.log("Erreur de récupération des notifications:", error);

        // Si l'erreur est liée à l'autorisation, utiliser des données factices
        const fakeNotifications = [
          {
            $id: "1",
            title: "Nouvelle publication",
            message: "L'administrateur a publié une nouvelle annonce.",
            created_at: new Date().toISOString(),
            read: false
          },
          {
            $id: "2",
            title: "Bienvenue",
            message: "Bienvenue dans l'application de l'église.",
            created_at: new Date(Date.now() - 86400000).toISOString(), // hier
            read: true
          }
        ];
        setNotifications(fakeNotifications);
        setUnreadCount(1); // Une notification non lue
      }
    } catch (error) {
      console.log("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      // Mise à jour dans Appwrite (si possible)
      try {
        await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          notificationId,
          { read: true }
        );
      } catch (error) {
        console.log("Impossible de mettre à jour la notification:", error);
      }

      // Mise à jour locale
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.$id === notificationId ? { ...notif, read: true } : notif
        )
      );

      // Recalculer le nombre de notifications non lues
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.log("Erreur lors du marquage comme lu:", error);
    }
  };

  // Fonction pour créer une notification (utilisée lors de la publication d'un post)
  const createNotification = async (title, message, postId) => {
    try {
      // Tentative de création dans Appwrite
      try {
        const newNotification = await databases.createDocument(
          APPWRITE_DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          ID.unique(),
          {
            title,
            message,
            created_at: new Date().toISOString(),
            post_id: postId,
            read: false,
            // Cette notification est pour tous les utilisateurs
            for_all_users: true
          }
        );

        // Ajouter la nouvelle notification à la liste et incrémenter le compteur
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Afficher une notification système locale sur cet appareil
        showLocalNotification(title, message, { postId });

        // Envoyer des notifications push à tous les appareils enregistrés
        await sendPushNotificationsToAll(title, message, { postId });
        console.log("Notifications push envoyées à tous les appareils");
      } catch (error) {
        console.log("Impossible de créer la notification:", error);
        // Créer une notification locale
        const fakeId = `local_${Date.now()}`;
        const newNotification = {
          $id: fakeId,
          title,
          message,
          created_at: new Date().toISOString(),
          post_id: postId,
          read: false,
          for_all_users: true
        };

        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Afficher une notification système même pour la notification locale
        showLocalNotification(title, message, { postId });

        // Essayer d'envoyer des notifications push même en cas d'échec de création de notification
        try {
          await sendPushNotificationsToAll(title, message, { postId });
          console.log(
            "Notifications push envoyées à tous les appareils malgré l'échec de création de notification"
          );
        } catch (pushError) {
          console.log("Échec de l'envoi des notifications push:", pushError);
        }
      }
    } catch (error) {
      console.log("Erreur lors de la création de notification:", error);
    }
  };

  // Charger les notifications au chargement initial
  useEffect(() => {
    fetchNotifications();

    // Vérifier périodiquement les nouvelles notifications (toutes les 30 secondes)
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  // Valeur du contexte
  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    createNotification,
    expoPushToken
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
