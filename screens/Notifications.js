import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useNotifications } from "../lib/NotificationContext";

const Notifications = () => {
  const { notifications, loading, markAsRead } = useNotifications();

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => markAsRead(item.$id)}
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
    >
      <View style={styles.notificationIcon}>
        <Ionicons
          name="notifications"
          size={24}
          color={item.read ? "#A0AEC0" : "#4F46E5"}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="#A0AEC0" />
        </TouchableOpacity>
      </Animated.View>

      {loading ? (
        <View style={styles.loading}>
          <Text>Chargement des notifications...</Text>
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.$id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color="#CBD5E0"
          />
          <Text style={styles.emptyStateText}>Aucune notification</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB"
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A202C"
  },
  listContainer: {
    padding: 16
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  unreadNotification: {
    backgroundColor: "#F8FAFC",
    borderLeftWidth: 3,
    borderLeftColor: "#4F46E5"
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  notificationContent: {
    flex: 1
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A202C",
    marginBottom: 4
  },
  notificationMessage: {
    fontSize: 14,
    color: "#4A5568",
    marginBottom: 6
  },
  notificationTime: {
    fontSize: 12,
    color: "#A0AEC0"
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4F46E5",
    alignSelf: "flex-start",
    marginTop: 6
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32
  },
  emptyStateText: {
    fontSize: 16,
    color: "#718096",
    marginTop: 16,
    textAlign: "center"
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
